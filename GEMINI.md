# GEMINI.md — Project Rules & Architecture Guide (`karn-la-khrang-nan-official`)

ไฟล์นี้กำหนดกฎเหล็ก โครงสร้างโปรเจกต์ และขั้นตอนการทำงานสำหรับ AI Agent ใน **Antigravity** เพื่อให้แก้ไขและต่อยอดโค้ดได้อย่างแม่นยำโดยไม่กระทบระบบเดิม

---

## 1. Tech Stack & Core Guardrails (กฎเหล็กห้ามละเมิด)

1. **Architecture Lock (ห้ามเปลี่ยน Framework):**
   - โปรเจกต์นี้เป็น **Multi-page Vanilla HTML5 / CSS3 / JavaScript + Node.js Express (`"type": "module"`)**
   - **ห้าม** ติดตั้งหรือแปลงโปรเจกต์เป็น React, Vue, Next.js, Vite หรือ TypeScript เว้นแต่ได้รับคำสั่งโดยตรงจากผู้ใช้
2. **Source vs. Minified Bundle (สำคัญมาก):**
   - **ห้ามแก้ไขไฟล์ผลลัพธ์โดยตรงเด็ดขาด:** `assets/js/app.bundle.min.js` และ `assets/css/style.min.css`
   - ให้แก้ไขที่ไฟล์ต้นฉบับ (`assets/js/main.js`, `assets/js/team.js`, `assets/css/style.css`) แล้วรัน **`npm run build`** ทุกครั้งเพื่ออัปเดตไฟล์ `.min`
3. **ข้อควรระวังเรื่อง Custom Regex Minifier (`scripts/build.js`):**
   - ตัวบีบอัดโค้ดใน `scripts/build.js` ใช้ Regex ในการตัดช่องว่างและคอมเมนต์
   - **ต้องใส่ Semicolon (`;`) ปิดท้ายคำสั่งในไฟล์ JavaScript ทุกบรรทัดเสมอ** (ห้ามพึ่งพา Automatic Semicolon Insertion)
   - หลีกเลี่ยงการใช้ `//` ภายใน String หรือ Regex ที่ไม่ได้ Escape เพื่อไม่ให้โค้ดพังหลังรัน `npm run build`
4. **Zero Junk Policy (ห้ามทิ้งไฟล์ขยะ):**
   - ห้ามสร้างไฟล์สำรอง (`.bak`, `.tmp`, `-copy`, `-old`) ทิ้งไว้ในโปรเจกต์
   - หากเขียนสคริปต์เฉพาะกิจเพื่อแปลงข้อมูล JSON หรือประมวลผลรูปภาพ **ต้องลบสคริปต์ชั่วคราวนั้นทิ้งทันที** หลังรันและตรวจสอบผลเสร็จ
5. **Dual-Runtime Parity (`server.js` + `vercel.json`):**
   - โปรเจกต์รันได้ทั้งแบบ Node Server (`server.js` พอร์ต `3000`) และ Serverless บน Vercel (`vercel.json` + โฟลเดอร์ `api/`)
   - หากเพิ่มหน้า HTML หลักใหม่ หรือเพิ่ม Endpoint ใน `api/` ต้องอัปเดต Route ให้ตรงกันทั้งใน `server.js` และ `vercel.json`
   - ระวังเรื่อง Redirect Loop: หน้าที่มีชื่อซ้ำกับโฟลเดอร์ย่อย (`/trophy`, `/the-story-blue`, `/icons` vs `/icon`) ต้องประกาศ Explicit Route ก่อน `express.static(..., { redirect: false })` เสมอ

---

## 2. Project Directory Structure (แผนผังโครงสร้างโปรเจกต์)

