/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["https://agentic-c2e4a540.vercel.app", "http://localhost:3000"]
    }
  }
};

export default nextConfig;
