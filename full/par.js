// 병렬 렌더: 구간을 N개로 나눠 동시에 render.js 실행 → 이어 붙임
const { spawn, spawnSync } = require('child_process'), ffmpeg = require('ffmpeg-static'), fs = require('fs'), path = require('path');
const [html, out, N = '8', dur] = process.argv.slice(2), D = +dur, n = +N, dir = out.replace(/\.mp4$/, '_parts'); fs.mkdirSync(dir, { recursive: true });
const parts = [...Array(n)].map((_, i) => path.join(dir, `p${i}.mp4`));
const run = (p, i) => new Promise(res => {
  const fr = x => (Math.round(D / n * x * 30) / 30).toFixed(4), t0 = fr(i), t1 = fr(i + 1);
  spawn('node', ['render.js', html, p, '30', '1'], { env: { ...process.env, T0: t0, T1: t1, PRESET: 'veryfast', CRF: '16' }, stdio: 'ignore' }).on('close', res);
});
// 실패한 조각은 최대 2번 다시 (브라우저 여러 개 동시 실행 시 가끔 죽음)
Promise.all(parts.map(async (p, i) => { for (let k = 0; k < 3; k++) if (await run(p, i) === 0) return; throw p; })).then(() => {
  fs.writeFileSync(path.join(dir, 'l.txt'), parts.map(f => `file '${path.resolve(f).split(path.sep).join('/')}'`).join('\n'));
  spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'l.txt'), '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('DONE', out);
}, e => { console.error('FAILED', e); process.exit(1); });
