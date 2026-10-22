# D-Mall OFFICIAL landing page

Local Next.js landing page using the Monetize reference layout, typography and decorative motion with Dmall business content. Nothing has been published.

## Run

- `npm run dev` serves http://127.0.0.1:3000/.
- `npm run build` creates a production build.

## Content

Dmall's homepage, Services, Trainings and Success pages were checked on 2026-10-22. The public `/api/load.php` endpoint supplies the currently displayed business content. A sanitized snapshot with source URLs is in `app/dmall-content.json`.

The page includes Dmall's logo, headline, live business figures, six PKR service packages, Shopify training highlights, original result screenshots, branch addresses, telephone, email and WhatsApp destinations. Screenshots are not converted into invented quotes or attributed to template profile photos. Course selection and certificate verification link to the original Dmall tools. No signup data is collected locally.

Template customer identities, dollar prices, instructor biography, payment notifications, refund guarantee and article links have been replaced. Decorative reference videos remain design assets, rather than Dmall course footage. No training price was invented; enquiries go to Dmall's team.

Curriculum is a manual continuous carousel: 4 is followed by 1 and 2 in the same direction, without autoplay. Reviews show original result screenshots with the existing review carousel interaction.

## Media hosting

Images, videos, SVGs and fonts are delivered from Cloudinary under `wazemtech/dmall`. The delivery manifest is `app/content/media.json`. The app needs no Cloudinary credentials at runtime, and `public/` is ignored by Git. Upload instructions and the migration record are described in `design/CLOUDINARY.md`.

## Checks

Earlier build and content/carousel checks predate the gradual React cleanup and Cloudinary migration. The old scripts target retired markup and local asset paths and are not current validation. No new build or browser test was run during this migration, following the user's instruction; Cloudinary delivery URLs and remaining local source references are checked directly.
