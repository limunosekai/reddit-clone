/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "www.gravatar.com",
      "ec2-52-78-40-248.ap-northeast-2.compute.amazonaws.com",
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
