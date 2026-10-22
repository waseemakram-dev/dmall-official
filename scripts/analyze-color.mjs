import fs from 'fs';
import path from 'path';

const baseDir = './app';
const files = fs.readdirSync(baseDir);

const results = [];

for (const file of files) {
  const filePath = path.join(baseDir, file);
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) continue;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // check for hex
  let hexCount = 0;
  const hexRegex = /#6639fa/gi;
  while (hexRegex.exec(content)) hexCount++;
  
  // check for rgb
  let rgbCount = 0;
  const rgbRegex = /rgb\(\s*102\s*,\s*57\s*,\s*250\s*\)/gi;
  while (rgbRegex.exec(content)) rgbCount++;

  // check for token
  let tokenCount = 0;
  const tokenRegex = /token-4d1ac81c-3655-4c33-9945-3aee67d1f289/g;
  while (tokenRegex.exec(content)) tokenCount++;

  if (hexCount > 0 || rgbCount > 0 || tokenCount > 0) {
    results.push({ file, hexCount, rgbCount, tokenCount });
  }
}

console.log(JSON.stringify(results, null, 2));
