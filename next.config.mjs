/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    reactStrictMode: true,
    skipTrailingSlashRedirect: true,
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.hashnode.com',
        },
        {
          protocol: 'https',
          hostname: '**.beehiiv.com',
        },
      ],
    },
  };
  
export default nextConfig;
