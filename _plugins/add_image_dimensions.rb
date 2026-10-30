require 'nokogiri'
require 'fastimage'

Jekyll::Hooks.register :site, :post_write do |site|
  html_files = Dir.glob(File.join(site.dest, '**', '*.html'))

  html_files.each do |file_path|
    content = File.read(file_path)
    next unless content.include?('<img')

    html = Nokogiri::HTML(content)
    images = html.css('img')
    mutated = false

    images.each do |img|
      next if img['width'] || img['height']

      src = img['src']
      next if src.nil? || src.empty? || src.start_with?('http://', 'https://', '//')

      baseurl = site.config['baseurl'] || ''
      clean_path = CGI.unescape(src.sub(/\A#{Regexp.escape(baseurl)}/, '').sub(%r{\A/}, ''))
      image_file_path = File.join(site.dest, clean_path)

      next unless File.exist?(image_file_path)

      size = FastImage.size(image_file_path)
      next unless size

      img['width']  = size[0].to_s
      img['height'] = size[1].to_s
      img['fetchpriority'] = 'high' unless img['loading']
      mutated = true
    end

    File.open(file_path, 'w') { |f| f.write(html.to_html) } if mutated
  end
end
