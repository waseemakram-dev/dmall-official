import media from '../content/media.json';
import { MEDIA_CACHE } from '../media-cache';

export function GET() {
  const urls = [...new Set(Object.values(media).map(asset => asset.url))];
  const script = `
const CACHE = ${JSON.stringify(MEDIA_CACHE)};
const MEDIA = new Set(${JSON.stringify(urls)});
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !MEDIA.has(event.request.url)) return;
  event.respondWith((async () => {
    let cached;
    try { cached = await (await caches.open(CACHE)).match(event.request.url); } catch {}
    if (!cached || cached.status !== 200) return fetch(event.request);
    const range = event.request.headers.get('Range');
    if (!range) return cached;
    const match = /^bytes=(\\d*)-(\\d*)$/.exec(range);
    if (!match) return fetch(event.request);
    const blob = await cached.blob();
    const start = match[1] ? Number(match[1]) : Math.max(0, blob.size - Number(match[2]));
    const end = match[1] ? (match[2] ? Math.min(Number(match[2]), blob.size - 1) : blob.size - 1) : blob.size - 1;
    if (start > end || start >= blob.size) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + blob.size } });
    return new Response(blob.slice(start, end + 1), { status: 206, headers: {
      'Content-Type': blob.type, 'Content-Length': String(end - start + 1),
      'Content-Range': 'bytes ' + start + '-' + end + '/' + blob.size, 'Accept-Ranges': 'bytes'
    } });
  })());
});`;
  return new Response(script, { headers: {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Service-Worker-Allowed': '/',
    'X-Content-Type-Options': 'nosniff',
  } });
}
