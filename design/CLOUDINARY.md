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

## Initial loading screen

`AssetLoader` gates the initial reveal on every asset in the media manifest. Images must download and decode, the Open Runde font faces must load, and videos must finish downloading. Four workers preload assets concurrently, with images/fonts ahead of videos. File counts record completed assets and video download progress updates as bytes arrive. A detached video's first-frame event is deliberately not a prerequisite: browsers can defer it indefinitely even for a complete local file.

Completed video downloads are held as browser blob URLs and passed to `DecorativeVideo`; this avoids another network request when sections appear. Decoded image objects remain in memory and their original URLs remain browser-cacheable. A shared load operation survives development Strict Mode, while retries keep successful assets and retry failures. A stalled video download aborts after 60 seconds with no new data; image/font waits also have failure timeouts. These failures offer retry, never reveal an incomplete page. Only the fonts actually used by the page are awaited, rather than unrelated template font loading.

This intentionally downloads all media before revealing the page, including below-the-fold videos, so first visits can take longer on slow connections. The hidden server-rendered page remounts on completion to start its entrance animations at reveal. No browser/build test was run for this addition, per the user's instruction.

## Persistent browser media cache

The preloader now checks the `dmall-media-v1` Cache Storage cache before requesting each file. Successful complete responses are stored, and subsequent visits read saved image, video and font bytes. Images are decoded from saved blobs, fonts are installed from saved font bytes, and videos keep the existing in-memory blob playback. The progress indicator reports cache hits separately.

A same-origin service worker at `/dmall-media-sw.js` serves the same saved files to ordinary image, background and font requests. It only intercepts the exact public Cloudinary URLs in the manifest; page HTML, Next.js scripts, APIs and credentials are outside its scope. Cached video responses also support byte-range requests. The worker is served by an App Router route, so it is versioned with the app despite `public/` being ignored.

Cloudinary URLs include asset versions/checksums, so changed media gets a new cache key. Cache Storage/service worker use requires a secure context (HTTPS or local loopback). If storage is denied or full, normal HTTP caching remains available and site loading is not blocked by a failed cache write. Cache entries can be removed by the user/browser; those files then download again. This is media caching, not a claim that the entire Next.js site works offline. No browser/build test was run for this change, at the user's request.
