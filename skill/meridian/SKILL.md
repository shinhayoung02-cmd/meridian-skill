---
name: meridian
description: MERIDIAN(=FLIGHT RHYTHM, 대한항공 747-8i 프리미엄 캐빈 서비스) 영상 제작·전반 작업을 이어서 시작할 때 사용. Figma "영상 자료 요소" LOG 페이지 대조 → 수정 요청은 로그에 먼저 기록 → 사용자 OK 후에만 적용하는 승인 워크플로우.
---

# /meridian

MERIDIAN(FLIGHT RHYTHM) 작업 — UI 흐름 영상(라운지/기내 모니터/승무원 3편), 30초 스토리보드, 그 밖의 전반 작업 — 의 진입점이다.
이름 표기: 사용자는 **MERIDIAN**, 기존 Figma·PDF에는 **MERIDIEN** 표기가 섞여 있다. 새로 쓰는 건 사용자 표기를 따르되, 기존 자료의 표기는 함부로 바꾸지 말 것(바꿀 거면 로그에 올려 확인).

## 0. 절대 규칙 — 승인 없이는 아무것도 수정하지 않는다

1. 사용자가 수정 사항을 알려주면 **바로 적용하지 말고**, 먼저 LOG 페이지 표에 행을 추가한다 (상태 `확인 대기`).
2. 채팅으로 "로그에 이렇게 올렸어요"라고 항목을 짧게 보여주고 확인을 받는다.
3. 사용자가 **OK** 하면 그때 적용 → 해당 행 상태를 `적용 완료`로 바꾼다. 일부만 OK면 그 행만 적용, 나머지는 `보류`.
4. 여러 수정 요청은 모아서 로그에 올리고, OK 후 한꺼번에 적용한다.
5. **작업실 파일(`UygFyjWp5R3cpdrYD5Nrga`)은 사용자가 명시적으로 "수정해 달라"고 할 때만 쓴다.** 그 외엔 읽기 전용(톤앤매너 참조·노드 확인만). 이 원칙은 다른 파일·로컬 영상 코드에도 똑같이 적용된다 — 임의 수정 금지.
6. 로그 기록 자체(LOG 페이지에 행 추가·상태 변경)만 승인 없이 해도 된다.

## 1. 컨텍스트 로드

