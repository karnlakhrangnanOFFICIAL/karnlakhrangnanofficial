# John Terry · Captain, Leader, Legend — คู่มือไฟล์ภาพ (Image Assets)

ไฟล์นี้อธิบายภาพทั้งหมดที่ต้องเตรียมสำหรับหน้า `john-terry.html` เพื่อป้องกันความผิดพลาดในการตั้งชื่อไฟล์และวาง path

---

## 1. โครงสร้างโฟลเดอร์

ภาพเฉพาะของ John Terry ทั้งหมดให้เก็บไว้ในโฟลเดอร์ส่วนตัว 1 คน 1 โฟลเดอร์ ตามรูปแบบที่ใช้กับฐานข้อมูลผู้เล่นทั้งหมด:

```
assets/
└── images/
    ├── players/
    │   └── john-terry/          ← โฟลเดอร์เฉพาะของ John Terry (12 ไฟล์)
    │       ├── profile.png
    │       ├── hero.jpg
    │       ├── youth.jpg
    │       ├── captain-armband.jpg
    │       ├── mourinho.jpg
    │       ├── fa-cup-2010.jpg
    │       ├── england-captain.jpg
    │       ├── lampard.jpg
    │       ├── moscow-2008.jpg
    │       ├── munich-2012.jpg
    │       ├── farewell-2017.jpg
    │       └── coaching.jpg
    ├── trophies/
    │   └── chelsea-2004-05-title.jpg   ← ภาพทีม (ใช้ร่วมกับผู้เล่นคนอื่นได้)
    └── misc/
        └── captain-leader-legend-banner.jpg   ← แบนเนอร์ Stamford Bridge (ใช้ร่วมได้)
```

**หลักการแบ่ง:** ภาพที่เป็น "ของ John Terry คนเดียว" (ภาพเดี่ยว/ภาพคู่ที่โฟกัสตัวเขา) → เก็บในโฟลเดอร์ `players/john-terry/` ส่วนภาพที่เป็น "ภาพทีม/แบนเนอร์กลาง" ที่อาจนำไปใช้ซ้ำในหน้าผู้เล่นคนอื่น → เก็บในโฟลเดอร์กลาง `trophies/` หรือ `misc/`

---

## 2. รายชื่อไฟล์ภาพทั้งหมด (รวม 14 ไฟล์)

| # | ชื่อไฟล์ | Path เต็ม | ตำแหน่งที่ใช้ในหน้าเว็บ | คำอธิบายภาพที่ต้องการ | ขนาดแนะนำ |
|---|---|---|---|---|---|
| 1 | `profile.png` | `assets/images/players/john-terry/profile.png` | การ์ดโปรไฟล์ (วงกลมมุมซ้ายบน) | ภาพหน้าตรง/ครึ่งตัว พื้นหลังเรียบหรือโปร่งใส | 200×200px |
| 2 | `hero.jpg` | `assets/images/players/john-terry/hero.jpg` | ภาพฮีโร่ใต้ชื่อเรื่อง (บนสุดของบทความ) | Terry สวมปลอกแขนกัปตัน Chelsea เต็มตัว/ครึ่งตัว แนวนอน | 1600×700px ขึ้นไป |
| 3 | `youth.jpg` | `assets/images/players/john-terry/youth.jpg` | หัวข้อ "วัยเด็กและรากเหง้า" | ภาพวัยเยาว์ หรือช่วง Chelsea Academy | 1200×800px |
| 4 | `captain-armband.jpg` | `assets/images/players/john-terry/captain-armband.jpg` | หัวข้อ "การก้าวขึ้นเป็นกัปตัน" | ภาพรับ/สวมปลอกแขนกัปตันครั้งแรก (ฤดูกาล 2003/04) | 1200×800px |
| 5 | `mourinho.jpg` | `assets/images/players/john-terry/mourinho.jpg` | หัวข้อ "ยุคทอง: Abramovich และ Mourinho" (ภาพซ้ายในคู่ภาพ) | Terry กับ José Mourinho ข้างสนาม | 800×600px |
| 6 | `fa-cup-2010.jpg` | `assets/images/players/john-terry/fa-cup-2010.jpg` | หัวข้อ "FWA Footballer of the Year" | Terry ยกถ้วย FA Cup ที่ Wembley 2010 | 1200×800px |
| 7 | `england-captain.jpg` | `assets/images/players/john-terry/england-captain.jpg` | หัวข้อ "ทีมชาติ England" | Terry ในชุดทีมชาติ สวมปลอกแขนกัปตัน | 1200×800px |
| 8 | `lampard.jpg` | `assets/images/players/john-terry/lampard.jpg` | หัวข้อ "ชีวิตส่วนตัวและครอบครัว" | Terry คู่กับ Frank Lampard | 1200×800px |
| 9 | `moscow-2008.jpg` | `assets/images/players/john-terry/moscow-2008.jpg` | หัวข้อ "บาดแผลแรกใน Champions League" (banner-quote) | Terry ที่ Luzhniki Stadium มอสโก 2008 | 745×993px (แนวตั้ง ตามที่กำหนดในโค้ด) |
| 10 | `munich-2012.jpg` | `assets/images/players/john-terry/munich-2012.jpg` | หัวข้อ "ค่ำคืนมิวนิก" | Terry ร่วมพิธียกถ้วย Champions League มิวนิก 2012 | 1200×800px |
| 11 | `farewell-2017.jpg` | `assets/images/players/john-terry/farewell-2017.jpg` | หัวข้อ "บทสุดท้ายที่ Stamford Bridge" | ภาพอำลาแฟนบอล นัดสุดท้าย 26 พ.ค. 2017 | 1200×800px |
| 12 | `coaching.jpg` | `assets/images/players/john-terry/coaching.jpg` | หัวข้อ "เส้นทางสู่การเป็นผู้ฝึกสอน" | Terry ในบทบาทผู้ช่วยผู้จัดการทีม Aston Villa ข้างสนาม | 1200×800px |
| 13 | `chelsea-2004-05-title.jpg` | `assets/images/trophies/chelsea-2004-05-title.jpg` | หัวข้อ "ยุคทอง: Abramovich และ Mourinho" (ภาพขวาในคู่ภาพ) | ทีม Chelsea ฉลองแชมป์ Premier League 2004/05 | 800×600px |
| 14 | `captain-leader-legend-banner.jpg` | `assets/images/misc/captain-leader-legend-banner.jpg` | หัวข้อ "มรดกและความเป็นตำนาน" | แบนเนอร์ "Captain, Leader, Legend" ตัวจริงที่ Stamford Bridge | 1200×800px |

