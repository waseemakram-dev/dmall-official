import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const userHome = process.env.USERPROFILE || 'C:\\Users\\Wasee';
const targetDir = join(userHome, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Packages');
const assetsDir = 'c:\\Users\\Wasee\\Documents\\Codex\\2026-10-21\\referenced-chatgpt-conversation-this-is-an\\outputs\\monetize-next\\public\\assets';

function searchFfmpeg(dir, depth = 0) {
  if (depth > 6) return null;
  try {
    for (const item of readdirSync(dir)) {
      const full = join(dir, item);
      if (item.toLowerCase() === 'ffmpeg.exe') return full;
      try {
        if (statSync(full).isDirectory()) {
          const res = searchFfmpeg(full, depth + 1);
          if (res) return res;
        }
      } catch {}
    }
  } catch {}
  return null;
}

const ffmpegExe = searchFfmpeg(targetDir);
if (!ffmpegExe) {
  console.error('ffmpeg.exe not found in winget packages');
  process.exit(1);
}
console.log('Using FFmpeg at:', ffmpegExe);

const tasks = [
  // 1. 01.webm: starting 6 seconds removed (start from 6s to end)
  {
    input: join(assetsDir, '01.webm'),
    output: join(assetsDir, '01_cut.mp4'),
    args: ['-y', '-ss', '00:00:06', '-i', join(assetsDir, '01.webm'), '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-c:a', 'aac', join(assetsDir, '01_cut.mp4')]
  },
  // 2. 02.webm: starting 10 seconds removed (start from 10s to end)
  {
    input: join(assetsDir, '02.webm'),
    output: join(assetsDir, '02_cut.mp4'),
    args: ['-y', '-ss', '00:00:10', '-i', join(assetsDir, '02.webm'), '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-c:a', 'aac', join(assetsDir, '02_cut.mp4')]
  },
  // 3. 03.mp4: first 14 seconds (0 to 14s)
  {
    input: join(assetsDir, '03.mp4'),
    output: join(assetsDir, '03_cut.mp4'),
    args: ['-y', '-ss', '00:00:00', '-i', join(assetsDir, '03.mp4'), '-t', '14', '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-c:a', 'aac', join(assetsDir, '03_cut.mp4')]
  },
  // 4. 04.mp4: first 20 seconds (0 to 20s)
  {
    input: join(assetsDir, '04.mp4'),
    output: join(assetsDir, '04_cut.mp4'),
    args: ['-y', '-ss', '00:00:00', '-i', join(assetsDir, '04.mp4'), '-t', '20', '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-c:a', 'aac', join(assetsDir, '04_cut.mp4')]
  }
];

for (const task of tasks) {
  if (existsSync(task.input)) {
    console.log(`Processing: ${task.input} -> ${task.output}`);
    execFileSync(ffmpegExe, task.args, { stdio: 'inherit' });
    console.log(`Done: ${task.output}`);
  } else {
    console.warn(`Input not found: ${task.input}`);
  }
}
console.log('ALL_TASKS_COMPLETED_SUCCESSFULLY');
