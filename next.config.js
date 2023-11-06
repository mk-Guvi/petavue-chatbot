/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.intercomassets.com",
        port: "",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "gifs.intercomcdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
