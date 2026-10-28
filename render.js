// 사용법: node render.js lounge/lounge.html out.mp4 [fps] [scale]   (scale 2 = 4K 3840x2160)
//        node render.js lounge/lounge.html --stills 1.5,8.2   (특정 시점 PNG 확인용)
const { chromium } = require('playwright-core');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const [html, out, fpsArg, scaleArg] = process.argv.slice(2);
  const scale = Number(scaleArg) || 1;
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  await page.goto('file:///' + path.resolve(html).replace(/\\/g, '/'));
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);

  if (out === '--stills') {
    for (const t of fpsArg.split(',').map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: `still_${t}.png` });
    }
    return browser.close();
  }

  // 구간만 뽑기(시험용): T0=초 T1=초 환경변수
  const t0 = Number(process.env.T0) || 0, t1 = Number(process.env.T1) || duration;
  const fps = Number(fpsArg) || 30, frames = Math.ceil((t1 - t0) * fps);
  // 어두운 그라데이션 배경: 미세 노이즈(디더)로 계단·블록 방지 + 낮은 crf. 4K는 비트레이트 하한도 둠
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-vf', 'noise=alls=3:allf=t', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '12', '-preset', scale > 1 ? 'veryfast' : 'slow', '-tune', 'grain',
    // 4K: veryfast(스레드 제한 없음) — 메모리 줄이려고 threads 6 + medium으로 했다가 0.3fps로 병목. lookahead만 줄여 메모리 억제
    ...(scale > 1 ? ['-x264-params', 'vbv-maxrate=120000:vbv-bufsize=120000:rc-lookahead=15', '-minrate', '40M', '-b:v', '0'] : []),
    '-movflags', '+faststart', out],
    { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    await page.evaluate(t => render(t), t0 + f / fps);
    // 무손실 프레임. ffmpeg가 밀리면 버퍼가 빌 때까지 대기 — 안 기다리면 4K 프레임이 메모리에 쌓여 중간에 죽음
    // 4K는 JPEG 품질 100 (PNG는 4K 한 장 3초, JPEG 0.5초 — 눈으로 차이 없음)
    const shot = await page.screenshot(scale > 1 ? { type: 'jpeg', quality: 100 } : { type: 'png' });
    if (!ff.stdin.write(shot)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${f}/${frames}`);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on('close', r));
  await browser.close();
  if (code !== 0) { console.error('ffmpeg failed', code); process.exit(1); }
  console.log('done', out, `${duration.toFixed(1)}s`);
})();
