const { ZONE_ADMIN_URL } = process.env
const rewrites = [
  {
    source: '/:path*',
    destination: `/:path*`,
  },
  {
    source: '/admin',
    destination: `${ZONE_ADMIN_URL}/admin`,
  },
  {
    source: '/admin/:path*',
    destination: `${ZONE_ADMIN_URL}/admin/:path*`,
  },
]
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return rewrites
  },
}
