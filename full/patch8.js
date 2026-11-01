// 보드(232:1200) 기준 전환 8가지 반영
const fs = require('fs'); let s = fs.readFileSync('full2.html', 'utf8');
const R = (a, b) => { if (!s.includes(a)) console.log('MISS', a.slice(0, 70)); s = s.replace(a, b); };
const SEAT = [219, 317, 44, 40];
// 1) Done 버튼에서 출발 + 0.3초 정적, 위에서 내려오는 전환 / 2) 크루 갈래는 0.2초 차이로 곧바로
R("add('M_home', 32, 36.6, { sync: { from: 'L12', src: [57, 205, 1006, 258],", "add('M_home', 32, 35.4, { sync: { from: 'L12', hold: .3, src: [855, 550, 151, 49],");
R("add('C_seat12a', 36.6, 40.6, { sync: { from: 'M_home', src: [33, 277, 1053, 223],", "add('C_seat12a', 35.4, 37.8, { sync: { from: 'M_home', direct: true, src: [33, 277, 1053, 223],");
// 3) 확인 화면 체크에서 출발 / 4) 12A 좌석에 착지
R("sync: { from: 'M_medconf', src: [238, 291, 643, 172], dst: [787, 249, 277, 130],", `sync: { from: 'M_medconf', src: [510, 162, 101, 102], dst: [${SEAT}], seat: 1,`);
R("sync: { from: 'M_pcconf', src: [238, 290, 642, 172], dst: [787, 249, 277, 130],", `sync: { from: 'M_pcconf', src: [509, 162, 100, 102], dst: [${SEAT}], seat: 1,`);
R("sync: { from: 'M_cconf', src: [239, 300, 642, 160], dst: [787, 249, 277, 130],", `sync: { from: 'M_cconf', hold: .3, src: [510, 172, 100, 102], dst: [${SEAT}], seat: 1,`);
// 5) Coming up next 하단 Call Crew 탭 터치로 진입
R("add('M_next', 75.1, 77.1);", "add('M_next', 75.1, 77.1, { taps: [tp([906, 584, 144, 42, 10], 1.2, { btn: 1 })] });");
// 6) 팝업: 뒤 Home이 어두워지고 팝업이 아래에서 올라옴
R("add('M_sleeprem', 62.5, 65, {", "add('M_sleeprem', 62.5, 65, { popup: [169, 135, 782, 339],");
R("add('M_mealrem', 67.5, 70.5, {", "add('M_mealrem', 67.5, 70.5, { popup: [169, 135, 782, 339],");
// 7) 완료 피드백: In progress 화면에 도착하는 순간 Completed로, 작은 캡슐
R("label: '12A · Completed', dir: 'left' } });", "label: '12A · Completed', dir: 'left', pre: 'M_inprog', small: 1 } });");
// 8) 착륙 → 마무리 오버레이 → 그라데이션
R("add('M_landing', 136.8, 139.8, { surge: true });\nadd('END', 139.8, 145.8, { logo: true });",
  "add('M_landing', 136.8, 139.8, { overlay: true });\nadd('M_landing', 139.8, 142.8, { surge: true, afterOverlay: true });\nadd('END', 142.8, 148.8, { logo: true });");
R("} else if (!(x.logo || x.surge || x.sync || x.scan || x.scroll || x.scrollIn)) d = Math.min(d, 1.8);",
  "} else if (!(x.logo || x.surge || x.sync || x.scan || x.scroll || x.scrollIn || x.overlay)) d = Math.min(d, 1.8);");
// DOM
R("s.mainImg = pic(s.toWrap, s.img); return; }", "s.mainImg = pic(s.toWrap, s.img); if (s.sync.pre) s.preImg = pic(s.toWrap, s.sync.pre); return; }");
R("  else s.mainImg = pic(s.inner, s.base || s.img);",
`  else if (s.popup) { const [px, py, pw, ph] = s.popup.map(v => v * S);
    s.mainImg = pic(s.inner, 'M_home');
    s.dimL = document.createElement('div'); s.dimL.className = 'clip'; s.dimL.style.clipPath = \`path(evenodd, 'M0 0H1920V1080H0Z M\${px} \${py}h\${pw}v\${ph}h-\${pw}Z')\`; pic(s.dimL, s.img); s.inner.appendChild(s.dimL);
    s.popL = document.createElement('div'); s.popL.className = 'clip'; s.popL.style.clipPath = \`inset(\${py}px \${1920 - px - pw}px \${1080 - py - ph}px \${px}px round 18px)\`; pic(s.popL, s.img); s.inner.appendChild(s.popL); }
  else s.mainImg = pic(s.inner, s.base || s.img);`);
// 프레임
R("    if (s.scan) pending.push(renderScan(s, u));",
`    if (s.popup) { const pk = easeOutQuart(prog(u, .12, .55)); s.dimL.style.opacity = easeInOut(prog(u, 0, .4)); s.popL.style.opacity = clamp(prog(u, .12, .25)); s.popL.style.transform = \`translateY(\${90 * (1 - pk)}px)\`; }
    if (s.overlay || s.afterOverlay) renderOverlay(s, s.afterOverlay ? 9 : u, s.afterOverlay ? 1 - easeInOut(prog(u, 0, 1.2)) : 1);
    if (s.scan) pending.push(renderScan(s, u));`);
// renderSync 재작성
const a = s.indexOf('function renderSync(s, lt) {'), b = s.indexOf('const CARD = [872');
s = s.slice(0, a) + fs.readFileSync('sync_fn.js', 'utf8') + '\n' + s.slice(b);
fs.writeFileSync('full2.html', s); console.log('ok');
