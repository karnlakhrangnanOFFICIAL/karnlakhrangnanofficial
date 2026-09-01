# 📋 คู่มือแอดมิน: การอัปเดตข้อมูลหลังจบเกมการแข่งขัน (Post-Match Admin Guide)

เอกสารฉบับนี้จัดทำขึ้นเพื่อให้ **Admin** สามารถอัปเดตข้อมูลผลการแข่งขัน ผู้ทำประตู และรายละเอียดต่างๆ หลังจบเกมได้อย่างถูกต้อง และป้องกันข้อผิดพลาดทางไวยากรณ์ (Syntax Errors)

---

## 📁 1. ไฟล์ที่เกี่ยวข้องทั้งหมด (Related Files)

| ชื่อไฟล์ / Directory | หน้าที่และคำอธิบาย |
| :--- | :--- |
| **`data/fixtures.json`** | ไฟล์หลักสำหรับเก็บตารางการแข่งขันและรายละเอียดแมตช์ (รวมถึงรายชื่อผู้ทำประตู `goals`) |
| **`data/results-men.json`** | ไฟล์สำหรับเก็บสรุปผลการแข่งขันของทีมชาย |
| **`data/players-men.json`** | รายชื่อและโปรไฟล์นักเตะทีมชาย (ใช้ดึงรูปภาพรูปโปรไฟล์นักเตะ) |
| **`assets/images/players/men/`** | โฟลเดอร์เก็บรูปภาพโปรไฟล์นักเตะทีมชาย (`.jpg` / `.png` / `.webp`) |
| **`assets/images/players/women/`** | โฟลเดอร์เก็บรูปภาพโปรไฟล์นักเตะทีมหญิง (`.jpg` / `.png` / `.webp`) |

*(หมายเหตุ: สำหรับทีมหญิง ให้ดำเนินการในลักษณะเดียวกันกับไฟล์ `fixtures.json`, `results-women.json` และ `players-women.json`)*

---

## ⚽ 2. ขั้นตอนการอัปเดตหลังจบเกม (Post-Match Update Steps)

### **ขั้นตอนที่ 1: อัปเดตแมตช์ใน `data/fixtures.json`**

ค้นหาแมตช์ที่เพิ่งแข่งขันจบ แล้วทำการแก้ไขค่าดังนี้:

1. เปลี่ยนสถานะแมตช์: `"status": "completed"`
2. ระบุผลการแข่งขัน:
   - `"home_score": 1` (จำนวนประตูของทีมเหย้า)
   - `"away_score": 2` (จำนวนประตูของทีมเยือน)
3. ระบุรายชื่อผู้ทำประตูในอาร์เรย์ `"goals"`

#### 💡 ตัวอย่างการลงข้อมูลใน `fixtures.json`:

```json
{
  "id": 2,
  "date": "2026-08-01",
  "time": "16:45",
  "competition": "Friendly Match",
  "competition_logo": "",
  "home_team": "Chelsea",
  "home_logo": "databases/logo/teams/england_chelsea.svg",
  "away_team": "Tottenham Hotspur",
  "away_logo": "databases/logo/teams/england_tottenham--2006-2013.svg",
  "venue": "Accor Stadium",
  "home_score": 1,
  "away_score": 2,
  "status": "completed",
  "goals": [
    {"team": "away", "player": "Tonali", "minute": 17},
    {"team": "home", "player": "Estêvão", "minute": 21},
    {"team": "away", "player": "Richarlison", "minute": "90+2"}
  ],
  "channels": [
    { "platform": "chelseafc.com", "name": "CFC+", "logo": "databases/logo/tv/cfc.svg" }
  ]
}
```

#### 📌 รายละเอียดโครงสร้างใน `"goals"`:
- **`team`**: ระบุ `"home"` (ทีมเหย้า) หรือ `"away"` (ทีมเยือน)
- **`player`**: ชื่อผู้ทำประตู (เช่น `"Estêvão"`, `"Dastan Satpaev"`, `"Cole Palmer"`)
- **`minute`**: นาทีที่ยิงประตู (เป็นตัวเลข เช่น `21` หรือเป็นข้อความทดเวลา เช่น `"90+2"`)

