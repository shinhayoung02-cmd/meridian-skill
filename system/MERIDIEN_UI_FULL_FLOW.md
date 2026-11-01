# MERIDIEN UI FULL FLOW

> 기준: Figma `영상 자료 요소` › 전체 수정 › **A안 (49:7165)** — 2026-10-29 확인
> 주인공: **12A · 이도윤 (Lee Do Yoon)** · KE901 · 인천 ICN 23:30 → 파리 CDG 09:00 · 프레스티지
> 괄호 안 숫자 = Figma 노드 ID

---

## 0. 검증 결과 요약

### 트리에서 고친 곳
| 원래 트리 | 실제 화면 | 고친 내용 |
|---|---|---|
| Wake **me up** for your meal? | "Wake **you** for your meal?" (39:649) | 화면 문구로 수정 |
| Home 하위에 Meal / Sleep / Wake / Allergy | Home(69:1332)에는 Coming up next + 일정 타임라인 + 진행 게이지 + 하단 탭 | Meal/Sleep/Wake/Allergy는 Pre-selected Menu 쪽으로 정리 |
| Approach Method › Other / Direct response | 선택지 2개 + 응답 방식 **Silent / Direct** 토글 (69:2062) | 실제 구조로 수정 |
| Meal Detail › Additional Meal Information | 실제는 **Beef Bulgogi 메뉴 화면** (103:1013) | 화면 이름으로 수정 |

### 트리에 없던 화면 (추가함)
| 화면 | ID | 위치 |
|---|---|---|
| Welcome Aboard 언어 선택 (English · 한국어 · 日本語 · 中文 · Русский) | 39:912 | Monitor › Welcome Aboard |
| 첫 식사 5분 전 알림 "Your first meal begins in 5 minutes." | 69:2376 | Monitor › Meal Reminder |
| Call Crew 메인 메뉴 (Medical Help · Personal Care · Comfort & Safety · **Other Request**) | 69:1991 | Monitor › CALL CREW |
| Crew 다음 할 일 (시간순 태스크 큐) | 72:81940 | Crew › Task Queue |
| Crew **일정 변경 수신** (12A Second Meal 06:00 → 07:00) + 알림 카드 | 72:99776 · 72:97654 | Crew › Schedule Update — **Adjust → Crew 연결(SYNC)** |
| Crew 완료 기록 탭 | 72:99166 · 72:97687 | Crew › Completed Log |

### 트리에는 있지만 화면이 없는 것
- **Personal Care › Sleep Ready / Skin Care 상세**: 카드만 있고 상세 선택 화면은 없음 (Freshen Up만 상세 있음)
- **Request Status (in progress / completed)**: Freshen Up 세트 기준 화면만 있음 (Comfort & Safety · Medical Help 용 상태 화면은 없음)
- **Crew 건강 이상 요청(12A · 증상)** 화면(72:99475): 현재 A안에서 지워져 있음 → 물·상비약 요청(91:4392 · 94:2879)만 남아 있음

### 값이 서로 안 맞는 곳 (영상 전에 정리 필요)
| 항목 | 화면 A | 화면 B |
|---|---|---|
| First Meal 메뉴 | 라운지 First Meal · Plan Ready · Your Plan = **Beef Bulgogi** | 모니터 Pre-selected Menu · Meal Detail · 5분 전 알림 = **Grilled Salmon** |
| 수면 · 깨우기 시간 | 라운지 Sleep 01:30 – 06:30, Second meal 06:00 | 모니터 Pre-selected Menu **AM 09:40 / PM 22:50**, Home 타임라인 01:30 · 05:30 · 09:30 · 17:30 (69:1332) |
| 좌석 등급 | 라운지 FIRST SUITE | 크루 프레스티지 · 탑승권 사진 Business |
| Medical Help 문구 | 모니터 Medical Help | 크루 응급(8H 박남진) 화면은 다른 승객 |

---

## 1. 전체 흐름

