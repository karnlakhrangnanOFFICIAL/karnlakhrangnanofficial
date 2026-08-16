# KARNLAKHRANgNAN Official - Web Application

https://karnlakhrangnanofficial.github.io/karnlakhrangnanofficial/

เว็บไซต์อย่างเป็นทางการของ **KARNLAKHRANgNAN (กาลครั้งนั้น)** สำหรับติดตามข่าวสาร โปรแกรมการแข่งขัน ผลการแข่งขัน ตารางคะแนน รายชื่อนักเตะ (ทั้งทีมชายและทีมหญิง) ถ้วยรางวัล ประวัติศาสตร์สโมสร และฟีเจอร์อื่นๆ ของ Chelsea FC

---

## 1. สรุปโครงสร้างภาพรวมทั้งหมด (Project Overview & Architecture)

### 📁 โครงสร้างโฟลเดอร์และไฟล์สำคัญ (Directory Structure)

```
/
├── index.html               # หน้าแรก (Home Page - รวมแมตช์ล่าสุด โปรแกรมถัดไป ข่าว/สโมสร)
├── men-team.html            # ทีมชาย (Men's Team - ผลแข่งขัน, โปรแกรม, ตารางคะแนน, รายชื่อนักเตะ)
├── women-team.html          # ทีมหญิง (Women's Team - ผลแข่งขัน, โปรแกรม, ตารางคะแนน, รายชื่อนักเตะ)
├── trophy.html              # ถ้วยรางวัล (Trophy Room - ทำเนียบแชมป์และความสำเร็จ)
├── icons.html               # i-Cons (ตำนานสโมสร)
├── the-story-blue.html      # เรื่องราวสโมสร (The Story Blue)
├── match-detail.html        # หน้ารายละเอียดแมตช์ (Match Detail - แสดงช่องถ่ายทอดสด Logo TV, รายละเอียดการแข่งขัน, ไฮไลต์)
├── about.html               # เกี่ยวกับเรา (About Us)
├── server.js                # Express Server สำหรับให้บริการ Static Files
├── metadata.json            # ไฟล์ระบุ Metadata ของแอปพลิเคชัน
│
├── assets/                  # ไฟล์ทรัพยากรส่วนหน้า (Frontend Assets)
│   ├── css/
│   │   └── style.css        # สไตล์ชีทหลักของทั้งเว็บไซต์ (Responsive Layouts, Cards, Badges, Logo TV)
│   ├── js/
│   │   ├── main.js          # สคริปต์หลัก (Navigation, Language Switcher, Home Page)
│   │   ├── team.js          # สคริปต์จัดการข้อมูลทีมชาย/ทีมหญิง (Tab switching, Fetching JSON)
│   │   ├── trophy.js        # สคริปต์แสดงข้อมูลถ้วยรางวัล
│   │   └── match-detail.js # สคริปต์ดึงและแสดงผลรายละเอียดแมตช์
│   └── images/              # รูปภาพประกอบ โลโก้ และภาพนักเตะ
│
└── data/                    # ไฟล์ข้อมูล JSON (Data Stores)
    ├── fixtures-men.json    # โปรแกรมการแข่งขันทีมชาย
    ├── fixtures-women.json  # โปรแกรมการแข่งขันทีมหญิง
    ├── results-men.json     # ผลการแข่งขันทีมชาย
    ├── results-women.json   # ผลการแข่งขันทีมหญิง
    ├── tables-men.json      # ตารางคะแนนทีมชาย
    ├── tables-women.json    # ตารางคะแนนทีมหญิง
    ├── players-men.json     # รายชื่อและข้อมูลนักเตะทีมชาย
    ├── players-women.json   # รายชื่อและข้อมูลนักเตะทีมหญิง
    ├── trophy.json          # ข้อมูลถ้วยรางวัล
    ├── icons.json           # ข้อมูลตำนานนักเตะ (i-Cons)
    └── story-blue.json      # ข้อมูลเรื่องราวประวัติศาสตร์สโมสร
```

---

## 2. ร่างเทมเพลตสำหรับ `/men-team.html` [👕 รายชื่อนักเตะ]

โครงสร้างข้อมูลของนักเตะ 1 คน (ยกเว้นข้อมูลสถิติ เช่น `appearances`, `goals`, `assists`) มีดังนี้:

### 2.1 JSON Schema Template (ตัวอย่างการกำหนดค่าใน JSON)

```json
{
  "id": 1,
  "name": "Robert Sánchez",
  "position": "Goalkeeper",
  "number": 1,
  "nationality": "Spain",
  "image": "assets/images/players/robert-sanchez.jpg",
  "height": 197,
  "foot": "Right",
  "date_of_birth": "1997-11-18",
  "age": 28,
  "current_club": "Chelsea FC",
  "joined": "2023-08-05",
  "signed_from": "Brighton & Hove Albion",
  "market_value": 22000000
}
```

### 2.2 คำอธิบายฟิลด์ข้อมูลนักเตะ (Field Descriptions)

