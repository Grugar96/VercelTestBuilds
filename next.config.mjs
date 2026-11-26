/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      { source: '/video/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },
      { source: '/img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },
    ];
  },
};
export default nextConfig;
