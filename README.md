# MERIDIAN (FLIGHT RHYTHM)

대한항공 747-8i 프리미엄 캐빈 서비스 **MERIDIAN**의 UI 흐름 영상 제작 코드와 Claude Code 스킬.

## 구성

| 경로 | 내용 |
|---|---|
| `skill/meridian/SKILL.md` | Claude Code 스킬 `/meridian` — 작업 진입점, 변경 로그 승인 워크플로우, 자료 위치, 톤앤매너 토큰 |
| `lounge/` | 01 LOUNGE DEVICE — `lounge_20s.html`, `lounge_40s.html` + Figma 화면 PNG |
| `monitor/` | 02 PASSENGER MONITOR — `monitor.html` + 4x 화면 PNG |
| `crew/` | 03 CREW DEVICE — `crew.html` + 화면 PNG |
| `render.js` | HTML 모션 → mp4 렌더러 (playwright-core + Edge + ffmpeg-static) |

## 스킬 설치

```bash
mkdir -p ~/.claude/skills/meridian
cp skill/meridian/SKILL.md ~/.claude/skills/meridian/
```

Claude Code 새 세션에서 `/meridian`으로 시작한다.
수정 요청은 Figma `영상 자료 요소` 파일의 **LOG 페이지**에 먼저 `확인 대기`로 기록하고, OK를 받은 뒤에만 적용한다.

## 영상 렌더

```bash
npm install
node render.js lounge/lounge_40s.html out.mp4 30        # 1080p
node render.js lounge/lounge_40s.html out.mp4 30 2      # 4K
node render.js lounge/lounge_40s.html --stills 1.5,8.2  # 특정 시점 PNG
```

Microsoft Edge가 설치돼 있어야 한다. 결과물(mp4)은 레포에 포함하지 않는다.
