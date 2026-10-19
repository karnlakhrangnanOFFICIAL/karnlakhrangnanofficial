# MATCH_TEMPLATE.md — มาตรฐานและโครงสร้างข้อมูลการแข่งขัน (Fixtures Specification Guide)

เอกสารนี้จัดทำขึ้นเพื่อเป็นคู่มือมาตรฐาน (Specification Schema) และแม่แบบตัวอย่าง (JSON Template) สำหรับการเพิ่มหรือปรับปรุงข้อมูลโปรแกรมการแข่งขัน (Fixtures) และผลการแข่งขัน (Results) ทั้งทีมชาย (`data/fixtures.json`, `data/results.json`) และทีมหญิง (`data/fixtures-women.json`, `data/results-women.json`) ภายในโปรเจกต์ **karnlakhrangnanofficial**

---

## 1. ข้อกำหนดของฟิลด์ข้อมูล (Field Definitions)

| ฟิลด์ (Field) | ชนิดข้อมูล (Type) | จำเป็น (Required) | คำอธิบาย (Description) |
|---|---|---|---|
| `id` | String | ใช่ | รหัสประจำแมตช์ เช่น `"m13"` (ชาย), `"w05"` (หญิง) |
| `team_type` | String | ใช่ | ประเภททีม: `"men"` หรือ `"women"` |
| `competition` | String | ใช่ | slug ของรายการแข่งขัน เช่น `"premier-league"`, `"uefa-champions-league"`, `"fa-cup"`, `"efl-cup"` |
| `competition_name` | String | ใช่ | ชื่อทางการของรายการแข่งขัน เช่น `"Premier League"`, `"UEFA Champions League"` |
| `competition_logo` | String | ใช่ | พาธไฟล์โลโก้การแข่งขัน เช่น `"databases/logo/competitions/men/premier-league.png"` |
| `round` | String | ใช่ | รอบการแข่งขัน เช่น `"Matchweek 8"`, `"Group Stage"`, `"Quarter-finals"` |
| `ha` | String | ใช่ | นัดเหย้าหรือเยือนของเชลซี: `"H"` (Home) หรือ `"A"` (Away) |
| `date` | String | ใช่ | วันที่แข่งขันในรูปแบบ ISO: `YYYY-MM-DD` เช่น `"2026-10-17"` |
| `time` | String | ใช่ | เวลาแข่งขันในประเทศไทย (24 ชม.) เช่น `"18:30"` |
| `time_th` | String | ใช่ | เวลาแข่งขันในไทยพร้อมหน่วย เช่น `"18:30 น."` |
| `time_uk` | String | ไม่บังคับ | เวลาแข่งขันที่ประเทศอังกฤษ เช่น `"12:30"` หรือ `"12:30 BST"` |
| `venue` | String | ใช่ | ชื่อสนามแข่งขัน เช่น `"Hill Dickinson Stadium"`, `"Stamford Bridge"` |
| `attendance` | Number / String | ไม่บังคับ | จำนวนผู้เข้าชมในสนาม เช่น `52271` หรือ `"52,271"` |
| `referee` | String | ไม่บังคับ | ชื่อผู้ตัดสินหลัก เช่น `"Paul Tierney"` |
| `officials` | Object | ไม่บังคับ | ทีมงานผู้ตัดสิน (`referee`, `fourth_official`, `var`, `assistant_var`) |
| `home_team` | String | ใช่ | ชื่อสโมสรเจ้าบ้าน เช่น `"Everton"`, `"Chelsea"` |
| `home_logo` | String | ใช่ | พาธไฟล์โลโก้ทีมเหย้า เช่น `"databases/logo/teams/england_everton.svg"` |
| `away_team` | String | ใช่ | ชื่อสโมสรทีมเยือน เช่น `"Chelsea"`, `"Liverpool"` |
| `away_logo` | String | ใช่ | พาธไฟล์โลโก้ทีมเยือน เช่น `"databases/logo/teams/england_chelsea.svg"` |
| `status` | String | ใช่ | สถานะแมตช์: `"upcoming"`, `"live"`, `"halftime"`, `"completed"` |
| `period` | String | ไม่บังคับ | ช่วงเวลาแข่งขัน: `"PreMatch"`, `"FirstHalf"`, `"HalfTime"`, `"SecondHalf"`, `"FullTime"` |
| `clock` | String | ไม่บังคับ | เวลานาทีแข่งขันปัจจุบัน เช่น `""`, `"45+2'"`, `"FT"` |
| `home_score` | Number / Null | ใช่ | ประตูทีมเหย้า (เป็น `null` หากยังไม่แข่ง) |
| `away_score` | Number / Null | ใช่ | ประตูทีมเยือน (เป็น `null` หากยังไม่แข่ง) |
| `home_half_score` | Number / Null | ไม่บังคับ | ประตูครึ่งแรกทีมเหย้า |
| `away_half_score` | Number / Null | ไม่บังคับ | ประตูครึ่งแรกทีมเยือน |
| `pl_match_id` | String | ไม่บังคับ | รหัสอ้างอิงของ Premier League Pulse API สำหรับดึงข้อมูลสด (เช่น `"2645227"`) |
| `efl_id` | String | ไม่บังคับ | รหัสอ้างอิง EFL Carabao Cup API สำหรับดึงข้อมูลสด (เช่น `"g2685176"`) |
| `channels` | Array | ใช่ | ช่องทางการถ่ายทอดสด `[{ "name": "...", "logo": "..." }]` |
| `goals` | Array | ไม่บังคับ | รายการประตูที่เกิดขึ้นในเกม |
| `events` | Array | ไม่บังคับ | ไทม์ไลน์เหตุการณ์ (ประตู, ใบเหลือง, เปลี่ยนตัว, VAR) |
| `lineups` | Object | ไม่บังคับ | ข้อมูล 11 ตัวจริง, ตัวสำรอง, แผนการเล่น และผู้จัดการทีม (`home` และ `away`) |
| `stats` | Array | ไม่บังคับ | สถิติ 30 รายการ แบ่งเป็น 6 หมวดหมู่ |
| `goalkeeper_stats` | Array | ไม่บังคับ | สถิติผู้รักษาประตูของทั้งสองทีม (`name`, `team`, `saves`, `save_pct`) |
| `commentary` | Array | ไม่บังคับ | สรุปประเด็นสำคัญและบทวิเคราะห์หลังเกม |
| `live_commentary` | Array | ไม่บังคับ | บันทึกรายงานสดเหตุการณ์นาทีต่อนาที |

