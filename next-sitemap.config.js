/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://balgopaal-vastram.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/checkout',
    '/confirmation',
    '/orders/*',
  ],
  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/products'),
      await config.transform(config, '/about'),
      await config.transform(config, '/contact'),
      await config.transform(config, '/faq'),
      await config.transform(config, '/privacy'),
      await config.transform(config, '/terms'),
    ]
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout', '/orders'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://balgopaal-vastram.vercel.app'}/sitemap.xml`,
    ],
  },
}
