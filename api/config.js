export function GET() {
  return Response.json({
    metaPixelId: /^\d{5,25}$/.test(process.env.META_PIXEL_ID || '') ? process.env.META_PIXEL_ID : '',
    siteUrl: process.env.SITE_URL || ''
  }, {headers:{'Cache-Control':'public, max-age=300'}});
}
