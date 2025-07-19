const https = require('https');

// Your website URL
const siteUrl = 'https://coeusreview.com';

// Search engine sitemap submission URLs
const searchEngines = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${siteUrl}/sitemap.xml`
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${siteUrl}/sitemap.xml`
  }
];

// Function to ping search engines
async function pingSearchEngines() {
  for (const engine of searchEngines) {
    try {
      console.log(`Submitting sitemap to ${engine.name}...`);
      
      await new Promise((resolve, reject) => {
        https.get(engine.url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`Successfully submitted to ${engine.name}!`);
            resolve();
          } else {
            console.error(`Failed to submit to ${engine.name}: Status code ${res.statusCode}`);
            reject();
          }
        }).on('error', (err) => {
          console.error(`Error submitting to ${engine.name}:`, err.message);
          reject(err);
        });
      });
      
    } catch (error) {
      console.error(`Error with ${engine.name}:`, error);
    }
  }
}

// Execute the function
pingSearchEngines();