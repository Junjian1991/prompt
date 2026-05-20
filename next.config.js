/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/prompt',
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig