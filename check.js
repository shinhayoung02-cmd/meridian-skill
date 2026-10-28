// 사용법: node check.js a.html b.html ...  — 페이지 로드 + 0.5초 간격 render 해서 JS 에러 확인
const { chromium } = require('playwright-core');
const path = require('path');
(async () => {
  for (const f of process.argv.slice(2)) {
    const b = await chromium.launch({ channel: 'msedge' }), p = await b.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('file:///' + path.resolve(f).split(path.sep).join('/'));
    await p.evaluate(() => window.ready);
    const d = await p.evaluate(() => window.DURATION);
    for (let t = 0; t < d; t += .5) await p.evaluate(t => render(t), t);
    console.log(f, d.toFixed(1) + 's', errs.join(' | ') || 'ok');
    await b.close();
  }
})();
