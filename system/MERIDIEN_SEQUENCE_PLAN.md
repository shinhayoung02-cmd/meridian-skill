# MERIDIEN UI 시퀀스 구성안 (전체화면 방식)

> 기준 흐름: `MERIDIEN_UI_FULL_FLOW.md` (A안 49:7165)
> 스타일: 기존 `MERIDIAN_01_LOUNGE_DEVICE_40s` · `MERIDIAN_02_PASSENGER_MONITOR` · `Scan_your_boarding_pass`처럼
> **UI가 화면 전체를 채운 상태**에서 터치 · 선택 · 전환만. 타이틀 카드 없음, 화면 밖 배경 페이지 · 디바이스 축소 배치 없음.

## 공통 모션 규칙
- 터치: 0.09초 눌림 → 0.22초 떼기, 반응은 떼는 순간 (기존 규칙 그대로)
- 선택: 카드 어두워짐 + 오렌지 테두리 · 체크
- 같은 디바이스 안 전환: 다음 화면이 짧게 올라오며 겹침 (기존 방식)
- **디바이스 간 이동 (SYNC)**: 버튼에서 Orange Point 생성 → 곡선으로 화면 가장자리 밖으로 → 다음 디바이스 화면이 전체로 바뀌고 반대편 가장자리에서 점이 들어와 목적지에 착지 → 목적지 오렌지 강조. 경로는 도착 후 0.4초 안에 사라짐
- 표시 스타일 (사람이 만든 모션 느낌, AI 티 금지): 터치는 반투명 흰 손가락 자국 + 옅은 파동 / 강조는 바깥만 어둡게(스포트라이트) + 얇은 흰 테두리 / 이동 경로는 전체 곡선을 그리지 않고 점 뒤에 짧은 꼬리만 남김 / 빛 번짐·꼬리는 하프톤 점 패턴(멀수록 점 작아짐, 영상에선 점이 흩어지며 사라짐) / 모든 움직임에 가감속·살짝 오버슈트·모션 블러
- **쫀득한 키 (레퍼런스: 애프터이펙트 "슈욱~ 아닌 슈우~~육~" 키잡기 튜토리얼)**: 선형·기본 ease 금지. 출발은 빠르게 치고 나가고 도착 전 길게 미끄러지며 감속하는 강한 비대칭 이징
  - 이동·전환: cubic-bezier(0.16, 1, 0.3, 1) 계열 (AE 속도 그래프 기준 out 쪽 영향 85~90%)
  - 팝업·카드 등장: 스프링 1회 오버슈트 (scale 0.92 → 1.03 → 1.0, 0.45초)
  - 터치: 눌림 0.97 빠르게 → 떼는 순간 1.0으로 쫀득하게 복귀
  - Orange Point: 출발 전 0.1초 응축(작아짐, 예비동작) → 튀어나가 길게 감속 → 착지 시 살짝 찌그러졌다 복원 + 파동
  - stagger 간격 0.04~0.06초, 겹쳐서 흐르게
- 스토리보드: 영상 시퀀스 페이지 보드 144:703, 51컷, 약 2분 12초
- 카메라: 필요한 곳만 천천히 확대 · 축소 (선택 영역, 값 변경, 착지 지점)

## 장면 순서 (예상 길이)

### 01 LOUNGE PAD (약 50초) — 기존 lounge_40s 장면 재사용 + 추가
| # | 화면 | 동작 |
|---|---|---|
| 1 | Scan your boarding pass (39:617) | Mobile Boarding Pass 터치 |
| 2 | Boarding Pass Scanning (39:727) | 카메라 스캔 → 인식 |
| 3 | Welcome Drink (39:750) | Alcohol 터치 → Next |
| 4 | Choose Your Drink (39:781) | Champagne 선택 → Next |
| 5 | Champagne Detail (39:818) | Dry · Lively · Aromas 등장 → Next |
| 6 | Dietary Preferences (39:420) | Nut-free · Dairy-free 선택 → Next |
| 7 | First Meal (39:483) | 메뉴 선택 → Next |
| 8 | Sleep Time (39:583) | 01:30 · 06:30 조정 → Next |
| 9 | Wake you for your meal? (39:649) | Wake me for the meal → Next |
| 10 | How should we wake you? (39:683) | Crew wake-up → Next |
| 11 | Flight Schedule (39:524) | 열 순서대로 등장 → Confirm |
| 12 | Your flight plan is ready (54:1251) | Meal · Sleep · Wake-up 정리 → Done |

