import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const assets = path.resolve(root, 'public/assets');
const reportPath = path.join(root, 'design/cloudinary-migration.json');
const manifestPath = path.join(root, 'app/content/media.json');
const mode = process.argv[2] || 'inventory';
const walk = async dir => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const write = (file, value) => fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');

async function inventory() {
  const sources = (await walk(path.join(root, 'app'))).filter(file => /\.(jsx?|css|json)$/.test(file) && !['reference.css', 'dmall-content.json', 'media.json'].includes(path.basename(file)));
  const used = new Set();
  for (const file of sources) {
    const source = await fs.readFile(file, 'utf8');
    for (const match of source.matchAll(/\/assets\/([^'"`\s)]+(?:%20[^'"`\s)]*)?)/g)) {
      if (!match[1].includes('${')) used.add(decodeURIComponent(match[1]));
    }
  }
  // These names are intentionally assembled by the case-study and pricing components.
  for (let i = 1; i <= 5; i++) used.add(`dmall-result-${i}.webp`);
  for (const brand of ['shopify', 'tiktok']) used.add(`${brand}-brand.svg`);
  const files = await fs.readdir(assets);
  const missing = [...used].filter(name => !files.includes(name));
  if (missing.length) throw new Error('Missing referenced assets: ' + missing.join(', '));
  const active = await Promise.all([...used].sort().map(async name => {
    const data = await fs.readFile(path.join(assets, name));
    return { name, bytes: data.length, sha256: digest(data) };
  }));
  const unused = await Promise.all(files.filter(name => !used.has(name)).sort().map(async name => ({ name, bytes: (await fs.stat(path.join(assets, name))).size })));
  return { active, unused };
}

const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
async function admin(endpoint, method = 'GET') {
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${endpoint}`, {
    method, headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` }, signal: AbortSignal.timeout(60000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Cloudinary admin ${method} ${endpoint}: HTTP ${response.status}`);
  return data;
}

async function inspect() {
  const roots = await admin('folders');
  const parent = roots.folders.find(folder => folder.name.toLowerCase() === 'wazemtech');
  if (!parent) throw new Error('The existing WAZEMTECH parent folder was not found; nothing created.');
  const children = await admin('folders/' + parent.path + '?max_results=500');
  let folderMode = 'fixed';
  const config = await admin('config?settings=true');
  folderMode = config.settings?.folder_mode || config.folder_mode || folderMode;
  return { parent: parent.path, folder: `${parent.path}/dmall`, folderMode, existingSubfolders: children.folders.map(folder => folder.name) };
}

async function uploadOne(asset, location) {
  const extension = path.extname(asset.name).toLowerCase();
  const type = /\.(mp4|webm|mov)$/.test(extension) ? 'video' : /\.(woff2?|ttf|otf)$/.test(extension) ? 'raw' : 'image';
  const stem = path.basename(asset.name, extension).replace(/[^a-zA-Z0-9_-]+/g, '-');
  const publicId = `${location.folder}/${stem}-${asset.sha256.slice(0, 10)}${type === 'raw' ? extension : ''}`;
  const params = { public_id: publicId, overwrite: 'false', timestamp: String(Math.floor(Date.now() / 1000)) };
  if (location.folderMode === 'dynamic') params.asset_folder = location.folder;
  const signature = crypto.createHash('sha1').update(Object.keys(params).sort().map(name => `${name}=${params[name]}`).join('&') + secret).digest('hex');
  const form = new FormData();
  for (const [name, value] of Object.entries(params)) form.set(name, value);
  form.set('api_key', key); form.set('signature', signature);
  form.set('file', new Blob([await fs.readFile(path.join(assets, asset.name))]), asset.name);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${type}/upload`, { method: 'POST', body: form, signal: AbortSignal.timeout(180000) });
  const data = await response.json();
  if (!response.ok || !data.secure_url) throw new Error(`Upload failed for ${asset.name}: HTTP ${response.status}`);
  return { url: data.secure_url, publicId: data.public_id, resourceType: data.resource_type, sha256: asset.sha256, bytes: asset.bytes };
}

async function verify(manifest) {
  const failures = [];
  const entries = Object.entries(manifest);
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < entries.length) {
      const [name, asset] = entries[cursor++];
      const response = await fetch(asset.url, { method: 'GET', headers: { Range: 'bytes=0-0' }, signal: AbortSignal.timeout(60000) });
      const kind = response.headers.get('content-type') || '';
      await response.body?.cancel();
      if (!response.ok || (asset.resourceType === 'image' && !kind.startsWith('image/')) || (asset.resourceType === 'video' && !kind.startsWith('video/'))) failures.push(`${name}: HTTP ${response.status} ${kind}`);
    }
  }));
  if (failures.length) throw new Error('Delivery checks failed: ' + failures.join('; '));
  console.log(`Delivery verified: ${entries.length} Cloudinary assets`);
}

try {
  if (['inspect', 'upload'].includes(mode) && (!cloud || !key || !secret)) throw new Error('Set server-only CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET for this command.');
  if (mode === 'inventory') {
    const plan = await inventory(); await write(reportPath, plan);
    console.log(JSON.stringify({ active: plan.active.length, unused: plan.unused.length, unusedMB: +(plan.unused.reduce((sum, item) => sum + item.bytes, 0) / 1048576).toFixed(2), unusedNames: plan.unused.map(item => item.name) }));
  } else if (mode === 'inspect') {
    console.log(JSON.stringify(await inspect()));
  } else if (mode === 'upload') {
    try {
      if (JSON.parse(await fs.readFile(reportPath, 'utf8')).switchedToCloudinary) throw new Error('This site has already switched to Cloudinary; use verify instead of rerunning the one-time upload.');
    } catch (error) { if (error.message.includes('already switched')) throw error; }
    const plan = await inventory(); const location = await inspect();
    const children = await admin('folders/' + location.parent + '?max_results=500');
    if (!children.folders.some(folder => folder.path === location.folder)) await admin('folders/' + location.folder, 'POST');
    let manifest = {};
    try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}
    // Each completed upload is recorded immediately so an interrupted run can resume.
    for (const asset of plan.active) {
      if (manifest[asset.name]?.sha256 !== asset.sha256) {
        manifest[asset.name] = await uploadOne(asset, location);
        await write(manifestPath, manifest);
      }
      console.log(`Uploaded ${asset.name}`);
    }
    await verify(manifest);
    await write(reportPath, { ...plan, ...location, uploaded: plan.active.length, deliveryVerified: true });
    console.log(`Ready to switch site: ${location.folder}`);
  } else if (mode === 'verify') {
    await verify(JSON.parse(await fs.readFile(manifestPath, 'utf8')));
  } else {
    throw new Error('Usage: node scripts/migrate-cloudinary.mjs inventory|inspect|upload|verify');
  }
} catch (error) {
  // Never print request bodies, credentials, signatures or complete API responses.
  console.error(error.message.replaceAll(secret || '\u0000', '[redacted]'));
  process.exitCode = 1;
}
