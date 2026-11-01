function wipeClipV(e) { return `path('M -10 -10 L 1930 -10 L 1930 ${e - 70} C 1300 ${e + 60}, 640 ${e - 100}, -10 ${e + 50} Z')`; }
function wipeEdgeV(e, a) { g.save(); g.shadowColor = `rgba(2,6,31,${.45 * a})`; g.shadowBlur = 40; g.shadowOffsetY = 10; g.strokeStyle = `rgba(${ORG},${.5 * a})`; g.lineWidth = 2; g.beginPath(); g.moveTo(1930, e - 70); g.bezierCurveTo(1300, e + 60, 640, e - 100, -10, e + 50); g.stroke(); g.restore(); }
function renderSync(s, lt) {
  const sy = s.sync, maxPan = geo(s.img).h - 1080, base = crewPan(s, 1);
  const pt = base + (sy.scrollAfter ? (maxPan - base) * easeInOut(prog(lt, 4.1, 2.0)) : 0); place(s, 0);
  s.mainImg.style.top = (geo(s.img).top - pt) + 'px'; s.fromImg.style.top = geo(sy.from).top + 'px'; if (s.preImg) s.preImg.style.top = (geo(sy.pre).top - pt) + 'px';
  const flip = sy.dir === 'left', top = sy.dir === 'top', ft = geo(sy.from).top, tt = geo(s.img).top - pt;
  const SR = [sy.src[0] * S, sy.src[1] * S + ft, sy.src[2] * S, sy.src[3] * S], DR = [sy.dst[0] * S, sy.dst[1] * S + tt, sy.dst[2] * S, sy.dst[3] * S];
  const a = [SR[0] + SR[2] / 2, SR[1] + SR[3] / 2], b = [DR[0] + DR[2] / 2, DR[1] + DR[3] / 2];
  const H0 = sy.hold || 0, dr = sy.direct;
  // 타이밍 (direct: 앞 갈래에서 이어지므로 떠오름 없이 바로 날아옴)
  const L0 = H0 + .25, L1 = H0 + .7, C1 = dr ? 0 : H0 + 1.2, M1 = dr ? .95 : H0 + 2.9, D1 = M1 + .5;
  const W0 = dr ? 0 : H0 + 1.35, W1 = dr ? .9 : H0 + 2.65, wk = prog(lt, W0, W1 - W0);
  if (top) { const e = lerp(-260, 1340, chewy(wk)); s.toWrap.style.clipPath = wk <= 0 ? 'inset(0 0 100% 0)' : wk >= 1 ? 'none' : wipeClipV(e); if (wk > 0 && wk < 1) wipeEdgeV(e, Math.sin(Math.PI * wk)); }
  else { const e = lerp(2060, -260, chewy(wk)); s.toWrap.style.clipPath = wk <= 0 ? 'inset(0 0 0 100%)' : wk >= 1 ? 'none' : wipeClip(e, flip); if (wk > 0 && wk < 1) wipeEdge(e, Math.sin(Math.PI * wk), flip); }
  if (s.preImg) s.preImg.style.opacity = 1 - easeInOut(prog(lt, M1 + .15, .35));
  const sc = sy.small ? .8 : 1; g.font = `${30 * sc}px KAS`; const tw = g.measureText(sy.label).width, PW = tw + 72 * sc, PH = 60 * sc;
  const pill = (cx, cy, w, h, alpha, txt) => {
    g.save(); g.shadowColor = `rgba(${ORG},.55)`; g.shadowBlur = 30; g.fillStyle = `rgba(248,70,19,${alpha})`; rrect(cx - w / 2, cy - h / 2, w, h, h / 2); g.fill(); g.restore();
    if (txt > 0) { g.save(); g.globalAlpha = txt; g.fillStyle = '#fff'; g.font = `${30 * sc}px KAS`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sy.label, cx, cy + 1); g.restore(); }
  };
  // 좌석 착지: 착지 후 좌석이 오렌지로 켜진 채 유지
  if (sy.seat && lt >= M1) { const on = easeOut(prog(lt, M1, .35)); g.save(); g.shadowColor = `rgba(${ORG},.8)`; g.shadowBlur = 24 * on; g.strokeStyle = `rgba(${ORG},${on})`; g.lineWidth = 3; g.fillStyle = `rgba(248,70,19,${.28 * on})`; rrect(DR[0], DR[1], DR[2], DR[3], 8); g.fill(); g.stroke(); g.restore(); }
  const src = dr ? (flip ? [2010, b[1] - 200] : [-90, b[1] - 220]) : a;
  const ctrl = dr ? [(src[0] + b[0]) / 2, Math.min(src[1], b[1]) - 160] : top ? [(a[0] + b[0]) / 2 + 160, -260] : [(a[0] + b[0]) / 2 + (flip ? -1 : 1) * 120, Math.min(a[1], b[1]) - 260];
  if (lt < L0 && !dr) return;
  if (!dr && lt < C1) {
    // 출발점이 은은하게 밝아졌다 사라지고 그 자리에서 캡슐이 생겨남
    const up = chewy(prog(lt, L0, L1 - L0)), cd = chewy(prog(lt, L1, C1 - L1)), hi = up * (1 - cd);
    if (hi > 0) cut(sy.from, sy.src, SR[0], SR[1], SR[2], SR[3], hi, `brightness(${1 + .25 * hi})`);
    if (cd > 0) pill(a[0], a[1], PW * lerp(.6, 1, cd), PH * lerp(.6, 1, cd), cd, cd);
    return;
  }
  if (lt < M1) { const k = chewy(prog(lt, C1, M1 - C1)), p = bz(src, ctrl, b, k); comet(src, ctrl, b, k, .22, 12 * sc); pill(p[0], p[1], PW, PH, 1, 1); return; }
  const dk = chewy(prog(lt, M1, D1 - M1));
  if (dk < 1) pill(b[0], b[1], PW * lerp(1, .55, dk), PH * lerp(1, .55, dk), 1 - dk, clamp(1 - dk * 2));
  const gk = prog(lt, M1 + .1, 1.1), glow = gk > 0 && gk < 1 ? Math.sin(Math.PI * gk) : 0;
  if (glow > 0 && !sy.seat) cut(s.img, sy.dst, DR[0], DR[1], DR[2], DR[3], glow, `brightness(${1 + .18 * glow})`);
  halftone(b[0], b[1], (lt - M1 - .15) / 1.8);
}
// 마무리 오버레이: 화면이 흐려지며 가라앉고 태그라인이 자간이 좁혀지며 안착, 한 박자 뒤 한글 한 줄
function renderOverlay(s, u, alpha) {
  const k = easeInOut(prog(u, 0, 1.1)); s.root.style.filter = `blur(${14 * k}px) brightness(${1 - .55 * k})`;
  const tk = chewy(prog(u, .5, 1.4)), kk = easeOut(prog(u, 1.3, .8));
  g.save(); g.globalAlpha = alpha * clamp(prog(u, .5, .5)); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '44px KAS'; g.letterSpacing = `${lerp(40, 12, tk)}px`; g.fillStyle = 'rgb(251,109,81)'; g.fillText('YOUR TIME. OUR HARMONY.', 960, 500); g.restore();
  g.save(); g.globalAlpha = alpha * kk; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '30px KAS'; g.fillStyle = '#F1F5FF'; g.fillText('정보가 이동하고, 사람이 서비스합니다.', 960, 580 + 16 * (1 - kk)); g.restore();
}