---

### **ขั้นตอนที่ 2: อัปเดตแมตช์ใน `data/results-men.json`**

ค้นหาแมตช์เดียวกันในไฟล์ `data/results-men.json` เพื่อให้หน้าต่างสรุปผลงานอัปเดตตรงกัน:

1. ใส่สกอร์ประตู: `"home_score": 1, "away_score": 2`
2. เปลี่ยนสถานะแมตช์: `"status": "completed"`

#### 💡 ตัวอย่างการอัปเดตใน `results-men.json`:

```json
{
  "id": 2,
  "date": "2026-08-01",
  "time": "16:45",
  "competition": "Friendly Match",
  "home_team": "Chelsea",
  "home_logo": "databases/logo/teams/england_chelsea.svg",
  "home_score": 1,
  "away_team": "Tottenham Hotspur",
  "away_logo": "databases/logo/teams/england_tottenham--2006-2013.svg",
  "away_score": 2,
  "venue": "Accor Stadium",
  "status": "completed"
}
```

---

### **ขั้นตอนที่ 3: ตรวจสอบ/เพิ่มรูปโปรไฟล์นักเตะใหม่ (กรณีมีนักเตะใหม่)**

หากผู้ทำประตูเป็นนักเตะใหม่ที่ยังไม่มีรูปในระบบ:

1. **บันทึกรูปภาพ**: นำรูปถ่ายของนักเตะไปวางไว้ที่ `assets/images/players/men/` สำหรับทีมชาย หรือ `assets/images/players/women/` สำหรับทีมหญิง (เช่น `dastan-satpaev.png`)
2. **เพิ่มข้อมูลโปรไฟล์นักเตะ**: เพิ่มก้อนข้อมูลนักเตะใน `data/players-men.json` (หรือ `data/players-women.json`)

```json
{
  "id": 38,
  "name": "Dastan Satpaev",
  "position": "Forward",
  "number": 43,
  "nationality": "Kazakhstan",
  "image": "assets/images/players/men/dastan-satpaev.png",
  "appearances": 1,
  "goals": 1,
  "assists": 0
}
```

> ⚡ **ระบบค้นหารูปภาพผู้ทำประตูอัตโนมัติ**: 
> หน้าแสดงผลรายละเอียดแมตช์ (`match-detail.html`) มีระบบแมปชื่ออัจฉริยะ จะทำการค้นหารูปภาพจาก `data/players-men.json` / `data/players-women.json` และไฟล์ใน `assets/images/players/men/` / `assets/images/players/women/` ให้อัตโนมัติ โดยจับคู่จากชื่อหรือนามสกุลนักเตะ

---

## ⚠️ 3. ข้อควรระวังที่พบบ่อย (Common Mistakes to Avoid)

1. **อย่าลืมเครื่องหมายจุลภาค (Comma `,`)**:
   - เมื่อเพิ่มสมาชิกใหม่ใน JSON ต้องใส่เครื่องหมาย `,` ปิดท้ายบรรทัดก่อนหน้าเสมอ
2. **ห้ามใส่เครื่องหมาย จุลภาค `,` เกินที่ตัวสุดท้าย**:
   - ตัวสุดท้ายใน Array หรือ Object ห้ามมีเครื่องหมาย `,` ต่อท้าย
3. **การพิมพ์นาทีทดเวลาบาดเจ็บ**:
   - ให้ใช้ `"90+2"` (เป็น String) ห้ามใส่เครื่องหมายคำพูดซ้อน เช่น `"90'+2"` ❌
4. **ตรวจสอบชื่อนักเตะ**:
   - ตรวจสอบให้แน่ใจว่าชื่อนักเตะสะกดตรงกันกับในระบบ เพื่อให้ดึงรูปภาพรูปวงกลมโปรไฟล์ผู้ทำประตูมาแสดงผลได้ถูกต้องสวยงาม

---

*สร้างเมื่อ: 1 สิงหาคม 2026 | เอกสารคู่มือระบบจัดการเว็บไซต์แฟนคลับ*
