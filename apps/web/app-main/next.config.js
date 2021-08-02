const rewrites = [
  {
    source: '/:path*',
    destination: `/:path*`,
  },
  {
    source: '/admin',
    destination: `${process.env.ZONE_ADMIN_URL}/admin`,
  },
  {
    source: '/admin/:path*',
    destination: `${process.env.ZONE_ADMIN_URL}/admin/:path*`,
  },
]
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return rewrites
  },
}
