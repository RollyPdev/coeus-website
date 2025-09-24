/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://coeus-incorporated.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://coeus-incorporated.com/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/server-sitemap.xml'],
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
}