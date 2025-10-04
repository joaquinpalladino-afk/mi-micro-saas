/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [new URL('lh3.googleusercontent.com')],
  },
}

export default nextConfig;
