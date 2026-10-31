require "zlib"

def bust_cache(source_dir, file_path)
  clean_path = file_path.split("?").first.split("#").first
  if !file_path.include?("v=") && clean_path.start_with?("/") &&
       !clean_path.start_with?("//")
    absolute_path = File.join(source_dir, clean_path)
    if File.exist?(absolute_path)
      file_hash =
        Jekyll::CacheBuster.hash_cache[absolute_path] ||= begin
          Zlib.crc32(File.read(absolute_path)).to_s(36)
        rescue StandardError
          nil
        end
      if file_hash
        file_path =
          "#{file_path}#{file_path.include?("?") ? "&" : "?"}v=#{file_hash}"
      end
    end
  end
  file_path
end

Jekyll::Hooks.register :site, :post_write, priority: :high do |site|
  bust_cache_patters = [
    '<script src=["\']\/assets\/js\/.+?["\']',
    'const \w+ = ["\']/assets/.+?["\']',
    '<link rel=["\'](alternate-)?stylesheet["\'] href=["\']\/assets\/css\/.+?["\']',
    '<img\s.*?src=["\']\/assets\/.+?["\']'
  ]
  languages = site.config["languages"] || []
  Dir
    .glob([File.join(site.dest, "**/*.html")])
    .reject do |file_path|
      languages.any? do |lang|
        file_path.start_with?(File.join(destination_dir, lang))
      end
    end
    .each do |file_path|
      content = File.read(file_path)
      bust_cache_patters.each do |pattern|
        content.gsub!(Regexp.new(pattern)) do |match|
          if match =~ %r{=\s*["'](/assets/[^"']+)["']}
            match.sub!($1, bust_cache(site.dest, $1))
          end
          match
        end
      end
      File.write(file_path, content)
    end
end
