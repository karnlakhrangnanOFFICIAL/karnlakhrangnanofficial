# 📋 เทมเพลตสำหรับกรอกข้อมูล Full-Time ใน 1 แมตช์ (Full-Time Match Data Template)

เอกสารนี้รวบรวมโครงสร้างข้อมูล JSON ที่สมบูรณ์สำหรับนำไปกรอกลงใน `data/fixtures.json` (หรือ `data/fixtures-women.json`) เมื่อจบการแข่งขัน (Full-Time) เพื่อให้หน้าเว็บ `/match-detail.html?id=w6&team=women` แสดงผลครบถ้วนทุกแท็บ ทั้ง **⏱️ Timeline**, **📊 Stats**, **📋 Lineups**, **💬 Commentary** และ **🎥 Video**

---

## 🧩 องค์ประกอบข้อมูลที่ระบบต้องการใน 1 แมตช์

1. **🏁 สรุปผลการแข่งขัน (Match Result & Meta)**: สกอร์จบเกม (`home_score`, `away_score`), สกอร์ครึ่งแรก (`home_half_score`, `away_half_score`), สถานะ `"completed"`, ผู้ตัดสิน (`referee`), ยอดผู้เข้าชม (`attendance`)
2. **⏱️ Timeline (ลำดับเหตุการณ์สำคัญ)**: ประตู (`goal`), แอสซิสต์, ใบเหลือง/แดง (`yellow_card`, `red_card`), การเปลี่ยนตัว (`substitution`), และ `var`
3. **📊 Stats (สถิติตลอดทั้งเกม & ผู้รักษาประตู)**: เปอร์เซ็นต์ครองบอล, โอกาสยิง, ยิงตรงกรอบ, ความแม่นยำส่งบอล, เตะมุม, ฟาวล์, ล้ำหน้า และเซฟของผู้รักษาประตู (`goalkeeper_stats`)
4. **📋 Lineups (รายชื่อผู้เล่น & ทีมงาน)**: 11 ตัวจริง (`starting`), ตัวสำรอง (`substitutes`), ผู้จัดการทีม (`manager`), แผนการเล่น (`formation`), คณะผู้ตัดสิน (`officials`)
5. **💬 Commentary (รายงานบรรยายสด)**: สรุปประเด็นหลังเกม (`commentary.takeaways`) และข้อความบรรยายสดแยกตามนาที (`live_commentary`)
6. **🎥 Video (ไฮไลท์การแข่งขัน)**: วิดีโอคลิปไฮไลท์จาก YouTube (`youtube_id` หรือ `video` object)

---

## 📝 โค้ด JSON เทมเพลตตัวอย่าง (สำหรับนัด w6: Chelsea Women vs Arsenal)

สามารถคัดลอกก้อน JSON ด้านล่างนี้ไปอัปเดตทับแมตช์ `"id": "w6"` ใน `data/fixtures.json`:

