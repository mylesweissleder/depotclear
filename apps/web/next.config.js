/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.thdstatic.com',
      },
    ],
  },
};

export default nextConfig;