---

## 3. หมายเหตุสำคัญ (ป้องกันความผิดพลาด)

- **นามสกุลไฟล์ต้องตรงตามที่ระบุ** ส่วนใหญ่เป็น `.jpg` ยกเว้น `profile.png` ที่เป็น `.png` — หากใช้นามสกุลผิดจะทำให้รูปไม่แสดงในเว็บ
- **ชื่อไฟล์ในโฟลเดอร์ `john-terry/` ไม่มีคำว่า "john-terry" นำหน้าอีกแล้ว** เพราะอยู่ในโฟลเดอร์เฉพาะบุคคลอยู่แล้ว (เช่น `hero.jpg` ไม่ใช่ `john-terry-hero.jpg`)
- **ไฟล์ #9 (`moscow-2008.jpg`)** ใช้ inline `<img>` ภายใน `.banner-quote` เป็นภาพแนวตั้ง ขนาดต่างจากไฟล์อื่นที่เป็นแนวนอน ควรเลือกภาพสัดส่วนแนวตั้งโดยเฉพาะ
- **ไฟล์ #13, #14** ไม่อยู่ในโฟลเดอร์ `john-terry/` เนื่องจากเป็นภาพที่สามารถใช้ซ้ำกับหน้าผู้เล่น/บทความอื่นได้ (เช่น ภาพทีมแชมป์ หรือแบนเนอร์สนาม) — หากสร้างหน้าผู้เล่นคนอื่นที่ต้องใช้ภาพทีมชุดเดียวกัน ให้ชี้ path มาที่ไฟล์เดิมได้เลย ไม่ต้องคัดลอกซ้ำ
- ช่วงเนื้อหา **"ข้อโต้แย้งและความท้าทาย"** จงใจไม่มีภาพประกอบ เพื่อความเหมาะสมของเนื้อหา — ไม่ต้องเตรียมไฟล์ภาพสำหรับส่วนนี้
- รูปแบบโฟลเดอร์นี้ (`assets/images/players/[player-slug]/`) แนะนำให้ใช้เป็นมาตรฐานเดียวกันกับผู้เล่นคนอื่นในฐานข้อมูล 831 คน เพื่อความสอดคล้องของระบบไฟล์ทั้งเว็บไซต์

---

## 4. สรุปจำนวน

- **ไฟล์เฉพาะ John Terry:** 12 ไฟล์ (ในโฟลเดอร์ `players/john-terry/`)
- **ไฟล์ใช้ร่วมกับหน้าอื่น:** 2 ไฟล์ (ในโฟลเดอร์ `trophies/` และ `misc/`)
- **รวมทั้งหมด:** 14 ไฟล์
