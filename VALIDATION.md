# Export verification

Verified locally on 15 October 2026. JavaScript checks ran on Node.js 24.19.0; the Vercel package requests Node.js 22.x.

- Published Site version and local source commit matched.
- Visible HTML matched the published page after removing old deployment-only metadata.
- All six photograph files, the logo and stylesheet matched the published source byte for byte.
- The only browser-script change was the configuration URL from /api/config.json to /api/config.
- JavaScript syntax checks passed for the build, browser script and API handlers.
- Dependency-free builds passed without configuration and with two different HTTPS origins.
- Both root and nested Turkish routes generated identical HTML and had all local image/style/script assets available.
- Canonical, hreflang and sitemap used the new configured origin; an HTTP origin was rejected.
- Configured-to-unconfigured rebuilding removed stale deployment metadata and sitemap files.
- GET /api/config returned the intended public config and did not expose the server-only token.
- POST /api/meta-event returned disabled output without Meta configuration, rejected invalid consent/origin/content type, and made no external requests.
- The original Site checkout remained clean; no push or deployment was performed.

This task did not create a Vercel deployment or run browser checks against Vercel. The deploying AI should complete the hosted checks in AI-DEPLOY-HANDOFF.md.
