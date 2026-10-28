// 4K 프레임 캡처 속도 비교 (PNG vs JPEG, headless vs GPU 창)
const { chromium } = require('playwright-core');
const path = require('path');
(async () => {
  const html = 'file:///' + path.resolve('lounge/lounge_40s.html').split(path.sep).join('/');
  for (const cfg of [
    { name: 'headless+png', headless: true, type: 'png' },
    { name: 'headless+jpeg', headless: true, type: 'jpeg' },
    { name: 'gpu+png', headless: false, type: 'png', args: ['--window-position=-3000,0', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] },
    { name: 'gpu+jpeg', headless: false, type: 'jpeg', args: ['--window-position=-3000,0', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] },
  ]) {
    const b = await chromium.launch({ channel: 'msedge', headless: cfg.headless, args: cfg.args || [] });
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
    await p.goto(html); await p.evaluate(() => window.ready);
    const t0 = Date.now(); let render = 0, shot = 0;
    for (let i = 0; i < 8; i++) {
      const a = Date.now(); await p.evaluate(t => render(t), 10 + i / 60); const m = Date.now();
      await p.screenshot(cfg.type === 'jpeg' ? { type: 'jpeg', quality: 100 } : { type: 'png' }); shot += Date.now() - m; render += m - a;
    }
    console.log(cfg.name, 'ms/frame', Math.round((Date.now() - t0) / 8), 'render', Math.round(render / 8), 'shot', Math.round(shot / 8));
    await b.close();
  }
})();