```text
/
├── server.js                  # Express server หลัก (Development & Node hosting, Port 3000)
├── vercel.json                # ตั้งค่า Rewrites และ Serverless Functions สำหรับ Vercel
├── package.json               # ES Module ("type": "module") และคำสั่งสคริปต์มาตรฐาน
├── .env.example               # ตัวอย่างตัวแปรสภาพแวดล้อม (ห้าม Commit ไฟล์ .env จริง)
│
├── *.html                     # หน้าเว็บหลัก (Multi-page Entry Points)
│   ├── index.html             # หน้าแรก (ข่าวสาร, แมตช์ล่าสุด/ถัดไป, ภาพรวมสโมสร)
│   ├── men-team.html          # ข้อมูลทีมชาย ตารางคะแนน โปรแกรมแข่ง และสถิติ
│   ├── women-team.html        # ข้อมูลทีมหญิง (WSL & UWCL) ตารางคะแนน และสถิติ
│   ├── match-detail.html      # รายละเอียดแมตช์ทีมชาย (Events, Stats, Lineups, Download PDF Report)
│   ├── match-detail-women.html# รายละเอียดแมตช์ทีมหญิง
│   ├── player-profile.html    # โปรไฟล์นักเตะเชิงลึกและสถิติรายบุคคล
│   ├── player-card.html       # การ์ดข้อมูลนักเตะสำหรับแชร์/ดาวน์โหลด
│   ├── pre-match-graphic.html # เครื่องมือสร้างกราฟิกก่อนเกม (html2canvas)
│   ├── post-match-graphic.html# เครื่องมือสร้างกราฟิกหลังเกม (html2canvas)
│   ├── transfers.html         # ตลาดซื้อขายนักเตะ (Transfers)
│   ├── trophy.html            # ทำเนียบแชมป์ (หน้าย่อยอยู่ใน /trophy/*.html)
│   ├── the-story-blue.html    # ประวัติศาสตร์สโมสร (บทความย่อยอยู่ใน /the-story-blue/*.html)
│   ├── icons.html             # ตำนานสโมสร (โปรไฟล์ย่อยอยู่ใน /icon/*.html)
│   ├── chelsea.html           # Chelsea Hub
│   ├── epl.html               # ภาพรวมตารางและข้อมูลพรีเมียร์ลีก
│   └── about.html             # เกี่ยวกับเว็บไซต์
│
├── api/                       # Serverless / Express API Handlers
│   ├── news.js                # ดึงและแปลข่าวสโมสร
│   ├── epl-standings.js       # API ตารางคะแนน EPL
│   ├── wsl-standings.js       # API ตารางคะแนน WSL
│   ├── uwcl-standings.js      # API ตารางคะแนน UWCL
│   ├── pl-match.js            # ข้อมูลแมตช์พรีเมียร์ลีก
│   ├── efl-match.js           # ข้อมูลแมตช์บอลถ้วย EFL
│   └── football-data/         # Proxy เชื่อมต่อ Football-Data.org API พร้อมจัดการ CORS & Token
│
├── assets/
│   ├── css/
│   │   ├── style.css          # [SOURCE] ไฟล์ CSS หลักของเว็บไซต์
│   │   ├── chelsea-hub.css    # [SOURCE] CSS เฉพาะหน้า Chelsea Hub
│   │   └── style.min.css      # [GENERATED] สร้างจาก npm run build (ห้ามแก้ตรง)
│   ├── js/
│   │   ├── main.js            # [SOURCE] ลอจิกหลักฝั่ง Frontend (UI, ข่าว, โปรไฟล์นักเตะ, ภาษา, โหลดข้อมูล)
│   │   ├── team.js            # [SOURCE] ลอจิกหน้าทีม ตารางคะแนน แมตช์ และสถิติ
│   │   ├── chelsea-hub.js     # [SOURCE] ลอจิกหน้า Chelsea Hub
│   │   ├── tactical-heatmap.js# [SOURCE] การเรนเดอร์แผนผังแท็กติกและ Heatmap (D3)
│   │   ├── vendor/            # ไลบรารีฝั่ง Client ที่โฮสต์ในโปรเจกต์
│   │   └── app.bundle.min.js  # [GENERATED] รวม main.js + team.js จาก npm run build (ห้ามแก้ตรง)
│   ├── fonts/                 # ฟอนต์ประจำเว็บไซต์
│   ├── images/ & img/         # รูปภาพนักเตะ กราฟิก โลโก้ และ Placeholder
│
├── data/                      # ฐานข้อมูล JSON หลักของฝั่ง Frontend และ API
│   ├── players-men.json / all-players-men.json
│   ├── players-women.json / all-players-women.json
│   ├── fixtures.json / fixtures-women.json / matchlogs-women.json
│   ├── tables-men.json / tables-women.json / tables-uwcl.json
│   ├── transfers_26_27.json
│   ├── icons.json / trophy.json / story-blue.json / id_team.json
│
├── databases/                 # คลังข้อมูลเสริม โลโก้ทีม และคลังข่าว (`news_archive.json`)
├── lang/                      # ไฟล์แปลภาษา 2 ภาษา (`th.json`, `en.json`)
└── scripts/                   # สคริปต์ Build และ Sync ข้อมูลมาตรฐาน
    ├── build.js               # Bundle & minify JS/CSS
    ├── sync-football-data-table.mjs
    ├── sync-table.mjs
    ├── sync-wsl-table.mjs
    └── import_fbref_women.mjs
```