```
MERIDIEN UI FULL FLOW
│
├─ 01. LOUNGE PAD — PLAN
│
│  ├─ Boarding Pass
│  │  ├─ Scan your boarding pass (39:617)
│  │  │  ├─ Mobile Boarding Pass
│  │  │  └─ Paper Boarding Pass
│  │  └─ Boarding Pass Scanning — 탑승권 ICN→CDG · KE901 · 12A (39:727)
│  │
│  ├─ Welcome Drink (39:750)
│  │  ├─ Alcohol
│  │  ├─ Juice
│  │  ├─ Water
│  │  └─ No drink
│  │
│  ├─ Choose Your Drink (39:781)
│  │  ├─ Champagne — Moët & Chandon Grand Vintage 2013
│  │  │  └─ Champagne Detail — Dry · Lively · Aromas (39:818)
│  │  ├─ White Wine — Down to Earth Sauvignon Blanc 2017
│  │  └─ Red Wine — Château Trimoulet 2012
│  │
│  ├─ Dietary Preferences (39:420)
│  │  ├─ No dietary restrictions (Standard meal)
│  │  └─ Dietary / Allergy Options
│  │     └─ No Shellfish · Nut-free · Dairy-free · Gluten-free · No Pork ·
│  │        Low-sodium · Diabetic · Vegetarian · Religious · Other
│  │
│  ├─ First Meal (39:483)
│  │  ├─ Beef Bulgogi  ← 선택
│  │  ├─ Grilled Salmon
│  │  └─ Cream Pasta (Contains dairy · 비활성)
│  │
│  ├─ Sleep Time (39:583)
│  │  ├─ Start 01:30
│  │  ├─ End 06:30
│  │  └─ 5h of rest
│  │
│  ├─ Wake you for your meal? (39:649) — Second meal · 06:00
│  │  ├─ Wake me for the meal
│  │  └─ Skip this meal
│  │
│  ├─ How should we wake you? (39:683)
│  │  ├─ Crew wake-up
│  │  ├─ Gentle lighting
│  │  ├─ Screen alert
│  │  └─ No wake-up
│  │
│  ├─ Flight Schedule (39:524) — ICN → CDG · KE901 · 14h 30m
│  │  ├─ 23:30 Departure
│  │  ├─ 00:50 Welcome Drink
│  │  ├─ 01:30 Sleep Starts
│  │  ├─ 06:00 First Meal
│  │  ├─ 06:30 Sleep Ends
│  │  ├─ 09:00 Arrival
│  │  └─ Confirm
│  │
│  └─ Your flight plan is ready (54:1251)
│      ├─ Meal — Beef Bulgogi · First Meal 00:50
│      ├─ Sleep — 01:30 – 06:30 · 5h of rest
│      ├─ Wake-up — Crew wake-up · Second Meal 06:00
│      ├─ Synced to your in-flight journey (Seat Monitor ✓ · Crew Pad ✓)
│      └─ Done
│
│
├────────────── SYNC 01 ──────────────
│
│   Lounge Pad Confirm / Done
│             │
│             ●  Orange Data Point
│            ╱ ╲
│           ╱   ╲
│          ▼     ▼
│   Passenger     Crew Pad
│   Monitor       Seat 12A Schedule (72:95943)
│   Home · Pre-selected Menu
│
│   ※ Meal / Sleep / Wake-up 정보가 두 디바이스에 동시에 전달
│
│
├─ 02. PASSENGER MONITOR — CHECK · ADJUST · REQUEST
│
│  ├─ Welcome Aboard (39:912)
│  │  ├─ Seat 12A / Welcome aboard, Lee Do Yoon
│  │  └─ Language — English · 한국어 · 日本語 · 中文 · Русский
│  │
│  ├─ Home / Coming Up Next (69:1332)
│  │  ├─ Coming up next — First Meal
│  │  ├─ Journey Timeline — Departure · First Meal · Rest · Second Meal · Alarm · Arrival
│  │  ├─ Flight Progress — ICN ✈ CDG (상단 게이지)
│  │  └─ Tabs — My Journey · Entertainment · Dining · Call Crew
│  │
│  ├─ Your Pre-selected Menu (69:1411)
│  │  ├─ Meal — Grilled Salmon
│  │  ├─ Sleep
│  │  ├─ Wake-up
│  │  ├─ Allergie — Nut · Dairy
│  │  └─ 선택 상태 (Meal 카드 선택) (69:1456)
│  │
│  ├─ Sleep Mode (69:1505)
│  │  ├─ Current Time
│  │  ├─ Change wake-up
│  │  └─ End Sleep Mode
│  │
│  ├─ Landing Notification (69:1542)
│  │  ├─ Landing in 15 minutes · A crew member will visit you shortly
│  │  ├─ Change Time
│  │  └─ Confirm
│  │
│  ├─ Entertainment
│  │  ├─ Entertainment Main — MOVIES · GAMES · DRAMA · MUSIC · VIDEO (69:1614)
│  │  └─ Content Detail / Playback — Her (69:1694)
│  │
│  ├─ My Journey / Your Plan (69:2339)
│  │  ├─ Welcome Drink
│  │  ├─ First Meal (불고기 사진)
│  │  ├─ Snack & Beverage
│  │  └─ Second Meal (연어 사진)
│  │
│  ├─ Meal Detail
│  │  ├─ First Meal — Grilled Salmon · Fish · Warm (69:2453)
│  │  ├─ First Meal — Beef Bulgogi · Soy · Sesame · Warm (103:1013)
│  │  └─ Dessert — Vanilla Ice Cream · Milk · Frozen (69:2568)
│  │
│  ├─ Welcome Drink Detail
│  │  ├─ Wine · Juice · Water (69:2490)
│  │  └─ Champagne Palmer & Co Grands Terroirs 2015 (69:2527)
│  │
│  ├─ Meal Reminder
│  │  ├─ Your first meal begins in 5 minutes. — Grilled Salmon (69:2376)
│  │  │  ├─ Change Time
│  │  │  └─ Confirm
│  │  └─ Your meal is coming up in 15 min. — Second Meal · 06:00 (54:1393)
│  │      ├─ Change Time   ← ADJUST
│  │      └─ Keep Schedule
│  │
│  ├─ Sleep Reminder (54:1488)
│  │  └─ Your sleep time is approaching — Sleep 01:30 – 06:30
│  │      ├─ Adjust
│  │      └─ Start as planned
│  │
│  ├─ CALL CREW (69:1991)
│  │  │  Medical Help · Personal Care · Comfort & Safety · Other Request
│  │  │
│  │  ├─ Medical Help
│  │  │  ├─ Symptom Selection (69:1756)
│  │  │  │  ├─ Headache
│  │  │  │  ├─ Dizziness
│  │  │  │  ├─ Breathing discomfort
│  │  │  │  ├─ Nausea
│  │  │  │  ├─ Stomach pain
│  │  │  │  └─ Other
│  │  │  ├─ Assistance Item (69:2141)
│  │  │  │  ├─ Water
│  │  │  │  ├─ Medicine
│  │  │  │  └─ Towel
│  │  │  └─ Confirm Request — Water + Medicine (69:2230)
│  │  │
│  │  ├─ Personal Care (69:1805)
│  │  │  ├─ Freshen Up
│  │  │  ├─ Sleep Ready   (상세 화면 없음)
│  │  │  ├─ Skin Care     (상세 화면 없음)
│  │  │  ├─ Freshen Up Detail (69:2180)
│  │  │  │  ├─ Toothbrush
│  │  │  │  ├─ Toothpaste
│  │  │  │  └─ Facial Towel
│  │  │  └─ Confirm Request (69:1861)
│  │  │
│  │  ├─ Comfort & Safety (69:1915)
│  │  │  ├─ Noise
│  │  │  ├─ Disturbance
│  │  │  ├─ Uncomfortable
│  │  │  ├─ Safety concern
│  │  │  └─ Other
│  │  │      ↓
│  │  │  Approach Method (69:2062) — Selected : Uncomfortable Situation
│  │  │  ├─ Approach discreetly (조용히 와주세요)
│  │  │  ├─ Do not approach my seat (좌석으로 오지 말아주세요)
│  │  │  └─ Response — Silent / Direct
│  │  │      ↓
│  │  │  Confirm Request — Uncomfortable Situation · Silent (69:2105)
│  │  │
│  │  └─ Other Request
│  │
│  ├─ Request Status (Freshen Up 세트 기준)
│  │  ├─ Request in progress — Request sent → In progress → Completed (54:1584)
│  │  └─ Request completed — Your set has been delivered to 12A (54:1661)
│  │
│  └─ Journey Continues
│      ├─ Coming up next — Second Meal · 06:00 · Adjust (54:1738)
│      └─ Meal Detail
│
│
├────────── SCHEDULE SYNC (ADJUST) ──────────
│
│   Passenger Monitor Change Time
│   Second Meal 06:00 → 07:00
│          │
│          ●
│          ▼
│   Crew Pad · 12A 일정 변경 수신 (72:99776 · 72:97654)
│
│
├────────────── SYNC 02 ──────────────
│
│   Passenger Monitor
│   Confirm Request
│          │
│          ● Orange Data Point
│           ╲
│            ╲  Curved Flight Path
│             ╲
│              ▼
│        Crew Pad / Seat 12A
│
│        Seat Highlight
│              ↓
│        Request Task 생성
│
│   요청별 연결
│   ├─ Comfort & Safety → 어시스트 12A (지도 72:92298 · 상세 72:83602)
│   ├─ Personal Care Freshen Up → 세면 세트 12A (지도 91:2669 · 상세 94:1013)
│   └─ Medical Help Water + Medicine → 물·상비약 12A (지도 91:4392 · 상세 94:2879)
│
│
├─ 03. CREW PAD — PREPARE · SERVE
│
│  ├─ Flight Dashboard (72:80015)
│  │  ├─ Flight Information — KE 901 · 인천 ICN 23:30 → 파리 CDG 09:00 · HL7643
│  │  ├─ Flight Progress — 비행 경로 · 탑승 341/368명
│  │  ├─ Current Operation Status — 객실 구역 현황 · 현재 업무 진행
│  │  ├─ Upcoming Tasks — 미완료 업무 · 다음 서비스 00:50 첫 번째 식사
│  │  └─ Requests — 승객 요청 · 주의 승객 (14K 알레르기 · UM · 정하린)
│  │
│  ├─ Task Queue / 다음 할 일 (72:81940)
│  │  └─ 지금 · 다음 15분 · 다음 30분 시간순 업무
│  │
│  ├─ Cabin Overview
│  │  └─ Cabin Map — 메인 덱 프레스티지 존 Row 12 – 21
│  │      ├─ 좌석 업무 목록 (72:80448)
│  │      ├─ 다음 할 일 목록 · 12A 업무 강조 (72:83903)
│  │      └─ 요청 좌석 Highlight
│  │
│  ├─ Seat Selection
│  │  └─ Seat 12A
│  │
│  ├─ Passenger / Seat Detail — 좌석 12A (72:95943)
│  │  ├─ Meal Schedule — 식사 서비스
│  │  ├─ Sleep Schedule — 수면 예정 01:30
│  │  ├─ Wake-up Preference — 깨우기 알람
│  │  └─ Current Requests
│  │
│  ├─ Schedule Update — 12A 일정 변경 수신 (72:99776)
│  │  └─ 두 번째 식사 06:00 → 07:00 · 깨우기 06:50 · 변경 확인
│  │
│  ├─ Meal Management
│  │  ├─ 14K 메뉴 확인 지도 (72:88892)
│  │  ├─ 14K 정하린 · 메뉴 · 갑각류 알레르기 (72:82635)
│  │  └─ 10J 이원지 · 식사 상세 (72:83282 · 72:82962)
│  │
│  ├─ Passenger Condition / Medical
│  │  ├─ 비상 대응 동선 지도 · 8H (72:90566)
│  │  ├─ 8H 박남진 · 환자 상세 · 응급 SOP (72:82328)
│  │  ├─ 응급 처치 단계 상세 오버레이 (72:92255)
│  │  └─ 계속 운항 확인 오버레이 (72:92285)
│  │
│  ├─ Seat / Rest Management
│  │  ├─ 수면 요청 지도 (72:85373)
│  │  └─ 10A 김민지 · 좌석 각도(휴식 135° · 수면 180°) · 조명 · 침구 (72:95616)
│  │
│  ├─ Request Management — 12A
│  │  ├─ Assist / Comfort Request — 어시스트 (지도 72:92298 · 상세 72:83602)
│  │  ├─ Care Request — 수면 준비 (지도 72:93950 · 상세 72:87049)
│  │  ├─ Care Request — 세면 세트 (지도 91:2669 · 상세 94:1013)
│  │  └─ Medical Request — 물 · 상비약 (지도 91:4392 · 상세 94:2879)
│  │
│  ├─ Task Detail
│  │  └─ Seat 12A Request — 필요 조치 · 요청 유형 · 승객 선호 · 확인 절차
│  │
│  ├─ Task Status
│  │  ├─ Received (접수)
│  │  ├─ Preparing (준비 중)
│  │  └─ Completed (완료)
│  │
│  └─ Completed Log / Updated Cabin
│      ├─ 완료 기록 · 오늘 3건 처리 완료 (72:99166)
│      └─ 객실 배치 완료 상태 (72:97687)
│
│
├──────────── STATUS FEEDBACK ────────────
│
│        Crew Pad
│        Completed
│            │
│            ●
│           ╱
│          ╱ Curved Flight Path
│         ▼
│
│   Passenger Monitor
│
│   Request in progress (54:1584)
│          ↓
│   Request completed (54:1661)
│
│
└─ FINAL SYSTEM VIEW
   │
   ├─ LOUNGE PAD — PLAN
   ├─ PASSENGER MONITOR — CHECK · ADJUST · REQUEST
   ├─ CREW PAD — PREPARE · SERVE
   └─ HUMAN CARE

   "정보가 이동하고, 사람이 서비스합니다."
```

