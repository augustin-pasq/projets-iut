/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/play',
        missing: [
          {
            type: 'cookie',
            key: 'database',
          },
        ],
        permanent: false,
        destination: '/',
      },
      {
        source: '/admin',
        missing: [
          {
            type: 'cookie',
            key: 'database',
          },
        ],
        permanent: false,
        destination: '/',
      },
    ]
  }
}

module.exports = nextConfig