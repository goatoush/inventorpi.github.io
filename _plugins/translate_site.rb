require "google/cloud/translate"
require "yaml"
require "json"
require "hexapdf"
require "dotenv"
Dotenv.load

def read_between(text, left, right)
  regex = /#{Regexp.escape(left)}(.*?)#{Regexp.escape(right)}/
  text[regex, 1]
end

def expand(text)
  text
    .gsub(
      %r{\[notranslatecode\](.+?)\[/notranslatecode\]},
      "<span translate=\"no\"><code class=\"language-plaintext highlighter-rouge\">\\1</code></span>"
    )
    .gsub(%r{\[a(.+?)\](.+?)\[/a\]}, "<a\\1>\\2</a>")
    .gsub(
      %r{\[notranslate\](.+?)\[/notranslate\]},
      "<span translate=\"no\">\\1</span>"
    )
    .gsub(
      %r{\[notranslateimg\](.+?)\[/notranslateimg\]},
      "<span translate=\"no\"><\\1></span>"
    )
end

# keep language subfolders in _site
Jekyll::Hooks.register :site, :after_init do |site|
  languages = site.config["languages"] || []
  language_codes = languages.map { |lang| lang["code"] }
  site.config["keep_files"] ||= []
  site.config["keep_files"].concat(language_codes).uniq!
end

