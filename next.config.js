/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add a rule to handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js',
    }

    return config
  },
}

module.exports = nextConfig