---

## 2. มาตรฐานหมวดหมู่สถิติการแข่งขัน (30 Official Stats Categories)

ระบบ `/match-detail.html` รองรับการแสดงผลสถิติเป็น 6 หมวดหมู่หลัก โดยแต่ละรายการมีโครงสร้างดังนี้:

```json
{
  "category": "หมวดหมู่ภาษาไทย",
  "name": "ชื่อสถิติภาษาไทย (ชื่อภาษาอังกฤษ)",
  "home": "ค่าฝั่งทีมเหย้า",
  "away": "ค่าฝั่งทีมเยือน",
  "isPercentage": false
}
```

### รายการสถิติมาตรฐานทั้ง 6 หมวดหมู่:

1. **ภาพรวม (Overview)**
   - `การครองบอล (Possession)` *(isPercentage: true)*
   - `ค่าคาดหวังการทำประตู (xG)`
   - `โอกาสยิงทั้งหมด (Total Shots)`
   - `ยิงตรงกรอบ (Shots On Target)`
   - `เตะมุม (Corners)`
   - `การเซฟ (Saves)`
   - `โอกาสทำประตูเหน่งๆ (Big Chances)`

2. **เกมรุก (Attack)**
   - `ยิงหลุดกรอบ (Shots Off Target)`
   - `ยิงในกรอบเขตโทษ (Shots Inside Box)`
   - `ยิงนอกกรอบเขตโทษ (Shots Outside Box)`
   - `ยิงชนเสา/คาน (Hit Woodwork)`
   - `สร้างโอกาสทอง (Big Chances Created)`
   - `การเปิดบอลทั้งหมด (Total Crosses)`

3. **การครองบอล (Possession & Passing)**
   - `การจ่ายบอลทั้งหมด (Total Passes)`
   - `บอลยาว (Long Passes)`
   - `จ่ายบอลทะลุช่อง (Through Balls)`
   - `สัมผัสบอลทั้งหมด (Touches)`
   - `สัมผัสบอลในกรอบเขตโทษคู่แข่ง (Touches in Opponent Box)`

4. **เกมรับ (Defence)**
   - `เข้าสกัดชนะ (Tackles Won)`
   - `บล็อกลูกยิง (Blocks)`
   - `ตัดบอล (Interceptions)`
   - `เคลียร์บอล (Clearances)`

