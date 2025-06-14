/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all domains
      },
    ],
    path: "/_next/image", // Specify the path for Next.js image optimization
    formats: ["image/avif", "image/webp"], // Allow all supported image formats
  },
  async rewrites() {
    return [
      {
        source: "/@:user",
        destination: "/:user",
      },
    ];
  },
};

export default nextConfig;
