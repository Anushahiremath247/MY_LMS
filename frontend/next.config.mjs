/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "api.dicebear.com" }
    ]
  }
};

export default nextConfig;