5. **สภาพร่างกาย (Duels & Physical)**
   - `การเลี้ยงบอลทั้งหมด (Total Dribbles)`
   - `เลี้ยงบอลสำเร็จ (Successful Dribbles)`
   - `ดวลแย่งบอลชนะ (Duels Won)`
   - `ชนะดวลลูกกลางอากาศ (Aerial Duels)`

6. **วินัย (Discipline)**
   - `ใบแดง (Red Cards)`
   - `ใบเหลือง (Yellow Cards)`
   - `ทำฟาวล์ (Fouls)`
   - `ล้ำหน้า (Offsides)`

---

## 3. แม่แบบตัวอย่าง JSON ที่พร้อมใช้งาน (Complete JSON Templates)

### 3.1 ตัวอย่างโปรแกรมการแข่งขันก่อนแข่ง (Upcoming Fixture Template)

```json
{
  "id": "m14",
  "team_type": "men",
  "competition": "premier-league",
  "competition_name": "Premier League",
  "competition_logo": "databases/logo/competitions/men/premier-league.png",
  "round": "Matchweek 9",
  "ha": "H",
  "date": "2026-10-24",
  "time": "21:00",
  "time_th": "21:00 น.",
  "time_uk": "15:00 BST",
  "venue": "Stamford Bridge",
  "referee": "Michael Oliver",
  "home_team": "Chelsea",
  "home_logo": "databases/logo/teams/england_chelsea.svg",
  "away_team": "Newcastle United",
  "away_logo": "databases/logo/teams/england_newcastle.svg",
  "status": "upcoming",
  "period": "PreMatch",
  "clock": "",
  "home_score": null,
  "away_score": null,
  "home_half_score": null,
  "away_half_score": null,
  "pl_match_id": "2645228",
  "channels": [
    {
      "name": "MONOMAX SPORTS TV",
      "logo": "databases/logo/tv/monomax.svg"
    },
    {
      "name": "True Premier Football 1",
      "logo": "databases/logo/tv/true-sports.svg"
    }
  ],
  "goals": [],
  "events": [],
  "stats": null
}
```

---

### 3.2 ตัวอย่างการแข่งขันที่เสร็จสิ้นสมบูรณ์ (Completed Match Template with Full Data)

