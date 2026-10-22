import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const userHome = process.env.USERPROFILE || 'C:\\Users\\Wasee';
const targetDir = join(userHome, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Packages');

function search(dir, depth = 0) {
  if (depth > 6) return null;
  try {
    for (const item of readdirSync(dir)) {
      const full = join(dir, item);
      if (item.toLowerCase() === 'ffmpeg.exe') return full;
      try {
        if (statSync(full).isDirectory()) {
          const res = search(full, depth + 1);
          if (res) return res;
        }
      } catch { }
    }
  } catch { }
  return null;
}

if (existsSync(targetDir)) {
  const result = search(targetDir);
  if (result) {
    console.log('EXACT_PATH:', result);
  } else {
    console.log('NOT_FOUND_IN_WINGET');
  }
} else {
  console.log('WINGET_PACKAGES_NOT_FOUND');
}
