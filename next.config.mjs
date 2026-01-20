/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    // Removed output: "export" to enable hybrid rendering with ISR
    reactStrictMode: true,
    skipTrailingSlashRedirect: true,
    images: {
      unoptimized: true,  // Keep unoptimized for compatibility
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
