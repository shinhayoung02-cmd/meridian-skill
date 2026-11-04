// 전체 연결본 조립 (LOG 40, 2026-11-03): full2 렌더본 사이사이에 SYNC(교체)·기능 설명(짧은 버전) 끼워 넣기 — GUIDE 방식
// 사용: node full/assemble.js  → D:\디자인스튜디오\MERIDIAN\FULL\MERIDIAN_FULL_connected_1080p.mp4
// 시간은 node full/dump_shots.js 결과(full2 장면 시간표) 기준. 선택 화면은 선택이 끝난 뒤(다음 버튼 누르기 직전 = 장면 끝 -0.45초)에 끼움
const { spawnSync } = require('child_process'), ff = require('ffmpeg-static'), fs = require('fs'), path = require('path');
const W = 'D:/디자인스튜디오/MERIDIAN', BASE = `${W}/_work/full2_base_1080p.mp4`, TMP = `${W}/_work/pieces`, OUT = `${W}/FULL/MERIDIAN_FULL_connected_1080p.mp4`;
const S = n => `${W}/SYNC/MERIDIAN_SYNC0${n}_1080p.mp4`;
const F = n => { const d = require('../feat/durations_short.json')[n]; return `${W}/FEAT_short/MERIDIAN_FEAT${n}_${d.name}_short_1080p.mp4`; };
const END = .45, IN = .5;
const { CARDS: SEC, SKIP } = require('../sec/gen_sec.js');
// [base 구간 시작, 끝, 그 뒤에 넣을 클립들]
const plan = [
  [0, 17.07 - END, [F('01')]],             // L07 첫 식사 (선택 끝) → 맞지 않는 메뉴 비활성
  [null, 24.93 - END, [F('02')]],          // L10 깨우는 방식
  [null, 27.13 - END, [F('03')]],          // L11 Flight Schedule (확정 누르기 전)
  [null, 29.03, [S(1), S(2)]],             // 기존 SYNC 장면(29.03~34.83) 교체
  [34.83, 60.42, [S(3)]],                  // 기존 C_update(60.42~66.82) 교체
  [66.82, 73.23 - END, [F('04')]],         // M_symptom 증상 선택
  [null, 77.73, [S(4), F('05'), F('06')]], // 기존 C_water(77.73~82.33) 교체
  [82.33, 86.88 - END, [F('07')]],         // M_fresh 물품 선택
  [null, 88.38, [S(5), F('08'), F('09')]], // 기존 C_wash(88.38~92.98) 교체
  [92.98, 97.75 - END, [F('10')]],         // M_approach 접근 방식
  [null, 99.75, [S(6), F('11')]],          // 기존 C_assist(99.75~104.35) 교체
  [104.35, 104.35, [F('12')]],             // C_dash 대시보드 (페이드 대신 바로)
  [104.35 + IN, 110.26 + IN, [F('13')]],   // C_detail 도움 요청 상세
  [null, 116.96, [S(7)]],                  // 기존 M_done(116.96~121.56) 교체
  [121.56, null, []],
];
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(path.dirname(OUT), { recursive: true });
const fr = t => (Math.round(t * 30) / 30).toFixed(4);
const enc = ['-an', '-r', '30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', '-preset', 'medium'];
const list = []; let prev = null, k = 0, total = 0;
const piece = (args, name) => { const o = `${TMP}/${String(k++).padStart(2, '0')}_${name}.mp4`;
  const r = spawnSync(ff, ['-y', '-v', 'error', ...args, ...enc, o]); if (r.status) throw new Error(r.stderr + ''); list.push(o); return o; };
piece(['-i', `${W}/INTRO/MERIDIAN_INTRO_5s_1080p.mp4`], 'intro'); // LOG 43: 맨 앞 5초 소개
for (const [a0, b, clips] of plan) {
  let a = a0 ?? prev;
  const sc = SEC.findIndex(c => Math.abs(c.t - a) < .01); // LOG 44: 물결 자리에 섹션 카드(물결 포함) 넣고 full2 물결 구간은 건너뜀
  if (sc >= 0) { piece(['-i', `${W}/SECTION/MERIDIAN_SECTION0${sc + 1}_1080p.mp4`], `section${sc + 1}`); a += SKIP; }
  if (b === null || b > a) { const args = ['-ss', fr(a), '-i', BASE]; if (b !== null) args.push('-t', fr(b - a)); piece(args, `base_${a.toFixed(1)}`); }
  for (const c of clips) { if (!fs.existsSync(c)) throw new Error('없음: ' + c); piece(['-i', c], path.basename(c, '.mp4')); }
  prev = b;
}
fs.writeFileSync(`${TMP}/l.txt`, list.map(f => `file '${f}'`).join('\n'));
{ const r = spawnSync('python', ['-I', path.join(__dirname, 'smooth_seams.py'), TMP], { stdio: 'inherit' }); if (r.status) throw new Error('smooth_seams 실패'); } // LOG 45 이음새 점프 완화
const r = spawnSync(ff, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${TMP}/l.txt`, '-c', 'copy', '-movflags', '+faststart', OUT]);
if (r.status) throw new Error(r.stderr + '');
console.log('DONE', OUT, list.length, 'pieces');
