/** @type {import('next').NextConfig} */
const nextConfig = {
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
  //https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/University-of-Alabama-EngineeringResearchCenter-01.jpg/1280px-University-of-Alabama-EngineeringResearchCenter-01.jpg
  
export default nextConfig;
