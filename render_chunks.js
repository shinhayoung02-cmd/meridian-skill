// 사용법: node render_chunks.js lounge/lounge_40s.html out.mp4 [fps] [scale] [조각 초]
// 10초 조각으로 나눠 렌더링 → 이어 붙임. 중간에 꺼져도 끝난 조각(.done)은 건너뛰고 이어서 진행
const { spawnSync } = require('child_process');
const { chromium } = require('playwright-core');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs'), path = require('path');

(async () => {
  const [html, out, fps = '60', scale = '2', seg = '10'] = process.argv.slice(2);
  const b = await chromium.launch({ channel: 'msedge' }), p = await b.newPage();
  await p.goto('file:///' + path.resolve(html).split(path.sep).join('/'));
  const duration = await p.evaluate(() => window.DURATION); await b.close();

  const dir = out.replace(/\.mp4$/, '_parts'); fs.mkdirSync(dir, { recursive: true });
  const parts = [];
  for (let t0 = 0, i = 0; t0 < duration; t0 += +seg, i++) {
    const t1 = Math.min(duration, t0 + +seg), part = path.join(dir, `part_${String(i).padStart(2, '0')}.mp4`);
    parts.push(part);
    if (fs.existsSync(part + '.done')) { console.log('skip', part); continue; }
    console.log(`render ${t0}-${t1.toFixed(2)}s → ${part}`);
    const r = spawnSync('node', ['render.js', html, part, fps, scale], { env: { ...process.env, T0: t0, T1: t1 }, stdio: ['ignore', 'inherit', 'ignore'] });
    if (r.status !== 0) { console.error('FAILED', part); process.exit(1); }
    fs.writeFileSync(part + '.done', '');
  }
  const list = path.join(dir, 'list.txt');
  fs.writeFileSync(list, parts.map(f => `file '${path.resolve(f).split(path.sep).join('/')}'`).join('\n'));
  const c = spawnSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' });
  if (c.status !== 0) { console.error('concat FAILED'); process.exit(1); }
  console.log('DONE', out, duration.toFixed(1) + 's');
})();