```json
{
  "id": "m13",
  "team_type": "men",
  "competition": "premier-league",
  "competition_name": "Premier League",
  "competition_logo": "databases/logo/competitions/men/premier-league.png",
  "round": "Matchweek 8",
  "ha": "A",
  "date": "2026-10-17",
  "time": "18:30",
  "time_th": "18:30 น.",
  "time_uk": "12:30 BST",
  "venue": "Hill Dickinson Stadium",
  "attendance": 52271,
  "referee": "Paul Tierney",
  "officials": {
    "referee": "Paul Tierney",
    "fourth_official": "Michael Salisbury",
    "var": "Nicholas Hopton",
    "assistant_var": "Lee Betts"
  },
  "home_team": "Everton",
  "home_logo": "databases/logo/teams/england_everton.svg",
  "away_team": "Chelsea",
  "away_logo": "databases/logo/teams/england_chelsea.svg",
  "status": "completed",
  "period": "FullTime",
  "clock": "FT",
  "home_score": 0,
  "away_score": 2,
  "home_half_score": 0,
  "away_half_score": 0,
  "pl_match_id": "2645227",
  "channels": [
    {
      "name": "MONOMAX SPORTS TV",
      "logo": "databases/logo/tv/monomax.svg"
    }
  ],
  "goals": [
    {
      "team": "away",
      "player": "Pedro Neto",
      "number": 7,
      "minute": 46,
      "assist": "Jorrel Hato",
      "type": "goal",
      "detail": "ยิงด้วยเท้าซ้ายเสียบมุมเสาไกลหลังเริ่มครึ่งหลัง 44 วินาที"
    },
    {
      "team": "away",
      "player": "Pedro Neto",
      "number": 7,
      "minute": 90,
      "assist": "Cole Palmer",
      "type": "goal",
      "detail": "ซ้ำจังหวะฟรีคิกของ Cole Palmer เข้าไปอย่างเด็ดขาด"
    }
  ],
  "events": [
    {
      "type": "shot",
      "team": "away",
      "player": "Cole Palmer",
      "minute": 15,
      "detail": "Cole Palmer ยิงไกลด้วยเท้าซ้าย Pickford พุ่งเซฟไว้ได้"
    },
    {
      "type": "goal",
      "team": "away",
      "player": "Pedro Neto",
      "number": 7,
      "minute": 46,
      "assist": "Jorrel Hato",
      "detail": "ประตูขึ้นนำ 1-0 จาก Pedro Neto"
    },
    {
      "type": "card_yellow",
      "team": "away",
      "player": "Moisés Caicedo",
      "minute": 52,
      "detail": "โดนใบเหลืองจากการตัดฟาวล์กลางสนาม"
    },
    {
      "type": "sub",
      "team": "away",
      "player": "Mike Penders",
      "subIn": "Mike Penders",
      "subOut": "Emiliano Martínez",
      "minute": 75,
      "detail": "เปลี่ยนตัวผู้รักษาประตูเนื่องจาก Emiliano Martínez บาดเจ็บ"
    },
    {
      "type": "goal",
      "team": "away",
      "player": "Pedro Neto",
      "number": 7,
      "minute": 90,
      "assist": "Cole Palmer",
      "detail": "ประตูปิดกล่อง 2-0 จาก Pedro Neto"
    }
  ],
  "lineups": {
    "home": {
      "manager": "David Moyes",
      "formation": "4-2-3-1",
      "starting": [
        { "number": 1, "name": "Jordan Pickford", "position": "GK" },
        { "number": 2, "name": "Ainsley Maitland-Niles", "position": "RB" },
        { "number": 6, "name": "James Tarkowski", "position": "CB", "captain": true },
        { "number": 4, "name": "Jarrad Branthwaite", "position": "CB" },
        { "number": 16, "name": "Vitalii Mykolenko", "position": "LB" },
        { "number": 37, "name": "James Garner", "position": "DM" },
        { "number": 45, "name": "Harrison Armstrong", "position": "DM" },
        { "number": 34, "name": "Merlin Röhl", "position": "RW" },
        { "number": 8, "name": "Kiernan Dewsbury-Hall", "position": "AM" },
        { "number": 10, "name": "Jack Grealish", "position": "LW" },
        { "number": 11, "name": "Thierno Barry", "position": "ST" }
      ],
      "substitutes": [
        { "number": 12, "name": "Mark Travers", "position": "GK" },
        { "number": 15, "name": "Jake O'Brien", "position": "DF" },
        { "number": 19, "name": "Tyrique George", "position": "FW" },
        { "number": 20, "name": "Tyler Dibling", "position": "FW" },
        { "number": 22, "name": "Brennan Johnson", "position": "FW" },
        { "number": 23, "name": "Christian Nørgaard", "position": "MF" },
        { "number": 24, "name": "Carlos Alcaraz", "position": "MF" },
        { "number": 30, "name": "Hayden Hackney", "position": "MF" },
        { "number": 58, "name": "Billy Graham", "position": "FW" }
      ]
    },
    "away": {
      "manager": "Xabi Alonso",
      "formation": "4-2-3-1",
      "starting": [
        { "number": 1, "name": "Emiliano Martínez", "position": "GK" },
        { "number": 24, "name": "Reece James", "position": "RB", "captain": true },
        { "number": 29, "name": "Wesley Fofana", "position": "CB" },
        { "number": 6, "name": "Levi Colwill", "position": "CB" },
        { "number": 21, "name": "Jorrel Hato", "position": "LB" },
        { "number": 25, "name": "Moisés Caicedo", "position": "DM" },
        { "number": 14, "name": "Jordan Henderson", "position": "DM" },
        { "number": 7, "name": "Pedro Neto", "position": "RW" },
        { "number": 10, "name": "Cole Palmer", "position": "AM" },
        { "number": 40, "name": "Facundo Buonanotte", "position": "LW" },
        { "number": 20, "name": "João Pedro", "position": "ST" }
      ],
      "substitutes": [
        { "number": 33, "name": "Mike Penders", "position": "GK" },
        { "number": 4, "name": "Tosin Adarabioyo", "position": "DF" },
        { "number": 5, "name": "Benoît Badiashile", "position": "DF" },
        { "number": 34, "name": "Josh Acheampong", "position": "DF" },
        { "number": 17, "name": "Carney Chukwuemeka", "position": "MF" },
        { "number": 22, "name": "Kiernan Dewsbury-Hall", "position": "MF" },
        { "number": 11, "name": "Noni Madueke", "position": "FW" },
        { "number": 18, "name": "Christopher Nkunku", "position": "FW" },
        { "number": 38, "name": "Marc Guiu", "position": "ST" }
      ]
    }
  },
  "stats": [
    {
      "category": "ภาพรวม",
      "name": "การครองบอล (Possession)",
      "home": "47.20%",
      "away": "52.80%",
      "isPercentage": true
    },
    {
      "category": "ภาพรวม",
      "name": "ค่าคาดหวังการทำประตู (xG)",
      "home": 0.43,
      "away": 1.47,
      "isPercentage": false
    },
    {
      "category": "ภาพรวม",
      "name": "โอกาสยิงทั้งหมด (Total Shots)",
      "home": 6,
      "away": 18,
      "isPercentage": false
    },
    {
      "category": "ภาพรวม",
      "name": "ยิงตรงกรอบ (Shots On Target)",
      "home": 5,
      "away": 7,
      "isPercentage": false
    },
    {
      "category": "ภาพรวม",
      "name": "เตะมุม (Corners)",
      "home": 5,
      "away": 7,
      "isPercentage": false
    },
    {
      "category": "ภาพรวม",
      "name": "การเซฟ (Saves)",
      "home": 4,
      "away": 5,
      "isPercentage": false
    },
    {
      "category": "ภาพรวม",
      "name": "โอกาสทำประตูเหน่งๆ (Big Chances)",
      "home": 0,
      "away": 1,
      "isPercentage": false
    },
    {
      "category": "เกมรุก",
      "name": "ยิงหลุดกรอบ (Shots Off Target)",
      "home": 1,
      "away": 6,
      "isPercentage": false
    },
    {
      "category": "เกมรุก",
      "name": "ยิงในกรอบเขตโทษ (Shots Inside Box)",
      "home": 5,
      "away": 3,
      "isPercentage": false
    },
    {
      "category": "เกมรุก",
      "name": "ยิงนอกกรอบเขตโทษ (Shots Outside Box)",
      "home": 0,
      "away": 8,
      "isPercentage": false
    },
    {
      "category": "เกมรุก",
      "name": "ยิงชนเสา/คาน (Hit Woodwork)",
      "home": 0,
      "away": 1,
      "isPercentage": false
    },
    {
      "category": "เกมรุก",
      "name": "สร้างโอกาสทอง (Big Chances Created)",
      "home": 2,
      "away": 2,
      "isPercentage": false
    },
    {
      "category": "เกมรุก",
      "name": "การเปิดบอลทั้งหมด (Total Crosses)",
      "home": "20 (15%)",
      "away": "14 (21%)",
      "isPercentage": false
    },
    {
      "category": "การครองบอล",
      "name": "การจ่ายบอลทั้งหมด (Total Passes)",
      "home": "408 (81%)",
      "away": "463 (84%)",
      "isPercentage": false
    },
    {
      "category": "การครองบอล",
      "name": "บอลยาว (Long Passes)",
      "home": "55 (44%)",
      "away": "57 (40%)",
      "isPercentage": false
    },
    {
      "category": "การครองบอล",
      "name": "จ่ายบอลทะลุช่อง (Through Balls)",
      "home": "0 (0%)",
      "away": "1 (0%)",
      "isPercentage": false
    },
    {
      "category": "การครองบอล",
      "name": "สัมผัสบอลทั้งหมด (Touches)",
      "home": 585,
      "away": 651,
      "isPercentage": false
    },
    {
      "category": "การครองบอล",
      "name": "สัมผัสบอลในกรอบเขตโทษคู่แข่ง (Touches in Opponent Box)",
      "home": 17,
      "away": 21,
      "isPercentage": false
    },
    {
      "category": "เกมรับ",
      "name": "เข้าสกัดชนะ (Tackles Won)",
      "home": "4 (57%)",
      "away": "8 (57%)",
      "isPercentage": false
    },
    {
      "category": "เกมรับ",
      "name": "บล็อกลูกยิง (Blocks)",
      "home": 7,
      "away": 7,
      "isPercentage": false
    },
    {
      "category": "เกมรับ",
      "name": "ตัดบอล (Interceptions)",
      "home": 7,
      "away": 4,
      "isPercentage": false
    },
    {
      "category": "เกมรับ",
      "name": "เคลียร์บอล (Clearances)",
      "home": 23,
      "away": 29,
      "isPercentage": false
    },
    {
      "category": "สภาพร่างกาย",
      "name": "การเลี้ยงบอลทั้งหมด (Total Dribbles)",
      "home": 12,
      "away": 12,
      "isPercentage": false
    },
    {
      "category": "สภาพร่างกาย",
      "name": "เลี้ยงบอลสำเร็จ (Successful Dribbles)",
      "home": 5,
      "away": 9,
      "isPercentage": false
    },
    {
      "category": "สภาพร่างกาย",
      "name": "ดวลแย่งบอลชนะ (Duels Won)",
      "home": 39,
      "away": 51,
      "isPercentage": false
    },
    {
      "category": "สภาพร่างกาย",
      "name": "ชนะดวลลูกกลางอากาศ (Aerial Duels)",
      "home": 14,
      "away": 21,
      "isPercentage": false
    },
    {
      "category": "วินัย",
      "name": "ใบแดง (Red Cards)",
      "home": 0,
      "away": 0,
      "isPercentage": false
    },
    {
      "category": "วินัย",
      "name": "ใบเหลือง (Yellow Cards)",
      "home": 3,
      "away": 4,
      "isPercentage": false
    },
    {
      "category": "วินัย",
      "name": "ทำฟาวล์ (Fouls)",
      "home": 8,
      "away": 15,
      "isPercentage": false
    },
    {
      "category": "วินัย",
      "name": "ล้ำหน้า (Offsides)",
      "home": 4,
      "away": 1,
      "isPercentage": false
    }
  ],
  "goalkeeper_stats": [
    {
      "name": "Jordan Pickford",
      "team": "Everton",
      "saves": 4,
      "save_pct": "67%"
    },
    {
      "name": "Emiliano Martínez",
      "team": "Chelsea",
      "saves": 3,
      "save_pct": "100%"
    },
    {
      "name": "Mike Penders",
      "team": "Chelsea",
      "saves": 2,
      "save_pct": "100%"
    }
  ],
  "commentary": [
    {
      "section": "📌 ประเด็นสำคัญจากการแข่งขัน (Key Takeaways)",
      "events": [
        {
          "text": "<strong>Pedro Neto คือผู้สร้างความแตกต่าง:</strong> เหมาคนเดียว 2 ประตูในนาทีที่ 46 และนาทีที่ 90 พาทีมเก็บ 3 แต้มสำคัญ"
        },
        {
          "text": "<strong>แนวรับและผู้รักษาประตูช่วยคลีนชีต:</strong> Emiliano Martínez โชว์ 3 ซูเปอร์เซฟครึ่งแรก ก่อนได้รับบาดเจ็บรุนแรง และ Mike Penders ลงมาทำ 2 เซฟช่วยปิดเกม"
        }
      ]
    }
  ]
}
```

