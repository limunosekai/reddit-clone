/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "www.gravatar.com", "*"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
