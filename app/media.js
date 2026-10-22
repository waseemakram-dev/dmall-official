import media from './content/media.json';

/** Delivery URLs only; upload credentials never enter the browser bundle. */
export function mediaUrl(filename) {
  const asset = media[filename];
  if (!asset) throw new Error('Unknown media asset: ' + filename);
  return asset.url;
}
