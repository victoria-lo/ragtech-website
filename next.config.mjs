/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    images: {
      unoptimized: true,  // Disable image optimization for static export
    },
  };
  
export default nextConfig;
