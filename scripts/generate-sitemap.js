import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-friendly sitemap generator: extract any artegallera.com URLs from routes.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesFile = path.resolve(__dirname, '../src/routes.js');
const outFile = path.resolve(__dirname, '../public/sitemap.xml');

const content = fs.readFileSync(routesFile, 'utf8');
const matchRegex = /https?:\/\/artegallera\.com[^"'\s,)\]]*/g;
const urls = new Set();
let m;
while ((m = matchRegex.exec(content)) !== null) {
  urls.add(m[0]);
}

// Always include root
urls.add('https://artegallera.com/');

const today = new Date().toISOString().split('T')[0];

const urlEntries = Array.from(urls).map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

fs.writeFileSync(outFile, sitemap, 'utf8');
console.log('Sitemap generado en', outFile);
