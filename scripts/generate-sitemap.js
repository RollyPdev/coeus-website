const fs = require('fs');
const path = require('path');

// Base URL of your website
const BASE_URL = 'https://coeusreview.com';

// Define your routes
const routes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/programs', changefreq: 'monthly', priority: 0.9 },
  { url: '/news', changefreq: 'weekly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/enroll', changefreq: 'monthly', priority: 0.9 },
];

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Add favicon.ico to the sitemap
const faviconEntry = `  <url>\n    <loc>${BASE_URL}/favicon.ico</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.1</priority>\n  </url>`;

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url>\n    <loc>${BASE_URL}${route.url}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`).join('\n')}\n${faviconEntry}\n</urlset>`;

// Write sitemap to public directory
fs.writeFileSync(
  path.join(process.cwd(), 'public', 'sitemap.xml'),
  sitemap
);

console.log('Sitemap generated successfully!');