메모리(`C:\Users\Admin\.claude\projects\C--Users-Admin\memory\`):
- `project_meridian_ui_video.md` — 영상 파이프라인, 화질, 모션 원칙, 노드 ID, 스토리보드 위치
- `project_flight_rhythm_crewpad_figma.md`, `project_asiana_premium_cabin_figma.md` — 관련 Figma
- `feedback_tving_figma_exact_reproduction.md` — UI 재디자인 금지, 실제 화면에 모션만

## 2. 세션 시작 프로토콜 (작업 전에 먼저 보고)

1. 영상 파일 `영상 자료 요소`(fileKey `KiJyBUFdcvGnvQdT4LOcTv`)의 **LOG 페이지(page `27:2`, 표 `27:24`)** 를 읽는다.
2. `확인 대기`/`승인` 상태로 남은 행이 있는지, 사용자가 직접 적은 행이 있는지 본다.
3. 로그가 가리키는 실제 노드를 열어 로그 내용과 현재 상태가 맞는지 대조한다 — 로그만 믿지 말 것.
4. 결과(새 항목, 미적용 항목, 로그와 실제가 다른 점)를 다른 작업 전에 짧게 보고한다.

### LOG 표 다루는 법
- 페이지 `LOG`(27:2) → 프레임 `MERIDIAN 변경 로그`(27:3) → `Log Table`(27:24).
- 새 항목 = 마지막 `Row`를 `clone()` → 표 끝에 append → 텍스트 교체. 열: No / 날짜(YYYY-MM-DD) / 작성(사용자·Claude) / 대상(페이지·노드ID 또는 파일 경로) / 변경 내용 / 상태.
- 상태 알약 색: 확인 대기 `#F84613` · 승인 `#7498EC` · 적용 완료 `#1C3FAD` · 보류 `#0F2A89`.
- 폰트는 Noto Sans KR (Pretendard·KoreanAirSansKR는 MCP에서 로드 불가).

## 3. 자료 위치 (우선순위 순)

1. **기획 PDF** (`C:\Users\Admin\Downloads\`) — 제작의 기준
   - `7주차 신유박.pdf` (241MB, 78p) — 메인 덱: INTRO/CONCEPT/SOLUTIONS/INTERFACE/EXPERIENCE, 30초 영상 스토리보드, 라운지 패드·시트 모니터·크루 패드 화면 설명
   - `7주차 신유박_2 화면 정의서.pdf` (182MB, 74p)
   - `7주차 신유박_2 화면 흐름도.pdf` (96MB, 25p)
   - ⚠ `pdftotext`로 뽑으면 **한글이 깨지고 영문만 남는다**(폰트 인코딩). 페이지를 이미지로 렌더해서 읽을 것:
     `"/c/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin/pdftoppm" -r 50 -jpeg -f N -l M "<pdf>" <out>/p` → Read로 jpg 확인 (50dpi면 한글 충분히 읽힘, 세부는 -r 100)
   - 흐름도 = Lounge Pad 등 디바이스별 "이용 가이드"(화면 + 번호 주석 + 버튼 → 다음 화면), 정의서 = 화면별 요소 정의(번호 주석)
2. **Obsidian Vault** `C:\Users\Admin\Documents\Obsidian Vault\MJC\디자인 스튜디오\` — `01_기획`(PRD), `02_리서치`(프레스티지·라운지·승무원·IFE·통합 리서치), `03_주차별 내용정리`(교수님 컨펌 정리)
3. **Figma**
   - 영상 자료 요소 `KiJyBUFdcvGnvQdT4LOcTv`: `LOG` 27:2 / `영상 시퀀스` 26:394 / `라운지 패드` 0:1 / `기내 모니터` 1:448 / `승무원 패드` 1:449 — 작업 대상 파일
   - 작업실 `UygFyjWp5R3cpdrYD5Nrga` — **읽기 전용(요청 시에만 수정)**. 톤앤매너 페이지 `ㅌㅇㅁㄴ` 6:5, 공용 작업 페이지 178:385, 스토리보드 섹션 587:865
4. **영상 코드** `~/projects/meridian-video` — `node render.js <flow>/<flow>.html out.mp4 30` (세부는 메모리 참조)

## 4. 톤앤매너 (작업실 6:5 `SEMANTIC COLOR` 프레임 325:750 기준)

| 토큰 | 값 | 용도 |
|---|---|---|
| surface.canvas | Navy 900 `#051766` | 전체 배경 |
| surface.default | Navy 800 `#0F2A89` | 카드·패널 |
| surface.raised | Navy 700 `#1C3FAD` | 선택·강조 영역 |
| border.subtle | Navy 600 `#2D57CD` | 기본 구분선 |
| border.focus | Navy 400 `#7498EC` | 포커스·선택 |
| content.primary | Navy 50 `#F1F5FF` | 주요 텍스트 |
| content.secondary | Navy 200 `#C3D4F9` | 보조 텍스트 |
| content.muted | Navy 300 `#9FBAF5` | 설명·비활성 |
| content.inverse | Navy 900 `#051766` | 밝은 배경 위 텍스트 |
| action.primary | Orange 600 `#F84613` | 핵심 행동 |
| action.hover | Orange 500 `#FD5E1B` | 행동 강조 |
| status.attention | Orange 700 `#D33B2F` | 주의·알림 |

콘셉트 조합: **Navy × Ember Orange**. 색 스케일 원본: 6:5의 `Navy #051766 — color scale`(292:13865). 화면 UI 자체는 Figma 원본을 그대로 쓰고 재디자인하지 않는다.

## 5. 보고 후 진행

2번 보고가 끝나면 사용자 요청을 받는다. 수정 요청이면 0번 규칙대로 **로그 → OK → 적용** 순서를 지킨다.

## 6. 공유 레포

https://github.com/shinhayoung02-cmd/meridian-skill (Public) — 로컬 `~/projects/meridian-video`. 이 SKILL.md를 고치면 `skill/meridian/SKILL.md`에도 복사. 커밋·푸시는 사용자가 요청할 때만.