Jekyll::Hooks.register :site, :post_write do |site|
  next if site.config["serving"]

  # Initialize
  destination_dir = site.dest
  source_dir = site.source
  site_url = Regexp.escape(site.config["url"])
  pdfs = site.config["pdfs"] || []
  preserve_text = site.config["preserve_text"] || []
  languages = site.config["languages"] || []
  next unless languages.length > 1
  language_codes = languages.map { |lang| lang["code"] }
  default_lang = language_codes[0]
  target_languages = language_codes - [default_lang]
  yaml_file_path = File.join(source_dir, "_data/en.yml")
  en_text = {}
  i18n_keys = {}

  # Update sitemap.xml
  sitemap_file_path = File.join(destination_dir, "sitemap.xml")
  content = File.read(sitemap_file_path)
  content.gsub!(%r{<url>.+?<loc>([^<]+)</loc>.*?</url>}m) do |url_tag|
    match = url_tag
    target_languages.each do |lang|
      match +=
        "\n" + url_tag.sub(%r{(<loc>#{site_url})(.*?</loc>)}m, "\\1/#{lang}\\2")
    end
    match
  end
  File.write(sitemap_file_path, content)

  # Read files to be updated
  files_to_be_updated =
    Dir
      .glob(
        [
          File.join(destination_dir, "**/*.html"),
          File.join(destination_dir, "assets/js/search-data.json")
        ]
      )
      .reject do |file_path|
        target_languages.any? do |lang|
          file_path.start_with?(File.join(destination_dir, lang))
        end
      end
  files_to_be_updated.each do |file_path|
    content = File.read(file_path)
    text_content =
      content
        .gsub(%r{<section class="select-lang.+?<\/section>}m, "")
        .gsub(%r{<button class="site-button lang.+?<\/button>}m, "")
        .gsub(%r{<script.+?<\/script>}m, "")
        .gsub(%r{<pre.+?<\/pre>}m, "")
        .gsub(%r{[a-zA-Z]\s<a href="/.+?">.+?<\/a>}) do |s|
          s.gsub(/</, "[").gsub(/>/, "]")
        end
        .gsub(%r{<symbol.+?<\/symbol>}m, "")
        .gsub(
          %r{<code class="language-plaintext highlighter-rouge">(.+?)<\/code>},
          "[notranslatecode]\\1[/notranslatecode]"
        )
        .gsub(
          /<(img.+?class="inline-img".*?)>/,
          "[notranslateimg]\\1[/notranslateimg]"
        )
        .gsub(%r{<code>.+?<\/code>}m, "")
        .gsub(%r{<style.+?<\/style>}m, "")
    preserve_text.each do |preserve_text|
      text_content.gsub!(/(#{preserve_text})/, "[notranslate]\\1[/notranslate]")
    end
    matches =
      text_content.scan(/>([^<]+)</).map { |match| match[0] }.reject(&:empty?)
    text = []
    # puts "matches = #{matches}" if file_path.include?("index.html")
    matches.each do |match|
      match
        .split(/←|→|↓|➔|\||©|(?<!Ms|Mr|Dr|Inc|St)\. |&copy;|&nbsp;| /)
        .map(&:strip)
        .map { |s| s.delete_suffix(".") }
        .reject { |s| s.match?(/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/) }
        .reject { |s| s.length <= 1 }
        .each { |s| text << expand(s) }
    end
    text_content
      .scan(%r{ (alt|placeholder|title|aria-label)="([^"]+)"})
      .map { |match| match[1] }
      .reject(&:empty?)
      .each { |s| text << expand(s) }
    content.gsub(%r{<pre\s+class="center-flowchart">.*?</pre>}m) do |match|
      match.gsub(/\(([^()]+)\)/) { |match| text << $1 }
    end
    text.each { |key| en_text[key] = key }
    if i18n_keys.keys.empty?
      i18n_keys =
        read_between(content, "i18nText = JSON.parse(`{", "}`);") || ""
      i18n_keys = JSON.parse("{" + i18n_keys + "}")
      i18n_keys.each { |key, value| en_text[key] = key }
    end
  end
  languages.map { |lang| lang["label_en"] }.each { |key| en_text[key] = key }
  if !en_text.empty?
    File.write(
      yaml_file_path,
      YAML.dump(en_text.sort.to_h).sub(/\A---\s*\n/, "")
    )
  end

  # Repeat for each target language
  target_languages.each do |lang|
    # Find new text keys to translate
    puts "      Generating language subdirectory '#{lang}'..."
    start_time = Time.now
    yaml_file_path = File.join(source_dir, "_data/#{lang}.yml")
    lang_text = YAML.safe_load_file(yaml_file_path) || {}
    lang_text.delete_if { |key, value| !en_text.include?(key) }
    new_text_keys = []
    en_text.keys.each do |key|
      new_text_keys << key unless lang_text.include?(key)
    end

    if ENV["GOOGLE_APPLICATION_CREDENTIALS"]
      # Translate text
      client = Google::Cloud::Translate.translation_service
      parent = "projects/inventorpi/locations/global"
      until new_text_keys.empty?
        new_text_keys_batch = []
        new_text_keys_batch_length = 0
        while !new_text_keys.empty? &&
                new_text_keys_batch_length + new_text_keys[0].to_s.length <
                  25_000 && new_text_keys_batch.length < 1024
          new_text_keys_batch_length += new_text_keys[0].to_s.length
          new_text_keys_batch << new_text_keys.shift
        end
        puts "Lang = #{lang}, Keys = #{new_text_keys_batch.length}, Length = #{new_text_keys_batch_length}"
        response =
          client.translate_text(
            contents: new_text_keys_batch,
            target_language_code: lang,
            parent: parent,
            source_language_code: "en"
          )
        translations = response.translations.map(&:translated_text)
        new_text_keys_batch.each_with_index do |key, index|
          lang_text[key] = translations[index].delete_suffix(".")
        end
      end
      if !lang_text.empty?
        File.write(yaml_file_path, YAML.dump(lang_text).sub(/\A---\s*\n/, ""))
      end

      # Translate PDFs
      pdfs.each do |pdf|
        pdf_file_path = File.join(source_dir, pdf)
        lang_pdf_file_path = File.join(destination_dir, lang, pdf)
        unless File.exist?(lang_pdf_file_path)
          source_doc = HexaPDF::Document.open(pdf_file_path)
          target_doc = HexaPDF::Document.new
          (0...15).each do |i|
            if source_doc.pages.length > i
              target_doc.pages << target_doc.import(source_doc.pages[i])
            end
          end
          io = StringIO.new
          target_doc.write(io)
          file_bytes = io.string
          response =
            client.translate_document(
              target_language_code: lang,
              parent: parent,
              document_input_config: {
                content: file_bytes,
                mime_type: "application/pdf"
              }
            )
          translated_bytes =
            response.document_translation.byte_stream_outputs.first
          FileUtils.mkdir_p(File.dirname(lang_pdf_file_path))
          File.binwrite(lang_pdf_file_path, translated_bytes)
        end
      end
    end

    # Apply translations
    i18n = {}
    i18n_keys.each { |key, value| i18n[key] = lang_text[key] }
    lang_text_sorted = lang_text.sort_by { |k, v| -k.to_s.length }.to_h

    # Repeat for each file
    files_to_be_updated.each do |file_path|
      content = File.read(file_path)
      # Add lang to html tag
      content.gsub!(/<html[^>]*?>/, "<html lang=\"#{lang}\">")

      # Enable rtl css
      if languages.find { |l| l["code"] == lang }["rtl"]
        content.sub!(/<html([^>]*?>)/, "<html dir=\"rtl\"\\1")
        content.sub!(
          %r{<link rel="alternate-stylesheet" href="/assets/css/rtl.css},
          "<link rel=\"stylesheet\" href=\"\/assets\/css\/rtl.css"
        )
      end

      # Update head
      content.gsub!(
        /<meta property="og:locale" content="[^>]*?>/,
        "<meta property=\"og:locale\" content=\"#{lang}\">"
      )
      content.sub!(/(og:locale:alternate" content=")#{lang}"/, "\\1en\"")

      # Add placeholders for blocks that should not be translated
      preserved_blocks = []
      content.gsub!(%r{<code>.*?</code>}m) do |match|
        preserved_blocks << match
        "___PRESERVED_BLOCK_PLACEHOLDER_#{preserved_blocks.size - 1}___"
      end
      content.gsub!(%r{<div class="select-lang-text">.*?</div>}m) do |match|
        preserved_blocks << match
        "___PRESERVED_BLOCK_PLACEHOLDER_#{preserved_blocks.size - 1}___"
      end

      # Repeat for each text key, sorted in reverse order by size
      lang_text_sorted.each do |key1, value|
        key =
          Regexp.escape(key1.gsub(%r{<span translate="no">(.+?)</span>}, "\\1"))
        value.gsub!(%r{<span translate="no">(.+?)</span>}, "\\1")
        content.gsub!(
          /(?:alt|placeholder|title|aria-label|name=\"description\" content|property=\"og:.+?\" content|property=\"twitter:.+?\" content)\="\K#{key}/,
          value
        )
        content.gsub!(/(?<!\=")#{key}(?![^<>]*>)/, value)
      end

      # Insert /lang in links
      content.gsub!(
        %r{(<a\s+[^>]*href=["']|<link rel="prefetch" href="|<link rel="canonical" href="#{site_url}|<meta property="og:url" content="#{site_url}|\}\},"url"\:"#{site_url})/([^"']*["'])}m
      ) do
        prefix = $1
        path = $2
        match = $&
        if prefix =~ /(class="lang")/
          match
        else
          "#{prefix}/#{lang}/#{path}"
        end
      end
      if file_path.include?("search-data.json")
        content.gsub!(%r{("url": "|"relUrl": ")(/[^"']*["'])}, "\\1/#{lang}\\2")
      end

      # Write translated i18n keys used by javascript i18n()
      content.sub!(
        /i18nText = JSON\.parse\(`\{.+?\}`\);/m,
        "i18nText = " + JSON.dump(i18n) + ";"
      )

      # Restore preserved blocks
      content.gsub!(/___PRESERVED_BLOCK_PLACEHOLDER_(\d+)___/) do
        preserved_blocks[$1.to_i]
      end

      new_file_path =
        file_path.sub(destination_dir, File.join(destination_dir, lang))
      FileUtils.mkdir_p(File.dirname(new_file_path))
      File.write(new_file_path, content)
    end

    puts "                    done in #{sprintf("%.1f seconds", Time.now - start_time)} secdonds."
  end
end
