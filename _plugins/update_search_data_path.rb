Jekyll::Hooks.register :site, :post_write do |site|
  file_path = File.join(site.dest, "assets/js/just-the-docs.js")
  content = File.read(file_path)
  content.sub!(%r{'/assets/js/search-data.json'}, "searchDataPath")
  File.write(file_path, content)
end
