# Cloudinary media

Images, videos, SVG illustrations and fonts are delivered from the existing Cloudinary account's `wazemtech/dmall` asset folder. The app consumes public HTTPS delivery URLs; it does not call the Admin API or require credentials to run.

- `app/content/media.json` records uploaded filenames, delivery URLs, public IDs and source checksums. It contains no credentials.
- Static image, video and CSS font/background URLs point directly to Cloudinary. Dynamic case-study images and brand icons use `app/media.js`.
- `design/cloudinary-migration.json` records the used and unused assets, upload status and local cleanup.
- `public/` is ignored by Git. Local copies of used assets may remain for editing, but production delivery does not depend on them.

## Future uploads

Supply `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` only in the environment of a trusted upload process. `.env.example` has placeholders; real environment files are ignored. Never put the secret into a component, public file, manifest or `NEXT_PUBLIC_` variable.

The one-time migration was performed with `scripts/migrate-cloudinary.mjs upload`, followed by `scripts/use-cloudinary-media.mjs`. Those scripts inventory local `/assets/` references before switching and are not general content refresh commands after the migration. Do not rerun the switching/cleanup script on an already migrated tree.

To check saved delivery URLs without credentials, run `node scripts/migrate-cloudinary.mjs verify`. This requests each delivery URL and checks image/video response types; it does not build the site or upload anything.

Older extraction and localization scripts predate the migration. Do not run them against the current app: they generate retired markup and local asset paths.