---

## 4. แนวปฏิบัติและข้อควรระวัง (Best Practices)

1. **โครงสร้างไฟล์พาธ:**
   - ใช้ Relative Path สำหรับไฟล์รูปภาพเสมอ ไม่ใช้ Absolute Path (ห้ามใช้ `/databases/...` ให้ใช้ `databases/...`)
   - พาธโลโก้ทีม: `databases/logo/teams/{country}_{team_name}.svg` หรือ `.png`
   - พาธโลโก้การแข่งขัน: `databases/logo/competitions/{men|women}/{competition-slug}.png`
   - พาธโลโก้ช่องทีวี: `databases/logo/tv/{channel-slug}.svg`

2. **การระบุค่าสถิติ (Stats Format):**
   - การครองบอล (Possession) ควรกำหนด `isPercentage: true` เพื่อให้แถบเปอร์เซ็นต์คำนวณตามสัดส่วน 100%
   - สถิติที่มีวงเล็บ เช่น `"408 (81%)"` ระบบจะใช้ตัวเลขแรกในการคำนวณความยาวแถบกราฟ และแสดงผลข้อความเต็มในตัวเลขกำกับ
   - สถิติด้านลบและวินัย (ใบเหลือง, ใบแดง, ทำฟาวล์, ล้ำหน้า) ระบบจะไม่ไฮไลต์ตัวเลขที่สูงกว่าเป็นสีทอง เพื่อความถูกต้องตามหลักกีฬา

3. **ความสอดคล้องกับ API Fallback:**
   - เมื่อเพิ่ม fixture ใหม่ ควรกำหนด `id` ให้ไม่ซ้ำกับแมตช์อื่นในไฟล์
   - สำหรับการแข่งขัน Premier League ควรกำหนด `pl_match_id` เพื่อรองรับการดึงข้อมูลสดผ่าน `/api/pl-match`
