// LOG 44: 물결 섹션 카드 4장 생성 + 렌더 (Figma 338:2 Section 4 412:819 문구)
// 사용: node sec/gen_sec.js  → sec/w1~4/ (crew.png = 앞 클립 마지막 프레임, mon.png = full2 물결 끝난 뒤 프레임) → D:\디자인스튜디오\MERIDIAN\SECTION\
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), ff = require('ffmpeg-static');
const W = 'D:/디자인스튜디오/MERIDIAN', BASE = `${W}/_work/full2_base_1080p.mp4`, SKIP = 1.25;
const F = n => { const d = require('../feat/durations_short.json')[n]; return `${W}/FEAT_short/MERIDIAN_FEAT${n}_${d.name}_short_1080p.mp4`; };
const S = n => `${W}/SYNC/MERIDIAN_SYNC0${n}_1080p.mp4`;
const CARDS = [
  { t: 34.83, prev: S(2), num: '1', label: '01 · In-flight Journey', x: 760, y: 347, lines: ['좌석 모니터에서 [식사]와', '[휴식] 일정을 내 리듬에 맞게', '확인하고 조정합니다.'] },
  { t: 66.82, prev: S(3), num: '2', label: '02 · Medical Help', x: 891, y: 347, lines: ['몸이 불편할 때 [증상]과', '[필요한 물품]을 선택해', '승무원에게 알립니다.'] },
  { t: 82.33, prev: F('06'), num: '3', label: '03 · Personal Care', x: 760, y: 399, lines: ['필요한 [어메니티 세트]를', '선택해 간편하게 요청합니다.'] },
  { t: 92.98, prev: F('09'), num: '4', label: '04 · Comfort & Safety', x: 891, y: 298, lines: ['직접 말하기 어려운', '[불편 상황]과', '[원하는 응대 방식]을', '조용히 전달합니다.'] },
];
module.exports = { CARDS, SKIP };
if (require.main === module) {
  const tpl = fs.readFileSync(path.join(__dirname, 'sec_tpl.html'), 'utf8'); fs.mkdirSync(`${W}/SECTION`, { recursive: true });
  const ff1 = a => { const r = spawnSync(ff, ['-y', '-v', 'error', ...a]); if (r.status) throw new Error(r.stderr + ''); };
  CARDS.forEach((c, i) => {
    const d = path.join(__dirname, `w${i + 1}`); fs.mkdirSync(d, { recursive: true });
    ff1(['-sseof', '-0.1', '-i', c.prev, '-update', '1', '-frames:v', '1', `${d}/crew.png`]);
    ff1(['-ss', String(c.t + SKIP), '-i', BASE, '-frames:v', '1', `${d}/mon.png`]);
    fs.writeFileSync(`${d}/sec.html`, tpl.replace('/*SPEC*/', 'const SPEC = ' + JSON.stringify(c) + ';'));
    if (process.argv[2] !== 'html') { const o = `${W}/SECTION/MERIDIAN_SECTION0${i + 1}_1080p.mp4`;
      spawnSync('node', [path.join(__dirname, '..', 'render.js'), `${d}/sec.html`, o, '30'], { stdio: 'ignore' }); console.log('rendered', o); }
  });
}
