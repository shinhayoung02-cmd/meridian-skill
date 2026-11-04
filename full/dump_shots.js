// full2.html의 실제 장면 시간표 출력 (연결 지점 계산용)
const { chromium } = require('playwright-core'), path = require('path');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file:///' + path.resolve(process.argv[2] || 'full/full2.html').split(path.sep).join('/'));
  await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => ({ D: window.DURATION, s: shots.map(x => [x.img, +x.t0.toFixed(2), +x.t1.toFixed(2), x.sync ? 'SYNC' : '', x.waveFrom ? 'wave' : '', x.tr || '']) }));
  console.log('DURATION', r.D); r.s.forEach((x, i) => console.log(i, x.join(' '))); await b.close();
})();
