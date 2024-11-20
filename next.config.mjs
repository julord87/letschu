/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['acdn.mitiendanube.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

export default nextConfig;
