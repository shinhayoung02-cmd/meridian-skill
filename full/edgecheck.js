// 렌더된 영상에서 화면 가장자리 3px가 밝게(흰 줄) 나오는 프레임 찾기
const ff = require('ffmpeg-static'), { execFileSync } = require('child_process');
const [file, step = '0.1'] = process.argv.slice(2);
const W = 192, H = 108;
const raw = execFileSync(ff, ['-v', 'error', '-i', file, '-vf', `fps=1/${step},scale=${W * 5}:${H * 5}`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 2 ** 31 });
const FW = W * 5, FH = H * 5, n = raw.length / (FW * FH), bad = [];
for (let f = 0; f < n; f++) {
  const o = f * FW * FH, px = (x, y) => raw[o + y * FW + x], inner = (x, y) => raw[o + y * FW + x];
  let hits = 0;
  for (let x = 20; x < FW - 20; x += 4) { if (px(x, 0) - inner(x, 6) > 60) hits++; if (px(x, FH - 1) - inner(x, FH - 7) > 60) hits++; }
  for (let y = 20; y < FH - 20; y += 4) { if (px(0, y) - inner(6, y) > 60) hits++; if (px(FW - 1, y) - inner(FW - 7, y) > 60) hits++; }
  if (hits > 30) bad.push((f * step).toFixed(1));
}
console.log(n, 'frames checked, white-edge frames:', bad.length ? bad.join(' ') : 'none');
