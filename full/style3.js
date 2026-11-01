// ── STYLE 3: 이용 가이드형 콜아웃 (작업실 587:20386 · 587:20355 참고) ──
// 핵심 화면에서 영상이 잠깐 멈추고, 화면이 왼쪽으로 물러나며 오른쪽에 번호 콜아웃이 하나씩 붙음.
// 콜아웃 = 오렌지 번호 · 기능 이름 · 한 줄 설명 · 해당 UI 확대 조각, 화면의 해당 위치와 가는 선으로 연결.
(() => {
  const stageEl = document.getElementById('stage');
  const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080;
  cv.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:100';
  document.body.appendChild(cv); const c = cv.getContext('2d');

  // [장면, n번째, 멈출 시점(장면 기준 초), 화면 제목, 화면 설명, 콜아웃들[[영역(카드 1120 기준), 이름, 설명]]]
  const P = [
    ['L12', 0, .7, '비행 일정 확정', '라운지에서 고른 식사 · 수면 · 기상 계획을 한 화면에서 확인하고 확정합니다.', [
      [[57, 205, 335, 258], '첫 식사', '라운지에서 고른 메뉴와 식사 시각입니다.'],
      [[392, 205, 335, 258], '휴식 시간', '잠들고 일어날 시각과 휴식 시간입니다.'],
      [[727, 205, 336, 258], '깨우기 방식', '식사 시간에 맞춰 승무원이 직접 깨웁니다.'],
      [[855, 550, 151, 49], '계획 확정', '확정하면 승무원 패드에 그대로 전달됩니다.']]],
    ['M_home', 1, .7, '내 여정', '라운지에서 정한 일정이 좌석 모니터의 타임라인으로 이어집니다.', [
      [[402, 94, 318, 116], '곧 이어질 일정', '다음 일정을 가장 크게 알려줍니다.'],
      [[33, 330, 1053, 180], '여정 타임라인', '출발 · 도착과 식사 · 휴식 일정을 보여줍니다.'],
      [[904, 12, 203, 60], '비행 진행', 'ICN에서 CDG까지 현재 위치를 보여줍니다.'],
      [[880, 570, 200, 50], '승무원 호출', '필요할 때 요청 메뉴로 바로 이동합니다.']]],
    ['M_cconf', 0, .8, '조용한 도움 · 요청 확인', '말하기 어려운 상황을 소리 없이 승무원에게 전달합니다.', [
      [[510, 172, 100, 102], '요청 접수', '요청이 승무원에게 전달되었음을 알려줍니다.'],
      [[300, 330, 510, 110], '선택한 상황 · 방식', '고른 상황과 접근 방식을 다시 보여줍니다.'],
      [[320, 466, 480, 44], '접근 안내', '승무원이 주목을 끌지 않게 다가옵니다.']]],
    ['C_dash', 0, 2.05, '운항 현황 한눈에 보기', '라운지에서 정한 계획이 반영된 비행 상태와 남은 업무를 한 화면에서 봅니다.', [
      [[84, 211, 680, 50], '운항 상태 바', '탑승 인원, 비행 단계, 도착 시간, 다음 서비스입니다.'],
      [[64, 547, 438, 159], '업무 요약 카드', '미완료 업무 · 승객 요청 · 다음 서비스 · 주의 승객 수입니다.'],
      [[529, 278, 545, 123], '객실 구역 현황', '구역별 진행률과 남은 업무를 보여줍니다.'],
      [[529, 633, 545, 57], '구역 요약', '선택 구역의 담당 인원 · 미완료 업무 · 다음 서비스입니다.']]],
    ['C_detail', 0, 2.05, '조용한 도움 요청 대응', '승객이 말하지 않아도, 상황과 원하는 접근 방식을 먼저 확인합니다.', [
      [[282, 276, 535, 118], '상황 · 접근 방식', '승객이 고른 상황과 조용히 와 달라는 요청입니다.'],
      [[282, 420, 535, 186], '접근 가이드', '호출음이나 이름 부르기 없이 다가가는 방법입니다.'],
      [[826, 300, 280, 210], '확인 절차', '상황 확인 · 조용한 접근 · 대응 기록을 차례로 체크합니다.'],
      [[945, 780, 154, 46], '확인 시작', '확인 절차를 시작하면 승객 화면에도 진행 중으로 표시됩니다.']]],
  ];
  const ENTER = .8, STEP = .55, READ = 2.4, EXIT = .7;
  // 원래 타임라인 위의 멈춤 지점 (원래 시간 기준)
  const PZ = P.map(p => { const s = shots.filter(x => x.img === p[0])[p[1]]; const dur = ENTER + STEP * p[5].length + READ + EXIT; return { p, s, at: s.t0 + p[2], dur }; }).sort((a, b) => a.at - b.at);
  const base = window.DURATION; window.DURATION = base + PZ.reduce((a, z) => a + z.dur, 0);
  const orig = window.render;

  const rr = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const wrap = (txt, maxW) => { const out = []; let line = ''; for (const w of txt.split(' ')) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; };

  window.render = function (T) {
    c.clearRect(0, 0, 1920, 1080);
    // 실제 시간 T → 원래 타임라인 시간 t (멈춤 구간 동안 t 고정)
    let t = T, z = null, local = 0;
    for (const q of PZ) { if (t < q.at) break; if (t < q.at + q.dur) { z = q; local = t - q.at; t = q.at; break; } t -= q.dur; }
    const ret = orig(t);
    if (!z) { stageEl.style.transform = ''; stageEl.style.transformOrigin = ''; return ret; }
    const [img, , , title, sub, items] = z.p, n = items.length;
    const inK = easeInOut(clamp(local / ENTER)), outK = easeInOut(clamp((local - (z.dur - EXIT)) / EXIT)), k = inK * (1 - outK);
    // 화면이 왼쪽으로 물러남 (가이드 레이아웃: 화면 왼쪽 · 콜아웃 오른쪽)
    const SC = .6, OX = 70, OY = 250, sc = lerp(1, SC, k);
    stageEl.style.transformOrigin = '0 0';
    stageEl.style.transform = `translate(${OX * k}px, ${OY * k}px) scale(${sc})`;
    // 배경 위 제목
    c.save(); c.globalAlpha = k; c.fillStyle = '#F1F5FF'; c.font = '700 54px KAS'; c.fillText(title, OX, 132);
    c.fillStyle = '#AFC0EE'; c.font = '28px KAS'; c.fillText(sub, OX, 186); c.restore();
    // 화면 테두리(얇은 그림자)
    c.save(); c.globalAlpha = k; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 40; c.shadowOffsetY = 14; c.fillStyle = 'rgba(0,0,0,.001)'; rr(OX, OY, 1920 * SC, 1080 * SC, 14); c.fill(); c.restore();
    // 콜아웃
    const pan = img.startsWith('C_') ? crewPan(z.s, 1) : 0, top = geo(img).top, im = imgs[img], ik = im.naturalWidth / 1920;
    const PX = OX + 1920 * SC + 70, PW = 1920 - PX - 60, rowH = Math.min(178, (1080 - OY - 20) / n);
    items.forEach(([r, name, desc], i) => {
      const a = easeOutQuart(clamp((local - ENTER * .7 - STEP * i) / .5)) * (1 - outK); if (a <= 0) return;
      const [x, y, w, h] = r.map(v => v * S), sy = y + top - pan;
      // 화면 위 표시 지점(요소 오른쪽 가장자리 중앙) → 축소 좌표
      const ex = OX + (x + w) * SC, ey = OY + (sy + h / 2) * SC, ry = OY + i * rowH + 26;
      // 요소 강조: 얇은 오렌지 테두리
      c.save(); c.globalAlpha = a; c.save(); c.beginPath(); c.rect(OX, OY, 1920 * SC, 1080 * SC); c.clip(); c.strokeStyle = 'rgba(248,70,19,.9)'; c.lineWidth = 2; rr(OX + x * SC - 4, OY + sy * SC - 4, w * SC + 8, h * SC + 8, 8); c.stroke(); c.restore();
      // 연결선: 요소 → 오른쪽으로 꺾여 콜아웃 번호
      const mx = PX - 34; c.strokeStyle = 'rgba(248,70,19,.85)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ex + 4, ey);
      const prog = clamp((local - ENTER * .7 - STEP * i) / .45), segs = [[mx, ey], [mx, ry], [PX - 4, ry]];
      let L = 0, pts = [[ex + 4, ey], ...segs]; const tot = pts.slice(1).reduce((s, p, j) => s + Math.hypot(p[0] - pts[j][0], p[1] - pts[j][1]), 0), lim = tot * easeOutQuart(prog);
      for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); if (L + d <= lim) { c.lineTo(pts[j][0], pts[j][1]); L += d; } else { const f = (lim - L) / d; c.lineTo(lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)); break; } }
      c.stroke(); c.fillStyle = '#F84613'; c.beginPath(); c.arc(ex + 4, ey, 5, 0, 7); c.fill();
      // 번호 배지 · 이름 · 설명
      c.fillStyle = '#F84613'; c.beginPath(); c.arc(PX + 18, ry, 18, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.font = '700 20px KAS'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i + 1, PX + 18, ry + 1);
      c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#F1F5FF'; c.font = '700 30px KAS'; c.fillText(name, PX + 50, ry);
      c.fillStyle = '#AFC0EE'; c.font = '22px KAS'; const lines = wrap(desc, PW - 50); lines.forEach((l, j) => c.fillText(l, PX + 50, ry + 38 + j * 30));
      // UI 확대 조각
      const th = Math.min(rowH - 52 - lines.length * 30, 96); if (th > 30) {
        const tw = Math.min(PW - 50, th * w / h), tx = PX + 50, ty = ry + 24 + lines.length * 30;
        c.save(); rr(tx, ty, tw, th, 8); c.clip(); c.drawImage(im, x * ik, y * ik, w * ik, h * ik, tx, ty, tw, th); c.restore();
        c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1; rr(tx, ty, tw, th, 8); c.stroke();
      }
      c.restore();
    });
    return ret;
  };
})();
