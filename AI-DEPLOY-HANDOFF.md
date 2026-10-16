# Deploy this existing website to Vercel

You have the complete source export of KSI Montenegro's **The Place V2** landing page. Deploy these files to Vercel and return a working live URL. Reference: https://ksi-the-place-v2.ksi-m.chatgpt.site. All required code and images are local; access to the reference Site is not required.

## Preserve

Keep the supplied Turkish wording, page structure, six photographs, KSI logo, large photo headlines, scroll motion, mobile layout, fee tables, FAQ, consent choices and WhatsApp request flows. Keep the existing ChatGPT Site unchanged. Deploy this implementation rather than redesigning or rebuilding it in a different framework.

## Execute

1. Read `README.md`, `EXPORT-NOTES.md`, `package.json`, `vercel.json`, `scripts/build.mjs` and `api/`.
2. Use this directory as the project root. Editable files are under `src/`; build output is `dist/`.
3. Run `npm run build`. Use preset **Other**, Node.js **22.x**, output **dist** and the included `vercel.json`. There are no npm dependencies.
4. Use the user's connected Vercel account and intended team/project from the session. If no project exists, create a separate project for this export. Resolve genuine target ambiguity before publishing; do not overwrite an unrelated project.
5. Set `SITE_URL` to the final new HTTPS origin. Vercel's production project URL is a build fallback. Redeploy after changing the origin or connecting a custom domain. Do not retain a canonical URL pointing to the ChatGPT Site.
6. Deploy the whole project, including root `api/`. `GET /api/config` is the dynamic public configuration endpoint; the old static `/api/config.json` is intentionally absent. `POST /api/meta-event` is the optional server-side measurement endpoint.
7. Leave Meta tracking off unless the user configures it securely. Never expose the CAPI access token in client files or logs. Page content and WhatsApp requests work without Meta settings.
8. Check desktop and mobile layouts, both main routes, all local assets, scroll reveals, reduced-motion behaviour, FAQ, dialogs, validation and prepared WhatsApp messages. Check canonical and sitemap for the new origin.
9. Verify `GET /api/config` returns JSON without secrets. With Meta unset, a valid consented `POST /api/meta-event` returns `{ "enabled": false }`. Do not send real Meta events solely to test an unconfigured export.
10. Return the deployed URL, project/team used, checks completed and any remaining configuration. Report deployment success only after Vercel reports it ready and the main routes work.

## Content notes

The source has inherited outdated class-size wording. `EXPORT-NOTES.md` records Filip's later replacement wording. Treat a content refresh as an explicit editorial change and report it; do not silently call all exported figures newly verified. Preserve the requested 2026 graduation label. Testimonial videos are not embedded in this published version.

## Practical details

All images are bundled in `src/assets/`. Do not regenerate them. No ChatGPT hosting identity, source-repository token, Vercel project linkage or runtime secrets are needed from the original provider. Forms open a prepared WhatsApp message; they do not store an application or confirm a booking. Keep that behaviour accurate.