### SYNC 01 (약 6초)
- Done에서 Orange Point → 곡선으로 화면 위쪽 밖으로 → **두 갈래**
- 갈래 1: 모니터 Home 전체화면, 위쪽에서 점이 들어와 일정 타임라인에 착지
- 갈래 2: 크루 Seat 12A Schedule 전체화면 (72:95943), 점이 12A 패널에 착지
- 두 화면을 짧게 이어서 보여주거나 좌우 분할 와이프로 거의 동시에 보여줌

### 02 PASSENGER MONITOR (약 90초) — 기존 monitor 장면 재사용 + 추가
| # | 화면 | 동작 |
|---|---|---|
| 13 | Welcome Aboard 12A · Lee Do Yoon (39:912) | 언어 English 선택 |
| 14 | Home / Coming up next (69:1332) | 타임라인 등장 · Flight Progress 강조 |
| 15 | Your pre-selected menu (69:1411 → 69:1456) | Meal 카드 선택 |
| 16 | Meal Detail — Main (69:2453 또는 103:1013) | 아래로 넘김 |
| 17 | Meal Detail — Dessert (69:2568) | |
| 18 | Your Plan (69:2339) | Welcome Drink 선택 |
| 19 | Welcome Drink (69:2490) → Champagne (69:2527) | 단맛 · 바디 슬라이더 |
| 20 | Entertainment (69:1614) → Her (69:1694) | 콘텐츠 선택 · 재생 |
| 21 | Sleep Reminder (54:1488) | Start as planned |
| 22 | Sleep Mode (69:1505) | 시계 흐름 → End Sleep Mode |
| 23 | Meal Reminder (54:1393) | **Change Time → 06:00 → 07:00** |
| — | **SCHEDULE SYNC** | 점이 크루 일정 변경 수신(72:99776)으로 → 12A 06:00 → 07:00 |
| 24 | Coming up next — Second Meal (54:1738) | 07:00 반영 |
| 25 | Call Crew (69:1991) | 세 메뉴 순서대로 |
| 26 | Medical Help: 증상 (69:1756) → 물품 (69:2141) → 확인 (69:2230) | Headache · Dizziness → Water · Medicine |
| 27 | Personal Care (69:1805) → Freshen Up (69:2180) → 확인 (69:1861) | Toothbrush · Toothpaste |
| 28 | Comfort & Safety (69:1915) → Approach (69:2062) → 확인 (69:2105) | Uncomfortable → Approach discreetly · Silent |

### SYNC 02 (약 6초 × 요청 수)
- Confirm Request의 오렌지 체크 → Orange Point → 화면 밖 → 크루 객실 지도 전체화면 → 12A 좌석 착지 → Task 생성
- 요청별: Comfort & Safety → 어시스트(72:92298) / Freshen Up → 세면 세트(91:2669) / Medical → 물·상비약(91:4392)

### 03 CREW PAD (약 60초)
| # | 화면 | 동작 |
|---|---|---|
| 29 | Flight Dashboard (72:80015) | 비행 정보 · 진행 · 요청 수 |
| 30 | 다음 할 일 (72:81940) | 시간순 업무 스크롤 |
| 31 | 객실 지도 (72:83903 / 72:80448) | 12A 강조 |
| 32 | 12A 요청 상세 (72:83602 · 94:1013 · 94:2879) | 확인 절차 체크 |
| 33 | 처리 상태 | Received → Preparing → Completed |
| 34 | 다른 업무 (메뉴 14K 72:82635 · 수면 10A 72:95616 · 응급 8H 72:82328) | 짧게 |
| 35 | 완료 기록 (72:99166) | 3건 완료 |

### STATUS FEEDBACK (약 5초)
- 크루 Completed 체크 → 작은 점 → 화면 밖 → 모니터 Request in progress (54:1584) → Request completed (54:1661)

### 마무리 (약 6초)
- Landing Notification (69:1542) → Confirm
- 마지막 화면 위에 "정보가 이동하고, 사람이 서비스합니다." (화면 위 오버레이, 별도 카드 아님)

**전체 예상: 약 3분 40초**
