require "zlib"

module Jekyll
  module CacheBuster
    # In-memory cache to store file hashes and avoid re-reading files across multiple pages
    @hash_cache = {}

    def bust_cache(input_path)
      return input_path if input_path.nil? || input_path.empty?

      # Resolve the absolute path of the file within the Jekyll source directory
      context = @context.registers[:site]
      source_dir = context.source
      absolute_path = File.expand_path(File.join(source_dir, input_path))

      # Return the original path if the file doesn't exist on disk
      return input_path unless File.exist?(absolute_path)

      # FIX: Explicitly call the module namespace instead of self.class
      file_hash =
        Jekyll::CacheBuster.hash_cache[absolute_path] ||= begin
          content = File.read(absolute_path)
          # Calculate CRC32 integer and convert it to a compact Base36 string
          Zlib.crc32(content).to_s(36)
        rescue => e
          Jekyll.logger.warn "CacheBuster:",
                             "Could not read file at #{absolute_path}: #{e.message}"
          nil
        end

      # Append the short query string if a hash was successfully generated
      file_hash ? "#{input_path}?v=#{file_hash}" : input_path
    end

    class << self
      attr_reader :hash_cache
    end
  end
end

Liquid::Template.register_filter(Jekyll::CacheBuster)
