/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    domains: ["divyanshudhruv.vercel.app"], // Add the domain hosting the image
    path: "/_next/image", // Specify the path for Next.js image optimization
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
