// ── STYLE 2 (레퍼런스: PRISM 서비스 소개 영상) ──
// 1) 핵심 순간마다 카메라가 해당 UI로 밀고 들어가 클로즈업 → 옆에 짧은 캡션(키워드 하이라이트 쓸어내기) → 다시 빠짐
// 2) 기기가 바뀌는 페이지 전환은 모서리가 접히며 넘어가는 페이지 컬
(() => {
  const stageEl = document.getElementById('stage');
  // 캡션 레이어 (카메라 줌 영향 안 받게 stage 밖)
  const cap = document.createElement('div');
  cap.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:100';
  document.body.appendChild(cap);
  const shade = document.createElement('div'); shade.style.cssText = 'position:absolute;inset:0;opacity:0'; cap.appendChild(shade);
  const box = document.createElement('div'); box.style.cssText = 'position:absolute;top:0;width:760px;font-family:KAS;opacity:0'; cap.appendChild(box);
  const lab = document.createElement('div'); lab.style.cssText = 'font-size:24px;line-height:1.2;color:#FB6D51;letter-spacing:.06em;margin-bottom:18px;white-space:nowrap'; box.appendChild(lab);
  const l1 = document.createElement('div'); l1.style.cssText = 'display:none'; box.appendChild(l1);
  const l2w = document.createElement('div'); l2w.style.cssText = 'position:relative;display:inline-flex;align-items:center;gap:18px'; box.appendChild(l2w);
  const badge = document.createElement('div'); badge.style.cssText = 'position:relative;z-index:1;flex:none;width:48px;height:48px;border-radius:50%;background:#F84613;color:#fff;font:700 26px/48px KAS;text-align:center'; l2w.appendChild(badge);
  const desc = document.createElement('div'); desc.style.cssText = 'margin-top:20px;font-size:32px;line-height:1.5;color:#C9D3F5;letter-spacing:-0.02em;word-break:keep-all'; box.appendChild(desc);
  // UI 쪽 번호 마커 + 가는 연결선
  const mk = document.createElement('div'); mk.style.cssText = 'position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:#F84613;color:#fff;font:700 24px/44px KAS;text-align:center;box-shadow:0 0 0 6px rgba(248,70,19,.25);opacity:0'; cap.appendChild(mk);
  const ln = document.createElement('div'); ln.style.cssText = 'position:absolute;height:2px;background:rgba(248,70,19,.8);transform-origin:0 50%;opacity:0'; cap.appendChild(ln);
  const hl = document.createElement('div'); hl.style.cssText = 'position:absolute;left:56px;right:-10px;bottom:4px;height:14px;background:#F84613;opacity:.9;border-radius:4px;transform-origin:left center'; l2w.appendChild(hl);
  const l2 = document.createElement('div'); l2.style.cssText = 'position:relative;font-size:62px;line-height:1.25;font-weight:700;color:#fff;letter-spacing:-0.02em;white-space:nowrap'; l2w.appendChild(l2);

  // 포커스 장면: 장면 이미지 이름, n번째 등장, 시작(장면 기준 초), 길이, 확대 영역(카드 1120 기준), 캡션
  const F = [
    ['L02', 0, .35, 2.4, [300, 120, 520, 400], '01  라운지 패드', '모바일 탑승권 스캔', '탑승권을 대면 항공편과 서비스 계획을 불러옵니다.', 'right', 1],
    ['L08', 0, .2, 1.9, [560, 170, 450, 270], '01  라운지 패드', '휴식 시간 정하기', '잠들 시각과 일어날 시각을 정하면 휴식 시간이 자동 계산됩니다.', 'left', 2],
    ['L12', 0, .2, 1.3, [40, 120, 1040, 300], '01  라운지 패드', '비행 일정 확정', '고른 음료 · 식사 · 수면 계획이 시간순으로 정리되고, 승무원 패드에 그대로 전달됩니다.', 'left', 3],
    ['M_home', 1, .3, 1.6, [33, 260, 1053, 240], '02  좌석 모니터', '내 여정 타임라인', '라운지에서 정한 일정이 좌석 화면의 타임라인으로 이어집니다.', 'left', 4],
    ['M_mealrem', 0, .9, 1.6, [300, 200, 520, 220], '02  좌석 모니터', '식사 알림', '식사 5분 전에 알림이 뜨고, 시간을 바로 바꿀 수 있습니다.', 'left', 5],
    ['M_cconf', 0, .2, 1.8, [230, 150, 660, 320], '02  좌석 모니터', '조용한 도움', '말하기 어려운 상황을 조용히 알리면, 승무원이 주목을 끌지 않게 다가옵니다.', 'left', 6],
    ['C_assist', 0, 2.6, 1.6, [120, 250, 420, 260], '03  승무원 패드', '도움 요청 대응', '승객이 조용히 보낸 요청이 좌석 배치도에 바로 표시됩니다.', 'right', 7],
    ['C_detail', 0, .3, 1.6, [540, 150, 540, 420], '03  승무원 패드', '좌석 상세 업무', '요청 경로 · 준비물 · 특이사항과 확인 절차를 한 화면에서 정리합니다.', 'left', 8],
    ['M_done', 0, 2.4, 1.4, [230, 100, 660, 380], '02  좌석 모니터', '요청 상태 확인', '승무원이 처리를 마치면 승객 화면도 바로 완료로 바뀝니다.', 'left', 9],
  ];
  const IN = .65, OUT = .55, Z = 1.55;
  const focusAt = t => {
    for (let [img, nth, at, hold, r, lab, c1, c2, side, num] of F) {
      const s = shots.filter(x => x.img === img)[nth]; if (!s) continue;
      hold = Math.max(.3, Math.min(hold, s.t1 - s.t0 - at - IN - OUT)); const a = s.t0 + at, b = a + IN + hold + OUT; if (t < a || t > b) continue;
      const u = t - a, k = u < IN ? chewy(u / IN) : u < IN + hold ? 1 : 1 - easeInOut((u - IN - hold) / OUT);
      const vel = u < IN ? 1 - u / IN : u > IN + hold ? Math.sin(Math.PI * (u - IN - hold) / OUT) : 0;
      return { s, r, lab, c1, c2, side, num, k, vel, u, hold };
    }
    return null;
  };
  const orig = window.render;
  window.render = function (t) {
    const ret = orig(t);
    const f = focusAt(t);
    if (!f) { stageEl.style.transform = ''; stageEl.style.filter = ''; box.style.opacity = 0; shade.style.opacity = 0; mk.style.opacity = 0; ln.style.opacity = 0; return ret; }
    // 카메라: 포커스 영역 중심이 캡션 반대편 1/3 지점에 오도록 밀고 들어감
    const pan = f.s.img.startsWith('C_') ? (typeof crewPan === 'function' ? crewPan(f.s, 1) : 0) : 0;
    const [x, y, w, h] = f.r.map(v => v * S), cx = x + w / 2, cy = y - pan + h / 2;
    const z = Math.min(Z, 1700 / (w * 1.05), 980 / (h * 1.05)), zz = 1 + (z - 1) * f.k;
    const tx = (f.side === 'left' ? 1920 * .64 : 1920 * .36), ty = 540;
    const dx = (tx - cx * zz) * f.k + (1 - f.k) * 0, dy = (ty - cy * zz) * f.k;
    stageEl.style.transformOrigin = '0 0';
    stageEl.style.transform = `translate(${dx - (zz - 1) * 0}px, ${dy}px) scale(${zz})`;
    stageEl.style.filter = f.vel > .05 ? `blur(${(2.2 * f.vel * f.k).toFixed(2)}px)` : '';
    // 캡션: 회색 한 줄 → 굵은 키워드 + 오렌지 하이라이트가 왼→오로 쓸어지며 깔림
    if (l2.textContent !== f.c1) { lab.textContent = f.lab; l2.textContent = f.c1; desc.textContent = f.c2; badge.textContent = f.num; mk.textContent = f.num; }
    const cu = f.u - IN * .6, ck = clamp(cu / .4), out = 1 - clamp((f.u - IN - f.hold + .05) / .3);
    box.style.left = (f.side === 'left' ? 130 : 1920 - 130 - 760) + 'px';
    box.style.textAlign = f.side === 'left' ? 'left' : 'right';
    box.style.top = (540 - 120) + 'px'; l2w.style.flexDirection = f.side === 'left' ? 'row' : 'row-reverse'; hl.style.left = f.side === 'left' ? '56px' : '-10px'; hl.style.right = f.side === 'left' ? '-10px' : '56px';
    desc.style.opacity = clamp((cu - .35) / .4);
    // 마커: 포커스 영역에서 캡션 쪽 가장자리 중앙
    const ex = (f.side === 'left' ? x : x + w), mx = ex * zz + dx, my = cy * zz + dy, bx = f.side === 'left' ? 130 + 760 + 30 : 1920 - 130 - 760 - 30;
    const mo = clamp((f.u - IN * .8) / .3) * out; mk.style.left = mx + 'px'; mk.style.top = my + 'px'; mk.style.opacity = mo; mk.style.transform = `scale(${.6 + .4 * easeOutQuart(clamp((f.u - IN * .8) / .3))})`;
    const L = Math.abs(mx - bx) - 30, lk = easeOutQuart(clamp((f.u - IN) / .4));
    ln.style.top = my + 'px'; ln.style.left = (f.side === 'left' ? bx : mx + 26) + 'px'; ln.style.width = Math.max(0, L) * lk + 'px'; ln.style.opacity = mo;
    if (f.side !== 'left') { ln.style.left = (mx + 26) + 'px'; }
    box.style.opacity = ck * out; box.style.transform = `translateY(${14 * (1 - easeOutQuart(ck))}px)`;
    hl.style.transform = `scaleX(${easeOutQuart(clamp((cu - .25) / .45))})`; hl.style.opacity = .92 * out;
    shade.style.background = f.side === 'left' ? 'linear-gradient(90deg, rgba(2,6,31,.92) 0%, rgba(2,6,31,.75) 30%, rgba(2,6,31,0) 52%)' : 'linear-gradient(270deg, rgba(2,6,31,.92) 0%, rgba(2,6,31,.75) 30%, rgba(2,6,31,0) 52%)';
    shade.style.opacity = f.k * out;
    return ret;
  };

  // 페이지 컬: 진행도 → 모서리부터 대각선으로 넘어감 (flip: 왼쪽 위 모서리부터)
  const curlC = e => (2060 - e) / 2320 * 3200;
  const poly = (c, flip) => { // (1920-x)+y < c  (flip: x+y < c)
    const pts = []; const X = v => flip ? v : 1920 - v;
    const a1 = Math.min(c, 1920), b1 = Math.min(c, 1080);
    pts.push([X(0), 0], [X(a1), 0]); if (c > 1920) pts.push([X(1920), Math.min(c - 1920, 1080)]);
    if (c > 1080) pts.push([X(Math.min(c - 1080, 1920)), 1080]); pts.push([X(0), b1]);
    return `polygon(${pts.map(p => `${p[0] + (flip ? -2 : 2)}px ${p[1] - 2}px`).join(',')})`;
  };
  wipeClip = (e, flip) => poly(curlC(e), flip);
  wipeEdge = function (e, a, flip) {
    const c = curlC(e); if (c <= 0) return;
    const X = v => flip ? v : 1920 - v;
    // 접힌 뒷면: 접힘선 기준으로 모서리를 뒤집은 삼각형 (오렌지 → 네이비 그라데이션)
    const p1 = [X(Math.min(c, 1920)), Math.max(0, c - 1920)], p2 = [X(Math.max(0, c - 1080)), Math.min(c, 1080)];
    const fw = Math.min(c, 900) * .55, mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2], nx = flip ? -1 : 1;
    const tip = [mid[0] - nx * fw * .7071 * (flip ? -1 : 1) * (flip ? 1 : 1), mid[1] + fw * .7071];
    g.save(); g.shadowColor = 'rgba(2,6,31,.45)'; g.shadowBlur = 40; g.shadowOffsetY = 12;
    const gr = g.createLinearGradient(mid[0], mid[1], tip[0], tip[1]); gr.addColorStop(0, '#F84613'); gr.addColorStop(1, '#0B1445');
    g.fillStyle = gr; g.globalAlpha = Math.min(1, a * 1.6);
    g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.lineTo(tip[0] + (p1[0] - p2[0]) * .05, tip[1]); g.closePath(); g.fill(); g.restore();
  };
  wipeClipV = e => poly(curlC(lerp(2060, -260, (e + 260) / 1600)), false);
  wipeEdgeV = (e, a) => wipeEdge(lerp(2060, -260, (e + 260) / 1600), a, false);
})();
