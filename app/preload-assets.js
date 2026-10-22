import media from './content/media.json';
import { prepareMediaCache, readMediaCache, saveMediaCache } from './media-cache';

const assets = [...new Map(Object.values(media).map(asset => [asset.url, asset])).values()]
  .sort((a, b) => Number(a.resourceType === 'video') - Number(b.resourceType === 'video'));
const completed = new Set();
const retainedImages = new Map();
const videoSources = {};
const listeners = new Set();
const downloaded = new Map();
const cachedAssets = new Set();
let running;
let notification;

export const assetTotal = assets.length;
const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);
const progress = () => ({ completed: completed.size, total: assetTotal, cached: cachedAssets.size, loadedBytes: [...downloaded.values()].reduce((sum, bytes) => sum + bytes, 0), totalBytes });
const notify = () => {
  if (notification) return;
  notification = setTimeout(() => {
    notification = undefined;
    listeners.forEach(listener => listener(progress()));
  }, 50);
};
export function subscribeToAssetProgress(listener) {
  listeners.add(listener);
  listener(progress());
  return () => listeners.delete(listener);
}

export function getAssetProgress() {
  return progress();
}

async function preloadImage(asset) {
  const blob = await downloadAsset(asset);
  const source = URL.createObjectURL(blob);
  const image = new Image();
  image.decoding = 'async';
  image.src = source;
  try { await withTimeout(image.decode(), 'Image loading timed out'); }
  catch (error) { URL.revokeObjectURL(source); throw error; }
  // Retain the decoded image while the page is open.
  retainedImages.set(asset.url, image);
}

async function downloadAsset(asset) {
  const cached = await readMediaCache(asset.url);
  if (cached) {
    const blob = await cached.blob();
    if (blob.size) {
      cachedAssets.add(asset.url);
      downloaded.set(asset.url, asset.bytes);
      notify();
      return blob;
    }
  }
  const controller = new AbortController();
  let timeout;
  const armTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => controller.abort(), 60000);
  };
  downloaded.set(asset.url, 0);
  armTimeout();
  try {
    const response = await fetch(asset.url, { cache: 'force-cache', signal: controller.signal });
    const type = response.headers.get('content-type') || '';
    const expectedType = asset.resourceType === 'video' ? 'video/' : asset.resourceType === 'image' ? 'image/' : '';
    if (response.status !== 200 || !response.body || (expectedType && !type.startsWith(expectedType))) throw new Error('Full asset download failed');
    const chunks = [];
    const reader = response.body.getReader();
    let received = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.byteLength;
      downloaded.set(asset.url, Math.min(received, asset.bytes));
      notify();
      armTimeout();
    }
    if (!received) throw new Error('Empty asset download');
    const blob = new Blob(chunks, { type: type || 'application/octet-stream' });
    await saveMediaCache(asset.url, blob);
    return blob;
  } finally {
    clearTimeout(timeout);
  }
}

async function preloadVideo(asset) {
  const blob = await downloadAsset(asset);
  videoSources[asset.url] = URL.createObjectURL(blob);
}

function withTimeout(promise, message) {
  let timeout;
  return Promise.race([promise, new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), 60000);
  })]).finally(() => clearTimeout(timeout));
}

async function preloadFont(asset) {
  const blob = await downloadAsset(asset);
  const weight = asset.publicId.includes('semibold') ? 600 : 400;
  const face = new FontFace('Open Runde', await blob.arrayBuffer(), { weight: String(weight), style: 'normal', display: 'swap' });
  await withTimeout(face.load(), 'Font loading timed out');
  document.fonts.add(face);
}

/** One shared load survives React Strict Mode and retries only failed assets. */
export function preloadSiteAssets() {
  if (running) return running;
  running = (async () => {
    await prepareMediaCache();
    let cursor = 0;
    const failures = [];
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (cursor < assets.length) {
        const asset = assets[cursor++];
        if (completed.has(asset.url)) continue;
        try {
          if (asset.resourceType === 'video') await preloadVideo(asset);
          else if (asset.resourceType === 'image') await preloadImage(asset);
          else await preloadFont(asset);
          completed.add(asset.url);
          downloaded.set(asset.url, asset.bytes);
          notify();
        } catch {
          failures.push(asset.url);
        }
      }
    }));
    // Don't leave the final counts behind a throttled notification when cache
    // reads finish faster than the progress update interval.
    clearTimeout(notification);
    notification = undefined;
    listeners.forEach(listener => listener(progress()));
    if (failures.length) throw new Error(`${failures.length} assets could not be loaded`);
    return videoSources;
  })().catch(error => { running = undefined; throw error; });
  return running;
}
