// 검정/흰 배경 두 장으로 투명 PNG 복원: a = 1 - (W - B), color = B / a
const ff = require('ffmpeg-static'), { execFileSync } = require('child_process');
const W = 2030, H = 1144;
const raw = (x, y) => execFileSync(ff, ['-v', 'error', '-i', 'full/sBW.png', '-vf', `crop=${W}:${H}:${x}:${y}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
for (const [name, y] of [['X_bulgogi_fg', 0], ['X_dessert_fg', H]]) {
  const B = raw(0, y), Wh = raw(W, y), out = Buffer.alloc(W * H * 4);
  for (let i = 0, j = 0; i < B.length; i += 3, j += 4) {
    const d = ((Wh[i] - B[i]) + (Wh[i + 1] - B[i + 1]) + (Wh[i + 2] - B[i + 2])) / 3, a = Math.max(0, Math.min(255, 255 - d));
    out[j + 3] = a; for (let c = 0; c < 3; c++) out[j + c] = a ? Math.min(255, Math.round(B[i + c] * 255 / a)) : 0;
  }
  execFileSync(ff, ['-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-i', '-', `full/s/${name}.png`], { input: out });
}
console.log('ok');
