import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'src');
const output = path.join(root, 'dist');
const route = '/tr/karadaga-tasinan-aileler';
const required = ['index.html', 'assets/place.webp', 'assets/early-years.webp', 'assets/learning.webp', 'assets/community.webp', 'assets/classroom.webp', 'assets/graduation.webp', 'assets/ksi-logo.png', 'assets/style.css', 'assets/app.js'];
for (const file of required) {
  if (!fs.existsSync(path.join(source, file))) throw new Error(`Missing source asset: ${file}`);
}
let origin = process.env.SITE_URL?.trim();
if (!origin && process.env.VERCEL_PROJECT_PRODUCTION_URL) origin = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
if (origin) {
  const parsed = new URL(origin);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('SITE_URL must be an HTTPS origin without credentials.');
  origin = parsed.origin;
}
let html = fs.readFileSync(path.join(source, 'index.html'), 'utf8').replace(/<!-- deployment-meta:start -->[\s\S]*?<!-- deployment-meta:end -->\n?/g, '');
let canonical;
if (origin) {
  canonical = new URL(route, origin).href;
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const href = escape(canonical);
  html = html.replace('</head>', `<!-- deployment-meta:start -->\n<link rel="canonical" href="${href}">\n<link rel="alternate" hreflang="tr" href="${href}">\n<meta property="og:url" content="${href}">\n<!-- deployment-meta:end -->\n</head>`);
}
fs.rmSync(output, {recursive: true, force: true});
fs.cpSync(source, output, {recursive: true});
fs.writeFileSync(path.join(output, 'index.html'), html);
const nested = path.join(output, route.slice(1));
fs.mkdirSync(nested, {recursive: true});
fs.writeFileSync(path.join(nested, 'index.html'), html);
if (canonical) {
  const escaped = canonical.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  fs.writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escaped}</loc></url></urlset>\n`);
}
fs.writeFileSync(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
console.log(`Built KSI The Place V2 with ${required.length - 1} local assets. Canonical: ${canonical || 'not configured (set SITE_URL for production)'}`);