| ชื่อฟิลด์ (Field Name) | ประเภทข้อมูล (Type) | คำอธิบาย (Description) |
| :--- | :--- | :--- |
| **`id`** | Number | รหัสประจำตัวนักเตะ (Unique Identifier) |
| **`name`** | String | ชื่อ-นามสกุลนักเตะ |
| **`position`** | String | ตำแหน่งการเล่น (`Goalkeeper`, `Defender`, `Midfielder`, `Forward`) |
| **`number`** | Number | หมายเลขเสื้อ (Squad Number) |
| **`nationality`** | String | สัญชาติ / ประเทศต้นกำเนิด |
| **`image`** | String | พาธรูปภาพโปรไฟล์นักเตะ (`assets/images/players/...`) |
| **`height`** | Number | ส่วนสูง (เซนติเมตร / cm) |
| **`foot`** | String | เท้าข้างที่ถนัด (`Right`, `Left`, `Both`) |
| **`date_of_birth`** | String | วัน/เดือน/ปี เกิด รูปแบบ `YYYY-MM-DD` |
| **`age`** | Number | อายุปัจจุบัน (ปี) |
| **`current_club`** | String | สโมสรปัจจุบัน (เช่น `Chelsea FC`) |
| **`joined`** | String | วันที่เซ็นสัญญามาร่วมทีม รูปแบบ `YYYY-MM-DD` |
| **`signed_from`** | String | ย้ายมาจากสโมสรเดิมใด |
| **`market_value`** | Number | มูลค่าการตลาดโดยประมาณ (สกุลเงิน EUR/GBP) |

---

## 3. บันทึกการอัปเดตล่าสุด (Recent Updates Log)

### 📅 อัปเดตล่าสุด (2 สิงหาคม 2026)

1. **เชื่อมต่อ Google Sheets API ดึงข้อมูลโปรไฟล์นักเตะทีมชายแบบไดนามิก (`profile-men`)**
   - พัฒนา API Route `/api/sheets/:spreadsheetId` ใน `server.js` เพื่อดึงและแปลงข้อมูล CSV จาก Google Sheets มาเป็น JSON แบบ Real-time
   - เชื่อมต่อสคริปต์ `assets/js/team.js` เข้ากับ Google Sheet ID `11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs` แผ่นงาน `profile-men` (`gid=1721120655`)
   - แมปปิ้งฟิลด์ข้อมูลครบถ้วนทั้ง 18 คอลัมน์: `id`, `name`, `position`, `number`, `nationality`, `image`, `height`, `foot`, `date_of_birth`, `age`, `current_club`, `joined`, `signed_from`, `market_value`, `appearances`, `goals`, `assists`, และ `biography`
   - เพิ่มระบบแปลงตำแหน่งนักเตะเป็นภาษาไทยอัตโนมัติ (`formatPlayerPosition`) และระบบ Fallback Merge ร่วมกับไฟล์ JSON สำรอง

2. **อัปเดตทรัพยากรภาพนักเตะ (Player Image Assets)**
   - เพิ่มภาพถ่ายฉลองถ้วยรางวัลของ Reece James (`assets/images/players/reece-james.png`) และอัปเดตพาธในระบบโปรไฟล์นักเตะ

3. **ปรับแต่งสไตล์ UI โปรไฟล์นักเตะ (Focus Mode Styling Customization)**
   - เพิ่มการตั้งค่า CSS Selector เฉพาะตัวใน `assets/css/style.css` สำหรับหน้ารายละเอียดโปรไฟล์นักเตะ
   - กำหนดแบบอักษร Times New Roman สีข้อความโทนน้ำเงินสโมสร (`#0400ff`) และสีไฮไลท์แบนเนอร์หัวข้อสีทอง (`#e7c100`) สำหรับฟิลด์ข้อมูลส่วนสูง, วันเกิด, อายุ, เท้าถนัด, สัญชาติ, วันเปิดตัว, สโมสรเดิม และมูลค่าการตลาด

---

### 📅 อัปเดตก่อนหน้า (1 สิงหาคม 2026)

1. **อัปเดตระบบแสดงผลรูปภาพผู้ทำประตู (Goalscorers Avatars)**
   - เพิ่มการแสดงผลรูปภาพวงกลมของนักเตะผู้ทำประตูในหน้ารายละเอียดแมตช์ (`match-detail.html`) แทนที่สัญลักษณ์ ⚽ ทั่วไป
   - ปรับแต่ง CSS (`.goal-player-img`) ให้มีกรอบสีทอง ซูมเอฟเฟกต์เมื่อ Hover และรองรับรูปภาพสำรองอัตโนมัติ (`placeholder-player.svg`) เมื่อไม่พบรูปนักเตะ
   - เพิ่มระบบ Mapping ชื่อนักเตะอัจฉริยะ (เช่น `Satpaev` ➔ `Dastan Satpaev`, `Gittens` ➔ `Jamie Bynoe-Gittens`, `Dário Essugo` ➔ `Dario Essugo`, `Estêvão`, `Morgan Rogers`, ฯลฯ)

2. **ปรับปรุงข้อมูลนักเตะและผลการแข่งขัน (Data & Fixtures Updates)**
   - **เพิ่มข้อมูลนักเตะใหม่**: เพิ่ม `Dastan Satpaev` (กองหน้า สัญชาติคาซัคสถาน หมายเลข 43) ลงใน `data/players-men.json`
   - **อัปเดตผลการแข่งขันล่าสุด**: 
     - กระชับมิตร (Friendly): `Chelsea` **1 - 2** `Tottenham Hotspur` ณ สนาม Accor Stadium
     - บันทึกผู้ทำประตู: Tonali (17'), Estêvão (21'), Richarlison (90+2')
   - **แก้ไขความถูกต้องของ JSON**: ตรวจสอบและแก้ไขโครงสร้างข้อมูล `fixtures-men.json` และ `results-men.json` ให้ถูกต้องตามหลักมาตรฐาน JSON


---