```json
{
  "id": "w6",
  "date": "2026-09-27",
  "time": "22:30",
  "time_th": "22:30",
  "time_uk": "17:30",
  "competition": "Barclays Women's Super League",
  "competition_name": "Barclays Women's Super League",
  "competition_logo": "databases/logo/competitions/women/women_super_league.png",
  "team_type": "W",
  "round": "Matchweek 3",
  "home_team": "Chelsea Women",
  "home_logo": "databases/logo/teams/england_chelsea.svg",
  "away_team": "Arsenal",
  "away_logo": "databases/logo/teams/england_arsenal.svg",
  "venue": "Stamford Bridge, London",
  "ha": "H",
  "attendance": 39420,
  "referee": "Emily Heaslip",
  "status": "completed",
  "home_score": 2,
  "away_score": 1,
  "home_half_score": 1,
  "away_half_score": 0,
  "channels": [
    {
      "platform": "Sky Sports",
      "name": "Sky Sports",
      "logo": "databases/logo/tv/sky_sports.svg"
    }
  ],

  "goals": [
    {
      "team": "home",
      "player": "Lauren James",
      "minute": 18
    },
    {
      "team": "away",
      "player": "Alessia Russo",
      "minute": 62
    },
    {
      "team": "home",
      "player": "Aggie Beever-Jones",
      "minute": 84
    }
  ],

  "events": [
    {
      "type": "goal",
      "team": "home",
      "player": "Lauren James",
      "minute": 18,
      "detail": "Assist: Keira Walsh"
    },
    {
      "type": "yellow_card",
      "team": "away",
      "player": "Steph Catley",
      "minute": 34
    },
    {
      "type": "yellow_card",
      "team": "home",
      "player": "Lucy Bronze",
      "minute": 41
    },
    {
      "type": "goal",
      "team": "away",
      "player": "Alessia Russo",
      "minute": 62,
      "detail": "Assist: Beth Mead"
    },
    {
      "type": "substitution",
      "team": "home",
      "player": "Aggie Beever-Jones",
      "player_in": "Aggie Beever-Jones",
      "player_out": "Alyssa Thompson",
      "minute": 68
    },
    {
      "type": "substitution",
      "team": "home",
      "player": "Sjoeke Nüsken",
      "player_in": "Sjoeke Nüsken",
      "player_out": "Lexi Potter",
      "minute": 75
    },
    {
      "type": "goal",
      "team": "home",
      "player": "Aggie Beever-Jones",
      "minute": 84,
      "detail": "Assist: Lauren James"
    },
    {
      "type": "var",
      "team": "home",
      "player": "Aggie Beever-Jones",
      "minute": 85,
      "detail": "Goal Confirmed after Check"
    }
  ],

  "stats": [
    {
      "name": "การครองบอล (Possession)",
      "home": 58,
      "away": 42,
      "isPercentage": true
    },
    {
      "name": "โอกาสยิงทั้งหมด (Total Shots)",
      "home": 16,
      "away": 11,
      "isPercentage": false
    },
    {
      "name": "ยิงตรงกรอบ (Shots on Target)",
      "home": 7,
      "away": 4,
      "isPercentage": false
    },
    {
      "name": "ความแม่นยำในการส่งบอล (Pass Accuracy)",
      "home": 85,
      "away": 79,
      "isPercentage": true
    },
    {
      "name": "เตะมุม (Corner Kicks)",
      "home": 6,
      "away": 4,
      "isPercentage": false
    },
    {
      "name": "ทำฟาวล์ (Fouls)",
      "home": 9,
      "away": 13,
      "isPercentage": false
    },
    {
      "name": "ใบเหลือง (Yellow Cards)",
      "home": 1,
      "away": 2,
      "isPercentage": false
    },
    {
      "name": "ใบแดง (Red Cards)",
      "home": 0,
      "away": 0,
      "isPercentage": false
    },
    {
      "name": "ล้ำหน้า (Offsides)",
      "home": 2,
      "away": 3,
      "isPercentage": false
    }
  ],

  "goalkeeper_stats": [
    {
      "name": "Hannah Hampton",
      "team": "Chelsea Women",
      "saves": 3,
      "punches": 1,
      "high_claims": 2,
      "saves_inside_box": 2
    },
    {
      "name": "Anneke Borbe",
      "team": "Arsenal",
      "saves": 5,
      "punches": 0,
      "high_claims": 1,
      "saves_inside_box": 4
    }
  ],

  "lineups": {
    "home": {
      "manager": "Sonia Bompastor",
      "formation": "4-2-3-1",
      "starting": [
        { "number": 1, "name": "Hannah Hampton", "position": "GK", "pos": "GK" },
        { "number": 2, "name": "Lucy Bronze", "position": "DF" },
        { "number": 4, "name": "Kadeisha Buchanan", "position": "DF" },
        { "number": 5, "name": "Naomi Girma", "position": "DF" },
        { "number": 21, "name": "Ellie Carpenter", "position": "DF" },
        { "number": 6, "name": "Keira Walsh", "position": "MF" },
        { "number": 8, "name": "Erin Cuthbert", "position": "MF", "captain": true },
        { "number": 10, "name": "Lauren James", "position": "FW" },
        { "number": 17, "name": "Alyssa Thompson", "position": "FW", "minute_out": 68 },
        { "number": 22, "name": "Wieke Kaptein", "position": "MF" },
        { "number": 9, "name": "Mayra Ramírez", "position": "FW" }
      ],
      "substitutes": [
        { "number": 24, "name": "Livia Peng", "position": "GK" },
        { "number": 33, "name": "Aggie Beever-Jones", "position": "FW", "minute_in": 68 },
        { "number": 19, "name": "Sjoeke Nüsken", "position": "MF", "minute_in": 75 },
        { "number": 11, "name": "Sandy Baltimore", "position": "FW" },
        { "number": 14, "name": "Nathalie Björn", "position": "DF" },
        { "number": 27, "name": "Veerle Buurman", "position": "DF" },
        { "number": 30, "name": "Giulia Dragoni", "position": "MF" }
      ]
    },
    "away": {
      "manager": "Jonas Eidevall",
      "formation": "4-3-3",
      "starting": [
        { "number": 1, "name": "Anneke Borbe", "position": "GK", "pos": "GK" },
        { "number": 2, "name": "Emily Fox", "position": "DF" },
        { "number": 6, "name": "Leah Williamson", "position": "DF", "captain": true },
        { "number": 5, "name": "Laia Codina", "position": "DF" },
        { "number": 7, "name": "Steph Catley", "position": "DF" },
        { "number": 10, "name": "Kim Little", "position": "MF" },
        { "number": 12, "name": "Lia Wälti", "position": "MF" },
        { "number": 21, "name": "Victoria Pelova", "position": "MF" },
        { "number": 9, "name": "Beth Mead", "position": "FW" },
        { "number": 23, "name": "Alessia Russo", "position": "FW" },
        { "number": 19, "name": "Caitlin Foord", "position": "FW" }
      ],
      "substitutes": [
        { "number": 14, "name": "Manuela Zinsberger", "position": "GK" },
        { "number": 17, "name": "Lina Hurtig", "position": "FW" },
        { "number": 25, "name": "Stina Blackstenius", "position": "FW" }
      ]
    },
    "officials": [
      { "role": "Referee", "name": "Emily Heaslip" },
      { "role": "Assistant Referee 1", "name": "Melissa Burgin" },
      { "role": "Assistant Referee 2", "name": "Sophie Dennington" },
      { "role": "Fourth Official", "name": "Abbie Hendry" }
    ]
  },

  "commentary": {
    "summary": "สิงห์บลูส์สาว เชลซี เปิดบ้านเอาชนะ อาร์เซนอล 2-1 คว้า 3 แต้มสำคัญในศึกลอนดอนดาร์บี้",
    "takeaways": [
      "ลอเรน เจมส์ ยิงประตูเบิกร่องสุดสวยในนาทีที่ 18 พร้อมทำอีกหนึ่งแอสซิสต์",
      "แอกกี้ บีเวอร์-โจนส์ ลงสนามเป็นซูเปอร์ซับก่อนซัดประตูชัยในนาทีที่ 84",
      "ฮันนาห์ แฮมป์ตัน โชว์ฟอร์มเซฟสำคัญช่วงท้ายเกมช่วยให้ทีมคว้าชัยชนะ"
    ]
  },

  "live_commentary": [
    {
      "id": 1,
      "time": "",
      "type": "start",
      "text": "เริ่มการแข่งขันครึ่งแรกที่ สแตมฟอร์ด บริดจ์!",
      "team": "home",
      "isKey": false
    },
    {
      "id": 2,
      "time": "18'",
      "type": "goal",
      "text": "GOAL! เชลซี วีเมน ขึ้นนำ 1-0! ลอเรน เจมส์ ลากตัดเข้าในก่อนปั่นโค้งด้วยขวาเสียบเสาไกลอย่างงดงาม",
      "team": "home",
      "isKey": true
    },
    {
      "id": 3,
      "time": "45+2'",
      "type": "halftime",
      "text": "หมดเวลาการแข่งขันครึ่งเวลาแรก: เชลซี วีเมน 1 - 0 อาร์เซนอล",
      "team": null,
      "isKey": false
    },
    {
      "id": 4,
      "time": "46'",
      "type": "start",
      "text": "เริ่มการแข่งขันครึ่งหลัง",
      "team": null,
      "isKey": false
    },
    {
      "id": 5,
      "time": "62'",
      "type": "goal",
      "text": "GOAL! อาร์เซนอล ตีเสมอเป็น 1-1 จากจังหวะชาร์จจ่อๆ ของ อเลสเซีย รุสโซ่",
      "team": "away",
      "isKey": true
    },
    {
      "id": 6,
      "time": "68'",
      "type": "substitution",
      "text": "เชลซี เปลี่ยนตัว: แอกกี้ บีเวอร์-โจนส์ ลงสนามแทน อลิสซา ธอมป์สัน",
      "team": "home",
      "isKey": false
    },
    {
      "id": 7,
      "time": "84'",
      "type": "goal",
      "text": "GOAL! เชลซี วีเมน ขึ้นนำ 2-1! เจมส์ แทงทะลุช่องให้ บีเวอร์-โจนส์ หลุดเข้าไปยิงเสียบมุม",
      "team": "home",
      "isKey": true
    },
    {
      "id": 8,
      "time": "90+5'",
      "type": "end",
      "text": "จบเกม! เชลซี วีเมน 2 - 1 อาร์เซนอล คว้าชัยชนะดาร์บี้แมตช์ได้สำเร็จ",
      "team": null,
      "isKey": true
    }
  ],

  "youtube_id": "dQw4w9WgXcQ",
  "video": {
    "id": "dQw4w9WgXcQ",
    "title": "Match Highlights: Chelsea Women vs Arsenal | Barclays WSL",
    "desc_th": "รับชมไฮไลท์และจังหวะสำคัญการแข่งขันระหว่าง เชลซี วีเมน พบ อาร์เซนอล",
    "desc_en": "Watch full highlights from the London derby clash at Stamford Bridge.",
    "channel_name": "Chelsea FC Women",
    "channel_handle": "@chelseafcwomen",
    "channel_url": "https://www.youtube.com/@chelseafcwomen",
    "credit": "ขอบคุณคลิปไฮไลท์จากช่องทางการ Chelsea FC Women Official"
  }
}
```
