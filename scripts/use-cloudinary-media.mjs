import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';

const root = process.cwd();
const reportPath = path.join(root, 'design/cloudinary-migration.json');
const manifest = JSON.parse(await fs.readFile('app/content/media.json', 'utf8'));
const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
if (report.switchedToCloudinary) throw new Error('Cloudinary migration is already applied.');
if (!report.deliveryVerified) throw new Error('Cloudinary delivery must be verified before switching or deleting files.');
const assets = path.resolve(root, 'public/assets');
const walk = async dir => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
const hash = data => crypto.createHash('sha256').update(data).digest('hex');

// Fail before making changes if local assets changed after upload.
for (const item of report.active) {
  const data = await fs.readFile(path.join(assets, item.name));
  if (hash(data) !== manifest[item.name]?.sha256) throw new Error(`Asset changed after upload: ${item.name}`);
}

const snapshot = JSON.parse(await fs.readFile('app/dmall-content.json', 'utf8'));
snapshot.stories = snapshot.stories.filter(url => manifest[decodeURIComponent(url.split('/').pop())]);
await fs.writeFile('app/dmall-content.json', JSON.stringify(snapshot, null, 2) + '\n');

for (const file of (await walk(path.join(root, 'app'))).filter(file => /\.(jsx?|css|json)$/.test(file) && path.basename(file) !== 'media.json')) {
  let source = await fs.readFile(file, 'utf8');
  if (path.basename(file) === 'reference.css') {
    const css = postcss.parse(source);
    // Imported template font faces that reference absent files are obsolete.
    css.walkAtRules('font-face', rule => {
      const local = [...rule.toString().matchAll(/\/assets\/([^'"\s)]+)/g)];
      if (local.length && local.some(match => !manifest[decodeURIComponent(match[1])])) rule.remove();
    });
    source = css.toString();
  }
  if (path.basename(file) === 'case-studies.jsx') {
    source = "import { mediaUrl } from './media';\n" + source;
    source = source.replaceAll('`/assets/dmall-result-${number}.webp`', 'mediaUrl(`dmall-result-${number}.webp`)');
  }
  if (path.basename(file) === 'pricing.jsx') {
    source = "import { mediaUrl } from './media';\n" + source;
    source = source.replaceAll('`/assets/${brand}-brand.svg`', 'mediaUrl(`${brand}-brand.svg`)');
  }
  for (const [name, asset] of Object.entries(manifest)) {
    source = source.replaceAll('/assets/' + encodeURIComponent(name), asset.url).replaceAll('/assets/' + name, asset.url);
  }
  await fs.writeFile(file, source);
}

await fs.writeFile('app/media.js', `import media from './content/media.json';\n\n/** Delivery URLs only; upload credentials never enter the browser bundle. */\nexport function mediaUrl(filename) {\n  const asset = media[filename];\n  if (!asset) throw new Error('Unknown media asset: ' + filename);\n  return asset.url;\n}\n`);

let ignore = await fs.readFile('.gitignore', 'utf8');
for (const entry of ['/public/', '.env*', '!.env.example']) if (!ignore.split(/\r?\n/).includes(entry)) ignore += '\n' + entry;
await fs.writeFile('.gitignore', ignore.trimEnd() + '\n');

// Delete only the exact unused files inventoried before the upload. No recursive deletes.
const deleted = [];
for (const item of report.unused) {
  const file = path.resolve(assets, item.name);
  if (path.dirname(file) !== assets) throw new Error('Refusing an asset path outside public/assets.');
  const stat = await fs.stat(file);
  if (!stat.isFile() || stat.size !== item.bytes) throw new Error(`Unused asset changed; not deleted: ${item.name}`);
  await fs.unlink(file);
  deleted.push(item.name);
}

const remainingLocalReferences = [];
for (const file of (await walk(path.join(root, 'app'))).filter(file => /\.(jsx?|css|json)$/.test(file))) {
  if ((await fs.readFile(file, 'utf8')).includes('/assets/')) remainingLocalReferences.push(path.relative(root, file));
}
if (remainingLocalReferences.length) throw new Error('Review remaining local references: ' + remainingLocalReferences.join(', '));
await fs.writeFile(reportPath, JSON.stringify({ ...report, deleted, switchedToCloudinary: true, remainingLocalReferences: 0 }, null, 2) + '\n');
console.log(JSON.stringify({ switched: Object.keys(manifest).length, deleted: deleted.length, remainingLocalReferences: 0 }));
