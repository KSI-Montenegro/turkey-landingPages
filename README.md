# KSI Montenegro — The Place V2

Vercel-ready source for the Turkish KSI Montenegro landing page. Repository: https://github.com/KSI-Montenegro/turkey-landingPages. Exported from https://ksi-the-place-v2.ksi-m.chatgpt.site, published version 1, source commit `d25cb7615e7908bc9b819ad3b7974cdcfe06fdc6`, on 15 October 2026.

**For another AI: start with `AI-DEPLOY-HANDOFF.md`.**

## Included

The Turkish page, six original-colour photographs and KSI logo; V2 photo headlines, scroll reveals, zoom, parallax and reduced-motion support; fee tables, FAQ, visit/callback dialogs, cookie choices and WhatsApp handoffs. All imagery is bundled locally. Optional Meta measurement functions and an empty environment-variable template are included. There are no npm dependencies.

The existing ChatGPT Site was not modified or redeployed. Source wording is preserved, including figures that may need editorial review before a new campaign. See `EXPORT-NOTES.md`.

## Files

| Path | Purpose |
| --- | --- |
| `src/index.html` | Editable Turkish page |
| `src/assets/style.css` | Editable styling and motion |
| `src/assets/app.js` | Editable browser interactions |
| `src/assets/*` | Six photographs and logo |
| `scripts/build.mjs` | Build and deployment metadata |
| `api/config.js` | GET /api/config: public Pixel ID and site origin |
| `api/meta-event.js` | POST /api/meta-event: optional Meta events |
| `dist/` | Generated static output, included ready-built |
| `vercel.json` | Build, routes and response headers |
| `.env.example` | Empty configuration names |
| `asset-sources.json` | Photograph and logo provenance |
| `AI-DEPLOY-HANDOFF.md` | Instructions for the deploying AI |

Edit `src/`, then run `npm run build`. Changes directly in `dist/` are overwritten. Serve over HTTP; asset URLs start at the site root.

## Deploy

1. In Vercel, import **KSI-Montenegro/turkey-landingPages** and select the `main` branch.
2. Leave Root Directory at the repository root (`.`). `package.json` and `vercel.json` are already there. You can also deploy the root with Vercel CLI/MCP.
3. Framework preset: **Other**. Node.js: **22.x**. Build command: **npm run build**. Output directory: **dist**. Keep `vercel.json`. There are no packages to install; Vercel's normal npm install step can remain unchanged.
4. Set `SITE_URL` to the final HTTPS origin, without a path. Vercel's `VERCEL_PROJECT_PRODUCTION_URL` is a build fallback. Rebuild after connecting a custom domain or changing the origin.
5. Check `/` and `/tr/karadaga-tasinan-aileler`, then the assets, WhatsApp buttons and both contact dialogs.

Deploy the whole project, including root `api/`; uploading only `dist/` omits the optional functions.

## Local preview

```sh
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. This static preview shows the page and WhatsApp flows; it does not execute API functions. Use a Vercel preview to check the optional APIs.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production origin for canonical, Turkish hreflang, social URL, sitemap and robots; also an allowed measurement origin. |
| `META_PIXEL_ID` | Optional. Leave unset to keep Pixel inactive. |
| `META_CAPI_ACCESS_TOKEN` | Optional server-only secret. Keep out of HTML, browser JavaScript and Git. |
| `META_GRAPH_API_VERSION` | Optional. Set a currently supported version if enabling CAPI. |
| `META_TEST_EVENT_CODE` | Optional Meta test-event code. |

No Meta credentials are needed for the page or WhatsApp. Explicit cookie consent and a configured Pixel ID are required to load Pixel; CAPI requires its server settings too. Events measure a page view or contact handoff, not a confirmed WhatsApp message or booked visit. Parent name, phone and child details are not sent to Meta by these handlers.

## Behaviour to retain

- WhatsApp: `+382 67 213 274`, from the campaign brief.
- Forms prepare a WhatsApp message that the family sends. Admissions confirms the visit afterwards.
- Marketing consent is optional and unchecked.
- Original photo colours, crops, layout, scroll motion and source copy are retained.
- Constantia uses the original serif fallback stack. Proprietary webfont files are not bundled.
- Parent testimonial videos discussed later have not been embedded in this Site.
- English hreflang still points to the main KSI site; reciprocal hreflang is managed separately there.

## Official references

- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/functions/functions-api-reference
- https://vercel.com/docs/functions/runtimes/node-js
