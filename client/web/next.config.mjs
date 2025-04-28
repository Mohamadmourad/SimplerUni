/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Enable static export

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/wikipedia/commons/thumb/c/cd/University-of-Alabama-EngineeringResearchCenter-01.jpg/*',
      },
    ],
  },
};

export default nextConfig;
