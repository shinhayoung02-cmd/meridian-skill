// [KAS]로 시작하는 텍스트 레이어를 KoreanAirSansKR로 바꾼다.
// 선택한 게 있으면 선택 영역 안에서만, 없으면 현재 페이지 전체.
// Semi Bold / Bold / Extra Bold / Black → Bold, 나머지 → Regular
(async () => {
  const FAMILY = 'KoreanAirSansKR';
  const styleFor = s => /Semi|Bold|Black|Heavy|Extra/i.test(s) ? 'Bold' : 'Regular';
  try {
    await figma.loadFontAsync({ family: FAMILY, style: 'Regular' });
    await figma.loadFontAsync({ family: FAMILY, style: 'Bold' });
  } catch (e) {
    figma.closePlugin('KoreanAirSansKR 폰트를 찾을 수 없어요. 데스크톱 앱에서 실행했는지, 폰트가 설치돼 있는지 확인해 주세요.');
    return;
  }
  const roots = figma.currentPage.selection.length ? figma.currentPage.selection : [figma.currentPage];
  const texts = [];
  for (const r of roots) {
    if (r.type === 'TEXT') texts.push(r);
    if ('findAllWithCriteria' in r) texts.push(...r.findAllWithCriteria({ types: ['TEXT'] }));
  }
  let changed = 0, failed = 0;
  for (const t of texts) {
    if (!t.name.startsWith('[KAS]')) continue;
    try {
      const segs = t.getStyledTextSegments(['fontName']);
      for (const s of segs) await figma.loadFontAsync(s.fontName); // 기존 폰트도 로드해야 수정 가능
      for (const s of segs) t.setRangeFontName(s.start, s.end, { family: FAMILY, style: styleFor(s.fontName.style) });
      changed++;
    } catch (e) { failed++; }
  }
  figma.closePlugin(`KoreanAirSansKR로 ${changed}개 변경` + (failed ? ` · 실패 ${failed}개(폰트 누락 등)` : ''));
})();
