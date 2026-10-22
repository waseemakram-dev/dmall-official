export const MEDIA_CACHE = 'dmall-media-v1';
let cachePromise;
let workerPromise;

export function openMediaCache() {
  if (!cachePromise) cachePromise = (async () => {
    try { return await window.caches?.open(MEDIA_CACHE); } catch { return undefined; }
  })();
  return cachePromise;
}

export function prepareMediaCache() {
  if (!workerPromise) workerPromise = (async () => {
    await openMediaCache();
    if (!window.isSecureContext || !('serviceWorker' in navigator)) return;
    let timeout, changed;
    try {
      const controlled = new Promise(resolve => {
        changed = () => { if (navigator.serviceWorker.controller) resolve(); };
        navigator.serviceWorker.addEventListener('controllerchange', changed);
        timeout = setTimeout(resolve, 5000);
      });
      // Registration failure must not prevent a complete asset download/reveal.
      const registration = navigator.serviceWorker.register('/dmall-media-sw.js', { scope: '/', updateViaCache: 'none' });
      registration.catch(() => {});
      if (!navigator.serviceWorker.controller) await controlled;
    } catch {} finally {
      clearTimeout(timeout);
      if (changed) navigator.serviceWorker.removeEventListener('controllerchange', changed);
    }
  })();
  return workerPromise;
}

export async function readMediaCache(url) {
  try {
    const cache = await openMediaCache();
    const response = await cache?.match(url);
    return response?.status === 200 ? response : undefined;
  } catch { return undefined; }
}

export async function saveMediaCache(url, blob) {
  try {
    const cache = await openMediaCache();
    await cache?.put(url, new Response(blob, { headers: { 'Content-Type': blob.type, 'Content-Length': String(blob.size) } }));
  } catch {
    // Private mode or quota restrictions fall back to the ordinary HTTP cache.
  }
}