> **หมายเหตุเรื่อง Path รูปภาพ:** รูปภาพมีการอ้างอิงอยู่ใน `assets/images/`, `assets/img/`, `img/`, `databases/logo/` และบางไฟล์ใน `src/assets/images/` ก่อนลบหรือย้ายไฟล์รูปภาพทุกครั้ง ต้องค้นหา Path อ้างอิงใน `.html`, `assets/js/*.js` และ `data/*.json` ให้ครบถ้วนก่อนเสมอ

---

## 3. UI/UX & Feature Conventions (แนวทางการออกแบบและฟีเจอร์เฉพาะ)

1. **Loading States ("กำลังโหลด..." / "Loading..."):**
   - ทุกสถานะที่รอโหลดข้อมูล รอรีโหลดภาพข่าว รูปโปรไฟล์นักเตะ อัปโหลด หรือดาวน์โหลดไฟล์ (เช่น PDF / Graphic) ต้องแสดงสถานะ **"กำลังโหลด..." / "Loading..."** บนพื้นหลังที่เหมาะสมเสมอ
   - **ห้าม** ตั้งรูปนักเตะคนใดคนหนึ่งตายตัวไว้ในแอตทริบิวต์ `src` เริ่มต้นของ `#playerImage` (เช่นใน `player-profile.html`) ระหว่างกำลังโหลดข้อมูล ให้ใช้สถานะกำลังโหลดและ Fallback ไปยัง `placeholder-player.svg` เมื่อไม่พบรูปจริงเท่านั้น
2. **หน้าตำนานสโมสร (`icons.html` & `/icon/:name`):**
   - นักเตะตำนานที่ยังไม่มีไฟล์ HTML ข้อมูลจริงใน `icon/` หรือไฟล์ยังมี Placeholder `{{PLAYER_NAME}}` ระบบจะต้องแสดงสถานะ **"Coming Soon"** เมื่อผู้ใช้คลิกดูการ์ด ห้ามปล่อยให้เปิดไปเจอหน้าว่างหรือ Error 404 ดิบๆ
3. **รองรับ 2 ภาษา (Thai / English):**
   - ข้อความ UI ใหม่ควรรองรับระบบสลับภาษาโดยตรวจสอบคีย์ใน `lang/th.json` และ `lang/en.json`
4. **การสร้างไฟล์กราฟิกและ PDF (`html2canvas` & `jspdf`):**
   - เมื่อแก้ไขหน้า `match-detail.html` (ปุ่ม Download Match Report), `pre-match-graphic.html`, `post-match-graphic.html` หรือ `player-card.html` ต้องระวังเรื่อง CORS ของรูปภาพ (`crossOrigin="anonymous"`) และขนาด Layout ขณะแคปเจอร์หน้าจอ

---

## 4. Standard Commands & Workflow (ขั้นตอนการทำงานสำหรับ Agent)

### คำสั่งหลักที่ใช้ประจำ
- **รันเซิร์ฟเวอร์พัฒนา (Port 3000):**
  ```bash
  npm run dev
  ```
- **Build ไฟล์ JS/CSS หลังแก้ไขโค้ด Frontend (บังคับรันทุกครั้งที่แก้ `main.js`, `team.js`, `style.css`):**
  ```bash
  npm run build
  ```
- **ตรวจสอบ Syntax เบื้องต้น:**
  ```bash
  npm run lint
  ```
- **ซิงก์ข้อมูลตารางคะแนนและสถิติ (ใช้สคริปต์เดิมแทนการเขียนใหม่ซ้ำซ้อน):**
  ```bash
  npm run sync:standings
  npm run sync:wsl
  npm run sync:fbref:women
  ```

### Checklist ก่อนจบงานทุกครั้ง (Definition of Done)
1. แก้ไขโค้ดตรงตามขอบเขตหน้าที่ได้รับมอบหมาย โดยไม่ทำข้อมูลทีมชาย/ทีมหญิงปนกัน
2. หากมีการแก้ไข `assets/js/main.js`, `assets/js/team.js` หรือ `assets/css/style.css` **ได้รัน `npm run build` เรียบร้อยแล้ว**
3. รัน `npm run lint` ผ่านโดยไม่มี Syntax Error
4. ลบไฟล์ชั่วคราวหรือสคริปต์เฉพาะกิจที่สร้างขึ้นระหว่างทำงานออกทั้งหมด
5. (ใน Antigravity) เปิด Browser ตรวจสอบหน้าเว็บที่แก้ไขบน `http://localhost:3000` ว่าโหลดข้อมูล รูปภาพ และปุ่มต่างๆ ทำงานได้ปกติไม่มี Console Error