---

## 2. 승객 · 좌석

| 좌석 | 승객 | 등장 |
|---|---|---|
| **12A** | **이도윤 (Lee Do Yoon)** — 주인공 | 라운지 탑승권, 모니터 전체, 크루 요청 화면 |
| 10A | 김민지 | 크루 수면 · 좌석 관리 |
| 14K | 정하린 (갑각류 알레르기 · UM) | 크루 메뉴 확인 |
| 10J | 이원지 | 크루 식사 |
| 8H | 박남진 | 크루 응급 |

## 3. 영상 시퀀스에 넣는 순서 (제안)

1. LOUNGE PAD — Boarding Pass → Welcome Drink → Choose Your Drink → Champagne Detail → Dietary → First Meal → Sleep Time → Wake for meal → Wake method → Flight Schedule → Plan Ready
2. SYNC 01 — Monitor Home / Pre-selected Menu + Crew Seat 12A Schedule
3. PASSENGER MONITOR — Welcome Aboard → Home → Pre-selected Menu → Your Plan → Meal / Drink Detail → Entertainment → Sleep Reminder → Sleep Mode → Meal Reminder → **Adjust**
4. SCHEDULE SYNC — Crew 12A 일정 변경 수신
5. CALL CREW — Medical Help · Personal Care · Comfort & Safety (대표: Comfort & Safety → Approach → Confirm)
6. SYNC 02 — Crew Seat 12A Task
7. CREW PAD — Dashboard → Task Queue → Cabin Map → Seat 12A → Request Task → Received → Preparing → Completed → Completed Log
8. STATUS FEEDBACK — Request in progress → Request completed
9. Journey Continues — Coming up next · Landing Notification
10. FINAL SYSTEM VIEW
