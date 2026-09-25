/**
 * KARNLAKHRANGNAN OFFICIAL - TACTICAL HEATMAP & FORMATION ENGINE (D3.js)
 * Visualizes manager tactical preferences, formation heatmaps, passing flows & pressing zones.
 */

(function() {
  'use strict';

  // Formation & Tactical Database for Managers
  const TACTICAL_DB = {
    xabi_alonso: {
      name: "Xabi Alonso",
      nameTh: "ชาบี อลอนโซ่",
      title: "Men's Head Coach (Manager)",
      titleTh: "ผู้จัดการทีมชุดใหญ่",
      team: "men",
      color: "#38bdf8",
      accent: "#0033a0",
      defaultFormation: "3-4-2-1",
      formations: {
        "3-4-2-1": {
          label: "3-4-2-1 (Signature Leverkusen System)",
          labelTh: "3-4-2-1 (ระบบเลเวอร์คูเซินไร้พ่าย)",
          description: "Fluid 3-box-3 build-up with inverted double #10s occupying half-spaces, wide wing-backs providing maximum width, and a dynamic double pivot controlling game tempo.",
          descriptionTh: "การเซ็ตบอลแบบ 3+2 ในแดนหลัง ดันวิงแบ็กสองฝั่งยืนชิดริมเส้น และใช้เพลย์เมกเกอร์คู่ (Double 10) เจาะช่อง Half-space พร้อมมิดฟิลด์คู่กลางคุมจังหวะเกม",
          metrics: {
            possession: "66.4%",
            ppda: "7.8 (Ultra High Press)",
            halfSpaceIndex: "92%",
            defensiveLine: "49.5m",
            restDefense: "3 + 2 Inverted Box"
          },
          players: [
            { id: "gk", num: 1, role: "Sweeper Keeper", roleTh: "ผู้รักษาประตูตัวกวาด", pos: "GK", x: 80, y: 260, heat: 45, desc: "Active in 1st phase build-up, sweeping behind high defensive line." },
            { id: "lcb", num: 6, role: "Ball-Playing CB (Left)", roleTh: "เซ็นเตอร์แบ็กซ้ายตัวเปิดบอล", pos: "LCB", x: 190, y: 150, heat: 75, desc: "Progressive passing into left half-space and switching play." },
            { id: "ccb", num: 26, role: "Central Libero / Anchor", roleTh: "ลิเบอโร่ตัวกลางคุมจังหวะ", pos: "CCB", x: 175, y: 260, heat: 68, desc: "Distributes from deep, covers central transitions." },
            { id: "rcb", num: 2, role: "Ball-Playing CB (Right)", roleTh: "เซ็นเตอร์แบ็กขวาดันสูง", pos: "RCB", x: 190, y: 370, heat: 74, desc: "Steps into midfield to create +1 overload in right channel." },
            { id: "lwb", num: 3, role: "Attacking Wing-Back (L)", roleTh: "วิงแบ็กซ้ายตัวบุกทะลวง", pos: "LWB", x: 420, y: 70, heat: 92, desc: "High and wide isolation, delivery into 18-yard box." },
            { id: "lcm", num: 25, role: "Deep-Lying Controller", roleTh: "มิดฟิลด์ตัวเชื่อมเกม", pos: "LCM", x: 330, y: 205, heat: 88, desc: "Resists press, dictates tempo, recycled possession master." },
            { id: "rcm", num: 8, role: "Box-to-Box Destroyer", roleTh: "มิดฟิลด์บ็อกซ์ทูบ็อกซ์", pos: "RCM", x: 330, y: 315, heat: 85, desc: "Aggressive counter-press and second ball recovery." },
            { id: "rwb", num: 24, role: "Inverted Wing-Back (R)", roleTh: "วิงแบ็กขวากึ่งปีกตัวรุก", pos: "RWB", x: 440, y: 450, heat: 94, desc: "Direct channel running, crosses and inside penalty box entries." },
            { id: "lam", num: 20, role: "Left Inside Playmaker (#10)", roleTh: "เพลย์เมกเกอร์ซ้ายช่อง Half-Space", pos: "LAM", x: 540, y: 175, heat: 96, desc: "Operates in left half-space, creates key chances & combinations." },
            { id: "ram", num: 10, role: "Right Inside Playmaker (#10)", roleTh: "เพลย์เมกเกอร์ขวาเจาะแนวลึก", pos: "RAM", x: 550, y: 345, heat: 98, desc: "Drifts inside, decisive final passes, shooting from distance." },
            { id: "cf", num: 15, role: "Complete Focal Striker", roleTh: "กองหน้าตัวเป้าเชื่อมเกม", pos: "CF", x: 670, y: 260, heat: 90, desc: "Pins center-backs, makes deep runs and links with double 10s." }
          ],
          passes: [
            { from: "gk", to: "ccb", weight: 4 },
            { from: "ccb", to: "lcb", weight: 6 },
            { from: "ccb", to: "rcb", weight: 6 },
            { from: "lcb", to: "lcm", weight: 8 },
            { from: "rcb", to: "rcm", weight: 8 },
            { from: "lcm", to: "rcm", weight: 9 },
            { from: "lcm", to: "lwb", weight: 7 },
            { from: "rcm", to: "rwb", weight: 7 },
            { from: "lcm", to: "lam", weight: 9 },
            { from: "rcm", to: "ram", weight: 9 },
            { from: "lam", to: "ram", weight: 7 },
            { from: "lam", to: "cf", weight: 8 },
            { from: "ram", to: "cf", weight: 8 },
            { from: "lwb", to: "lam", weight: 6 },
            { from: "rwb", to: "ram", weight: 6 },
            { from: "rwb", to: "cf", weight: 5 }
          ],
          tacticalDirectives: [
            { title: "Box Midfield Overload (3+2 / 2+3)", titleTh: "การโอเวอร์โหลดแดนกลางทรงสี่เหลี่ยม (Box Midfield)", desc: "Double pivot (LCM/RCM) and twin #10s form a 4-man numerical superiority centrally.", descTh: "คู่กองกลางและเพลย์เมกเกอร์คู่หน้าสร้างความได้เปรียบเชิงตัวเลข 4 คนตรงกลางสนาม" },
            { title: "Wing-Back Maximum Width", titleTh: "วิงแบ็กยืนถ่างกว้างสุดเส้นข้าง", desc: "Isolates wing-backs 1v1 against opposing full-backs, stretching low blocks.", descTh: "ดึงแนวรับคู่แข่งให้เปิดช่องว่างด้วยการให้วิงแบ็กยืนชิดริมเส้นทั้งสองฝั่ง" },
            { title: "Immediate 6-Second Counter-Press", titleTh: "เคาน์เตอร์เพรสซิ่งแย่งบอลคืนใน 6 วินาที", desc: "High defensive block immediately suffocates opposing transitions upon loss of possession.", descTh: "รุมบีบพื้นที่ทันทีที่เสียการครอบครองบอลเพื่อตัดโอกาสสวนกลับ" }
          ]
        },
        "3-4-3": {
          label: "3-4-3 (Wide Wing Attack)",
          labelTh: "3-4-3 (เน้นเกมริมเส้นและการสลับตำแหน่ง)",
          description: "High-tempo attacking width with wide wingers pinning fullbacks and aggressive overlapping wingbacks.",
          descriptionTh: "เน้นปีกริมเส้นตัวรุกยืนสูงเพื่อโจมตีแนวรับคู่แข่งจากด้านข้าง และมีวิงแบ็กช่วยซ้อน",
          metrics: {
            possession: "63.8%",
            ppda: "8.4",
            halfSpaceIndex: "84%",
            defensiveLine: "47.0m",
            restDefense: "3 + 2 Wide Cover"
          },
          players: [
            { id: "gk", num: 1, role: "Sweeper Keeper", roleTh: "ผู้รักษาประตู", pos: "GK", x: 80, y: 260, heat: 40, desc: "Build-up distributor." },
            { id: "lcb", num: 6, role: "Wide CB (Left)", roleTh: "เซ็นเตอร์แบ็กซ้าย", pos: "LCB", x: 190, y: 140, heat: 70, desc: "Cover left flank." },
            { id: "ccb", num: 26, role: "Central CB", roleTh: "เซ็นเตอร์แบ็กตัวกลาง", pos: "CCB", x: 175, y: 260, heat: 65, desc: "Aerial & spatial dominance." },
            { id: "rcb", num: 2, role: "Wide CB (Right)", roleTh: "เซ็นเตอร์แบ็กขวา", pos: "RCB", x: 190, y: 380, heat: 70, desc: "Cover right flank." },
            { id: "lwb", num: 3, role: "Wing-Back (L)", roleTh: "วิงแบ็กซ้าย", pos: "LWB", x: 390, y: 65, heat: 85, desc: "Wide overlaps." },
            { id: "lcm", num: 25, role: "Central Midfielder", roleTh: "มิดฟิลด์กลาง", pos: "LCM", x: 340, y: 190, heat: 82, desc: "Ball retention." },
            { id: "rcm", num: 8, role: "Central Midfielder", roleTh: "มิดฟิลด์กลาง", pos: "RCM", x: 340, y: 330, heat: 82, desc: "Pressing engine." },
            { id: "rwb", num: 24, role: "Wing-Back (R)", roleTh: "วิงแบ็กขวา", pos: "RWB", x: 390, y: 455, heat: 86, desc: "Wing crossings." },
            { id: "lw", num: 11, role: "Inside Forward (L)", roleTh: "ปีกซ้ายตัดเข้าใน", pos: "LW", x: 570, y: 110, heat: 92, desc: "Direct 1v1 take-ons." },
            { id: "rw", num: 7, role: "Inside Forward (R)", roleTh: "ปีกขวาตัดเข้าใน", pos: "RW", x: 570, y: 410, heat: 93, desc: "Cutting inside to shoot." },
            { id: "cf", num: 15, role: "Target Forward", roleTh: "กองหน้าตัวเป้า", pos: "CF", x: 670, y: 260, heat: 88, desc: "Box target & finishing." }
          ],
          passes: [
            { from: "gk", to: "ccb", weight: 5 },
            { from: "ccb", to: "lcm", weight: 7 },
            { from: "ccb", to: "rcm", weight: 7 },
            { from: "lcm", to: "lw", weight: 8 },
            { from: "rcm", to: "rw", weight: 8 },
            { from: "lwb", to: "lw", weight: 8 },
            { from: "rwb", to: "rw", weight: 8 },
            { from: "lw", to: "cf", weight: 9 },
            { from: "rw", to: "cf", weight: 9 }
          ],
          tacticalDirectives: [
            { title: "Wing Isolations", titleTh: "การโดดเดี่ยวตัวต่อตัวริมเส้น", desc: "Force 1v1 situations on flanks for technical wingers.", descTh: "สร้างสถานการณ์ 1 ต่อ 1 ให้ปีกริมเส้นเลี้ยงกินตัว" },
            { title: "Staggered Overlaps", titleTh: "การเติมเกมซ้อนเหลื่อม", desc: "Wing-backs overlap while wingers drift into the box.", descTh: "วิงแบ็กเติมเกมด้านนอกขณะที่ปีกหุบเข้ากรอบเขตโทษ" }
          ]
        },
        "4-2-3-1": {
          label: "4-2-3-1 (Balanced Controlled Structure)",
          labelTh: "4-2-3-1 (โครงสร้างสมดุลและการครองเกม)",
          description: "Solid 4-chain defense with dual pivot stability and an advanced playmaker orchestrating between the lines.",
          descriptionTh: "แผงหลัง 4 คนพร้อมมิดฟิลด์คู่กลางคอยคุมพื้นที่ และมีเพลย์เมกเกอร์เบอร์ 10 ยืนระหว่างไลน์",
          metrics: {
            possession: "62.1%",
            ppda: "9.1",
            halfSpaceIndex: "78%",
            defensiveLine: "45.2m",
            restDefense: "2 + 2 Pivot Screen"
          },
          players: [
            { id: "gk", num: 1, role: "Goalkeeper", roleTh: "ผู้รักษาประตู", pos: "GK", x: 80, y: 260, heat: 40, desc: "Goal prevention & distribution." },
            { id: "lb", num: 3, role: "Full-Back (Left)", roleTh: "แบ็กซ้าย", pos: "LB", x: 230, y: 80, heat: 75, desc: "Balanced fullback." },
            { id: "lcb", num: 6, role: "Center-Back (Left)", roleTh: "เซ็นเตอร์แบ็กซ้าย", pos: "LCB", x: 200, y: 190, heat: 70, desc: "Cover & tackle." },
            { id: "rcb", num: 2, role: "Center-Back (Right)", roleTh: "เซ็นเตอร์แบ็กขวา", pos: "RCB", x: 200, y: 330, heat: 70, desc: "Aerial & duel winner." },
            { id: "rb", num: 24, role: "Full-Back (Right)", roleTh: "แบ็กขวา", pos: "RB", x: 230, y: 440, heat: 80, desc: "Overlapping runs." },
            { id: "ldm", num: 25, role: "Defensive Pivot", roleTh: "มิดฟิลด์ตัวรับ", pos: "LDM", x: 360, y: 200, heat: 85, desc: "Screening defense." },
            { id: "rdm", num: 8, role: "Deep Playmaker", roleTh: "มิดฟิลด์ตัวคุมบอล", pos: "RDM", x: 360, y: 320, heat: 86, desc: "Switching play." },
            { id: "cam", num: 10, role: "Attacking Midfielder (#10)", roleTh: "เพลย์เมกเกอร์ตัวรุก", pos: "CAM", x: 520, y: 260, heat: 94, desc: "Free role behind striker." },
            { id: "lam", num: 11, role: "Left Winger", roleTh: "ปีกซ้าย", pos: "LW", x: 520, y: 110, heat: 88, desc: "Diagonal runs." },
            { id: "ram", num: 20, role: "Right Winger", roleTh: "ปีกขวา", pos: "RW", x: 520, y: 410, heat: 90, desc: "Cut inside to assist." },
            { id: "cf", num: 15, role: "Striker", roleTh: "กองหน้า", pos: "CF", x: 670, y: 260, heat: 88, desc: "Finishing & pressing." }
          ],
          passes: [
            { from: "gk", to: "lcb", weight: 5 },
            { from: "gk", to: "rcb", weight: 5 },
            { from: "lcb", to: "ldm", weight: 8 },
            { from: "rcb", to: "rdm", weight: 8 },
            { from: "ldm", to: "cam", weight: 9 },
            { from: "rdm", to: "cam", weight: 9 },
            { from: "cam", to: "cf", weight: 9 },
            { from: "cam", to: "lam", weight: 7 },
            { from: "cam", to: "ram", weight: 7 }
          ],
          tacticalDirectives: [
            { title: "Double Pivot Screen", titleTh: "แผงสกรีนมิดฟิลด์คู่กลาง", desc: "Protects against direct counter-attacks.", descTh: "ตัดจังหวะการโต้กลับเร็วของคู่แข่ง" }
          ]
        }
      }
    },
    sonia_bompastor: {
      name: "Sonia Bompastor",
      nameTh: "โซเนีย บอมพาสเตอร์",
      title: "Women's Head Coach",
      titleTh: "เฮดโค้ชทีมหญิง",
      team: "women",
      color: "#f472b6",
      accent: "#C2185B",
      defaultFormation: "4-3-3",
      formations: {
        "4-3-3": {
          label: "4-3-3 (Aggressive Direct Dominance)",
          labelTh: "4-3-3 (เกมรุกดุดันและการเพรสซิ่งสูง)",
          description: "High-octane pressing, inverted wingers, and vertical transitions that won the Domestic Treble and 22-game WSL unbeaten streak.",
          descriptionTh: "การเพรสซิ่งแดนบนอย่างดุดัน ปีกตัวรุกตัดเข้าทำประตู และการสลับตำแหน่งที่รวดเร็ว สร้างสถิติไร้พ่าย 22 นัดใน WSL",
          metrics: {
            possession: "68.2%",
            ppda: "6.9 (Fierce Pressing)",
            halfSpaceIndex: "90%",
            defensiveLine: "52.0m",
            restDefense: "2 + 1 Single Pivot Anchor"
          },
          players: [
            { id: "gk", num: 1, role: "Goalkeeper", roleTh: "ผู้รักษาประตู", pos: "GK", x: 80, y: 260, heat: 40, desc: "High line sweeper." },
            { id: "lb", num: 7, role: "Attacking Fullback (L)", roleTh: "แบ็กซ้ายตัวบุก", pos: "LB", x: 260, y: 75, heat: 88, desc: "High overlap & crossing." },
            { id: "lcb", num: 4, role: "Center-Back (L)", roleTh: "เซ็นเตอร์แบ็กซ้าย", pos: "LCB", x: 200, y: 180, heat: 72, desc: "Physical dominance." },
            { id: "rcb", num: 26, role: "Center-Back (R)", roleTh: "เซ็นเตอร์แบ็กขวา", pos: "RCB", x: 200, y: 340, heat: 72, desc: "Line-breaking passes." },
            { id: "rb", num: 22, role: "Attacking Fullback (R)", roleTh: "แบ็กขวาตัวบุก", pos: "RB", x: 260, y: 445, heat: 86, desc: "Flank support." },
            { id: "dm", num: 5, role: "Single Anchor Pivot", roleTh: "มิดฟิลด์ตัวรับตัวตัดเกม", pos: "DM", x: 340, y: 260, heat: 90, desc: "Destroys counter-attacks." },
            { id: "lcm", num: 11, role: "Mezzala (Left Half-Space)", roleTh: "มิดฟิลด์ตัวรุกซ้าย", pos: "LCM", x: 440, y: 165, heat: 94, desc: "Half-space surges." },
            { id: "rcm", num: 10, role: "Advanced Playmaker", roleTh: "เพลย์เมกเกอร์ตัวปั้นเกม", pos: "RCM", x: 440, y: 355, heat: 95, desc: "Decisive assists." },
            { id: "lw", num: 23, role: "Inverted Winger (L)", roleTh: "ปีกซ้ายตัดเข้ายิง", pos: "LW", x: 570, y: 100, heat: 96, desc: "Inside goal threats." },
            { id: "rw", num: 9, role: "Inverted Winger (R)", roleTh: "ปีกขวาตัดเข้ายิง", pos: "RW", x: 570, y: 420, heat: 95, desc: "Cutback delivery." },
            { id: "cf", num: 20, role: "Elite Dynamic Striker", roleTh: "กองหน้าดาวยิงตัวเป้า", pos: "CF", x: 670, y: 260, heat: 98, desc: "Lethal in-the-box finishing." }
          ],
          passes: [
            { from: "gk", to: "lcb", weight: 5 },
            { from: "gk", to: "rcb", weight: 5 },
            { from: "lcb", to: "dm", weight: 8 },
            { from: "rcb", to: "dm", weight: 8 },
            { from: "dm", to: "lcm", weight: 9 },
            { from: "dm", to: "rcm", weight: 9 },
            { from: "lcm", to: "lw", weight: 9 },
            { from: "rcm", to: "rw", weight: 9 },
            { from: "lcm", to: "cf", weight: 8 },
            { from: "rcm", to: "cf", weight: 8 },
            { from: "lw", to: "cf", weight: 10 },
            { from: "rw", to: "cf", weight: 10 }
          ],
          tacticalDirectives: [
            { title: "Aggressive High-Line Suffocation", titleTh: "การดันไลน์สูงปิดพื้นที่คู่แข่ง", desc: "Defends 50+ meters away from own goal to trap opposition.", descTh: "ดันแผงหลังสูงกว่า 50 เมตรเพื่อบีบไม่ให้คู่แข่งตั้งเกมได้" },
            { title: "Dual Mezzala Overloads", titleTh: "การสอดเข้าทำของมิดฟิลด์เบอร์ 8", desc: "LCM and RCM sprint into the box to outnumber defenders.", descTh: "กองกลางตัวรุกสองคนสอดเข้ากรอบเขตโทษเพื่อสร้างตัวเลือกในการทำประตู" }
          ]
        },
        "4-2-3-1": {
          label: "4-2-3-1 (Double Pivot Control)",
          labelTh: "4-2-3-1 (การควบคุมเกมด้วยมิดฟิลด์คู่)",
          description: "Dual defensive pivots shielding the center with a free roaming playmaker in the hole.",
          descriptionTh: "ใช้กองกลางคู่ช่วยคุมพื้นที่กลางสนาม เปิดทางให้เบอร์ 10 เล่นอย่างอิสระ",
          metrics: {
            possession: "65.5%",
            ppda: "7.6",
            halfSpaceIndex: "85%",
            defensiveLine: "48.0m",
            restDefense: "2 + 2 Shield"
          },
          players: [
            { id: "gk", num: 1, role: "Goalkeeper", roleTh: "ผู้รักษาประตู", pos: "GK", x: 80, y: 260, heat: 40, desc: "Solid distribution." },
            { id: "lb", num: 7, role: "Fullback (L)", roleTh: "แบ็กซ้าย", pos: "LB", x: 230, y: 80, heat: 80, desc: "Left width." },
            { id: "lcb", num: 4, role: "CB (L)", roleTh: "เซ็นเตอร์แบ็กซ้าย", pos: "LCB", x: 200, y: 190, heat: 70, desc: "Coverage." },
            { id: "rcb", num: 26, role: "CB (R)", roleTh: "เซ็นเตอร์แบ็กขวา", pos: "RCB", x: 200, y: 330, heat: 70, desc: "Progression." },
            { id: "rb", num: 22, role: "Fullback (R)", roleTh: "แบ็กขวา", pos: "RB", x: 230, y: 440, heat: 80, desc: "Right width." },
            { id: "ldm", num: 5, role: "Ball Winner", roleTh: "มิดฟิลด์ตัดบอล", pos: "LDM", x: 350, y: 200, heat: 86, desc: "Tackles." },
            { id: "rdm", num: 11, role: "Deep Playmaker", roleTh: "มิดฟิลด์สร้างสรรค์", pos: "RDM", x: 350, y: 320, heat: 86, desc: "Passes." },
            { id: "cam", num: 10, role: "Playmaker", roleTh: "เพลย์เมกเกอร์", pos: "CAM", x: 500, y: 260, heat: 94, desc: "Key passes." },
            { id: "lw", num: 23, role: "Winger (L)", roleTh: "ปีกซ้าย", pos: "LW", x: 520, y: 110, heat: 90, desc: "Dribbles." },
            { id: "rw", num: 9, role: "Winger (R)", roleTh: "ปีกขวา", pos: "RW", x: 520, y: 410, heat: 90, desc: "Cutbacks." },
            { id: "cf", num: 20, role: "Striker", roleTh: "กองหน้า", pos: "CF", x: 670, y: 260, heat: 95, desc: "Goals." }
          ],
          passes: [
            { from: "gk", to: "lcb", weight: 5 },
            { from: "lcb", to: "ldm", weight: 8 },
            { from: "ldm", to: "cam", weight: 9 },
            { from: "cam", to: "cf", weight: 9 }
          ],
          tacticalDirectives: [
            { title: "Double Pivot Stability", titleTh: "ความมั่นคงของคู่มิดฟิลด์", desc: "Prevents direct counter-attacks.", descTh: "ปิดช่องว่างหน้าแผงหลัง" }
          ]
        }
      }
    }
  };

  // State
  let currentManagerKey = "xabi_alonso";
  let currentFormationKey = "3-4-2-1";
  let currentViewMode = "heatmap"; // 'heatmap' | 'attack' | 'press' | 'network'
  let showZones = true;
  let selectedPlayerId = null;

  // Initialize D3 Tactical Heatmap Engine
  function initTacticalHeatmap() {
    const container = document.getElementById("tacticalHeatmapCanvasWrapper");
    if (!container) return;

    // Check if D3 is ready
    if (typeof d3 === "undefined") {
      // Lazy load D3 if not yet present
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/d3@7";
      script.onload = () => {
        renderTacticalHeatmap();
        bindTacticalEvents();
      };
      document.head.appendChild(script);
    } else {
      renderTacticalHeatmap();
      bindTacticalEvents();
    }
  }

  // Bind UI control events
  function bindTacticalEvents() {
    // Manager toggle buttons
    document.querySelectorAll(".tactical-manager-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".tactical-manager-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentManagerKey = this.getAttribute("data-manager");
        const managerData = TACTICAL_DB[currentManagerKey];
        currentFormationKey = managerData.defaultFormation;
        selectedPlayerId = null;
        updateFormationSelectorUI();
        renderTacticalHeatmap();
      });
    });

    // View Mode buttons
    document.querySelectorAll(".tactical-mode-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".tactical-mode-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentViewMode = this.getAttribute("data-mode");
        renderTacticalHeatmap();
      });
    });

    // Toggle Grid button
    const gridToggle = document.getElementById("tacticalGridToggle");
    if (gridToggle) {
      gridToggle.addEventListener("click", function() {
        showZones = !showZones;
        this.classList.toggle("active", showZones);
        const isTh = (window.currentLang || "th") === "th";
        this.innerHTML = showZones
          ? `<span>📐</span> <span>${isTh ? "ซ่อน Tactical Zones" : "Hide Tactical Zones"}</span>`
          : `<span>📐</span> <span>${isTh ? "แสดง Tactical Zones" : "Show Tactical Zones"}</span>`;
        renderTacticalHeatmap();
      });
    }

    // Formation buttons (delegated)
    const formationContainer = document.getElementById("tacticalFormationPills");
    if (formationContainer) {
      formationContainer.addEventListener("click", function(e) {
        const btn = e.target.closest(".tactical-formation-pill");
        if (!btn) return;
        document.querySelectorAll(".tactical-formation-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFormationKey = btn.getAttribute("data-formation");
        selectedPlayerId = null;
        renderTacticalHeatmap();
      });
    }

    // Reset inspection on background click
    const canvasWrap = document.getElementById("tacticalHeatmapCanvasWrapper");
    if (canvasWrap) {
      canvasWrap.addEventListener("click", function(e) {
        if (!e.target.closest(".player-tactical-node")) {
          selectedPlayerId = null;
          d3.selectAll(".player-tactical-node").classed("node-active", false);
          updatePlayerInspectorUI(null);
        }
      });
    }
  }

  // Update Formation selector pills based on selected manager
  function updateFormationSelectorUI() {
    const managerData = TACTICAL_DB[currentManagerKey];
    const pillsContainer = document.getElementById("tacticalFormationPills");
    if (!pillsContainer || !managerData) return;

    const isTh = (window.currentLang || "th") === "th";
    const formations = Object.keys(managerData.formations);

    pillsContainer.innerHTML = formations.map(fKey => {
      const f = managerData.formations[fKey];
      const isActive = fKey === currentFormationKey ? "active" : "";
      return `
        <button type="button" class="tactical-formation-pill ${isActive}" data-formation="${fKey}" style="border-color: ${managerData.color}40;">
          <span class="formation-name">${fKey}</span>
          <span class="formation-sub">${isTh ? f.labelTh.split("(")[1]?.replace(")", "") || fKey : f.label.split("(")[1]?.replace(")", "") || fKey}</span>
        </button>
      `;
    }).join("");
  }

  // Main D3 Render Function
  function renderTacticalHeatmap() {
    if (typeof d3 === "undefined") return;

    const container = document.getElementById("tacticalHeatmapCanvasWrapper");
    if (!container) return;

    const isTh = (window.currentLang || "th") === "th";
    const managerData = TACTICAL_DB[currentManagerKey];
    const formationData = managerData.formations[currentFormationKey] || managerData.formations[managerData.defaultFormation];

    // Clear previous SVG
    container.innerHTML = "";

    // Dimensions
    const width = 800;
    const height = 520;
    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    const pitchW = width - margin.left - margin.right;
    const pitchH = height - margin.top - margin.bottom;

    // Create SVG Canvas
    const svg = d3.select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("class", "tactical-d3-pitch-svg")
      .style("width", "100%")
      .style("height", "auto")
      .style("display", "block");

    // Defs for gradients, filters, markers
    const defs = svg.append("defs");

    // Turf stripe pattern
    const stripePattern = defs.append("pattern")
      .attr("id", "pitchTurfPattern")
      .attr("width", 80)
      .attr("height", pitchH)
      .attr("patternUnits", "userSpaceOnUse");

    stripePattern.append("rect")
      .attr("width", 40)
      .attr("height", pitchH)
      .attr("fill", "#0f2e1b");

    stripePattern.append("rect")
      .attr("x", 40)
      .attr("width", 40)
      .attr("height", pitchH)
      .attr("fill", "#133821");

    // Passing Arrow Marker
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", managerData.color);

    // Glow filter
    const glowFilter = defs.append("filter")
      .attr("id", "heatGlow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", "8")
      .attr("result", "coloredBlur");

    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Main Pitch Group
    const pitchG = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Pitch Background Turf
    pitchG.append("rect")
      .attr("width", pitchW)
      .attr("height", pitchH)
      .attr("rx", 10)
      .attr("fill", "url(#pitchTurfPattern)")
      .attr("stroke", "rgba(255,255,255,0.15)")
      .attr("stroke-width", 2);

    // Vignette lighting
    pitchG.append("rect")
      .attr("width", pitchW)
      .attr("height", pitchH)
      .attr("rx", 10)
      .attr("fill", "none")
      .attr("style", "box-shadow: inset 0 0 40px rgba(0,0,0,0.8);");

    // Draw Pitch Markings (White lines)
    drawPitchMarkings(pitchG, pitchW, pitchH);

    // Draw Tactical 18-Zone Grid (Optional overlay)
    if (showZones) {
      drawTacticalZones(pitchG, pitchW, pitchH, isTh);
    }

    // Render Heatmap Layer (D3 2D Density Gaussian Mesh)
    const heatG = pitchG.append("g").attr("class", "heatmap-layer");
    renderHeatmapLayer(heatG, formationData.players, pitchW, pitchH, currentViewMode, managerData);

    // Render Tactical Movement & Passing Network
    const vectorG = pitchG.append("g").attr("class", "vector-layer");
    if (currentViewMode === "attack" || currentViewMode === "network") {
      renderPassingVectors(vectorG, formationData.players, formationData.passes, managerData, currentViewMode);
    } else if (currentViewMode === "press") {
      renderPressingZones(vectorG, pitchW, pitchH, managerData, isTh);
    }

    // Render Player Nodes
    const playerG = pitchG.append("g").attr("class", "players-layer");
    renderPlayerNodes(playerG, formationData.players, managerData, isTh);

    // Update Tactical KPI & Directives Card
    updateTacticalMetricsUI(managerData, formationData, isTh);
  }

  // Draw Standard Football Pitch Markings
  function drawPitchMarkings(g, w, h) {
    const lineCol = "rgba(255, 255, 255, 0.45)";
    const lw = 1.8;

    // Pitch outline
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Halfway line
    g.append("line")
      .attr("x1", w / 2)
      .attr("y1", 0)
      .attr("x2", w / 2)
      .attr("y2", h)
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Center circle
    g.append("circle")
      .attr("cx", w / 2)
      .attr("cy", h / 2)
      .attr("r", 65)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Center spot
    g.append("circle")
      .attr("cx", w / 2)
      .attr("cy", h / 2)
      .attr("r", 3.5)
      .attr("fill", lineCol);

    // Left Penalty Box
    const boxW = 120;
    const boxH = 240;
    const boxY = (h - boxH) / 2;
    g.append("rect")
      .attr("x", 0)
      .attr("y", boxY)
      .attr("width", boxW)
      .attr("height", boxH)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Left 6-Yard Box
    const sixW = 42;
    const sixH = 120;
    const sixY = (h - sixH) / 2;
    g.append("rect")
      .attr("x", 0)
      .attr("y", sixY)
      .attr("width", sixW)
      .attr("height", sixH)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Left Penalty Spot & Arc
    g.append("circle").attr("cx", 84).attr("cy", h / 2).attr("r", 3.5).attr("fill", lineCol);
    g.append("path")
      .attr("d", `M ${boxW} ${h / 2 - 45} A 55 55 0 0 1 ${boxW} ${h / 2 + 45}`)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Right Penalty Box (Opponent)
    g.append("rect")
      .attr("x", w - boxW)
      .attr("y", boxY)
      .attr("width", boxW)
      .attr("height", boxH)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Right 6-Yard Box
    g.append("rect")
      .attr("x", w - sixW)
      .attr("y", sixY)
      .attr("width", sixW)
      .attr("height", sixH)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Right Penalty Spot & Arc
    g.append("circle").attr("cx", w - 84).attr("cy", h / 2).attr("r", 3.5).attr("fill", lineCol);
    g.append("path")
      .attr("d", `M ${w - boxW} ${h / 2 - 45} A 55 55 0 0 0 ${w - boxW} ${h / 2 + 45}`)
      .attr("fill", "none")
      .attr("stroke", lineCol)
      .attr("stroke-width", lw);

    // Corner Arcs
    const cr = 14;
    g.append("path").attr("d", `M 0 ${cr} A ${cr} ${cr} 0 0 0 ${cr} 0`).attr("fill", "none").attr("stroke", lineCol).attr("stroke-width", lw);
    g.append("path").attr("d", `M 0 ${h - cr} A ${cr} ${cr} 0 0 1 ${cr} ${h}`).attr("fill", "none").attr("stroke", lineCol).attr("stroke-width", lw);
    g.append("path").attr("d", `M ${w - cr} 0 A ${cr} ${cr} 0 0 0 ${w} ${cr}`).attr("fill", "none").attr("stroke", lineCol).attr("stroke-width", lw);
    g.append("path").attr("d", `M ${w - cr} ${h} A ${cr} ${cr} 0 0 1 ${w} ${h - cr}`).attr("fill", "none").attr("stroke", lineCol).attr("stroke-width", lw);

    // Direction of Attack Arrow
    g.append("text")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.4)")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("letter-spacing", "1.5px")
      .text("ATTACKING DIRECTION  ➔");
  }

  // Draw 18 Tactical Zones Grid (Half-spaces, Zone 14)
  function drawTacticalZones(g, w, h, isTh) {
    const zoneG = g.append("g").attr("class", "tactical-zones-overlay");
    const cols = 6;
    const colW = w / cols;
    const rows = [0, h * 0.22, h * 0.40, h * 0.60, h * 0.78, h];

    // Longitudinal grid lines
    for (let i = 1; i < cols; i++) {
      zoneG.append("line")
        .attr("x1", i * colW)
        .attr("y1", 0)
        .attr("x2", i * colW)
        .attr("y2", h)
        .attr("stroke", "rgba(56, 189, 248, 0.12)")
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-width", 1);
    }

    // Latitudinal grid lines (Flanks & Half-spaces)
    [h * 0.22, h * 0.78].forEach(y => {
      zoneG.append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", w)
        .attr("y2", y)
        .attr("stroke", "rgba(56, 189, 248, 0.15)")
        .attr("stroke-dasharray", "6,4")
        .attr("stroke-width", 1.2);
    });

    // Highlight Zone 14 (Golden Attacking Area)
    const z14X = 4 * colW;
    const z14W = colW;
    const z14Y = h * 0.22;
    const z14H = h * 0.56;

    zoneG.append("rect")
      .attr("x", z14X)
      .attr("y", z14Y)
      .attr("width", z14W)
      .attr("height", z14H)
      .attr("fill", "rgba(234, 179, 8, 0.07)")
      .attr("stroke", "rgba(234, 179, 8, 0.35)")
      .attr("stroke-dasharray", "3,3")
      .attr("rx", 4);

    zoneG.append("text")
      .attr("x", z14X + z14W / 2)
      .attr("y", z14Y + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#facc15")
      .attr("font-size", "9px")
      .attr("font-weight", "700")
      .attr("letter-spacing", "0.5px")
      .text("ZONE 14");

    // Label Half-Spaces
    zoneG.append("text")
      .attr("x", z14X + z14W / 2)
      .attr("y", h * 0.14)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(56, 189, 248, 0.6)")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .text(isTh ? "L. HALF-SPACE" : "L. HALF-SPACE");

    zoneG.append("text")
      .attr("x", z14X + z14W / 2)
      .attr("y", h * 0.88)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(56, 189, 248, 0.6)")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .text(isTh ? "R. HALF-SPACE" : "R. HALF-SPACE");
  }

  // Render D3 Heatmap Gaussian Radial Mesh
  function renderHeatmapLayer(g, players, w, h, mode, managerData) {
    const defs = d3.select(g.node().nearestViewportElement).select("defs");

    // Dynamic color gradient based on mode
    let colorStops = [
      { offset: "0%", color: "rgba(239, 68, 68, 0.85)" },   // Red hot center
      { offset: "35%", color: "rgba(249, 115, 22, 0.65)" }, // Orange
      { offset: "65%", color: "rgba(234, 179, 8, 0.40)" },  // Yellow
      { offset: "85%", color: "rgba(56, 189, 248, 0.20)" }, // Light blue
      { offset: "100%", color: "rgba(0, 0, 0, 0)" }         // Transparent
    ];

    if (mode === "press") {
      colorStops = [
        { offset: "0%", color: "rgba(225, 29, 72, 0.9)" },
        { offset: "40%", color: "rgba(244, 63, 94, 0.6)" },
        { offset: "70%", color: "rgba(251, 113, 133, 0.3)" },
        { offset: "100%", color: "rgba(0, 0, 0, 0)" }
      ];
    }

    players.forEach((p, idx) => {
      const gradId = `heatGrad_${p.id}_${idx}`;
      const grad = defs.append("radialGradient")
        .attr("id", gradId)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");

      colorStops.forEach(st => {
        grad.append("stop")
          .attr("offset", st.offset)
          .attr("stop-color", st.color);
      });

      // Calculate heat radius based on role and heat rating
      let radius = (p.heat / 100) * 85 + 35;
      let opacity = (p.heat / 100) * 0.75 + 0.15;

      if (mode === "attack" && p.x < 300) {
        radius *= 0.6;
        opacity *= 0.5;
      }

      g.append("circle")
        .attr("cx", p.x)
        .attr("cy", p.y)
        .attr("r", radius)
        .attr("fill", `url(#${gradId})`)
        .attr("opacity", opacity)
        .attr("class", `heat-blob heat-blob-${p.id}`)
        .style("mix-blend-mode", "screen")
        .style("pointer-events", "none");
    });
  }

  // Render Passing Links & Attack Vectors
  function renderPassingVectors(g, players, passes, managerData, mode) {
    if (!passes || passes.length === 0) return;

    const pMap = new Map();
    players.forEach(p => pMap.set(p.id, p));

    passes.forEach((pass, i) => {
      const source = pMap.get(pass.from);
      const target = pMap.get(pass.to);
      if (!source || !target) return;

      const strokeW = Math.max(1.5, pass.weight * 0.6);

      // Curved or straight passing line
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.3;

      const path = g.append("path")
        .attr("d", `M ${source.x} ${source.y} A ${dr} ${dr} 0 0,1 ${target.x} ${target.y}`)
        .attr("fill", "none")
        .attr("stroke", managerData.color)
        .attr("stroke-width", strokeW)
        .attr("stroke-opacity", 0.55)
        .attr("stroke-dasharray", mode === "attack" ? "6,4" : "none")
        .attr("marker-end", mode === "attack" ? "url(#arrowhead)" : "none")
        .attr("class", `pass-link pass-${pass.from}-${pass.to}`);

      // Animate attack flow if in attack mode
      if (mode === "attack") {
        animatePathFlow(path);
      }
    });
  }

  // Animate dashed lines
  function animatePathFlow(path) {
    path.attr("stroke-dashoffset", 0)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", -20)
      .on("end", function() {
        animatePathFlow(d3.select(this));
      });
  }

  // Render High Pressing Zones
  function renderPressingZones(g, w, h, managerData, isTh) {
    const pressZones = [
      { x: 520, y: 80, r: 75, intensity: "High Press (92%)", label: isTh ? "โซนบีบกดดันซ้าย" : "L. Flank Trap" },
      { x: 550, y: 260, r: 85, intensity: "Central Suffocation (96%)", label: isTh ? "โซนตัดบอลกลางสนาม" : "Central Trap" },
      { x: 520, y: 440, r: 75, intensity: "High Press (91%)", label: isTh ? "โซนบีบกดดันขวา" : "R. Flank Trap" }
    ];

    pressZones.forEach(z => {
      g.append("circle")
        .attr("cx", z.x)
        .attr("cy", z.y)
        .attr("r", z.r)
        .attr("fill", "rgba(225, 29, 72, 0.18)")
        .attr("stroke", "#f43f5e")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("class", "pressing-zone-pulse");

      g.append("text")
        .attr("x", z.x)
        .attr("y", z.y - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#fecdd3")
        .attr("font-size", "11px")
        .attr("font-weight", "700")
        .text("⚡ " + z.label);

      g.append("text")
        .attr("x", z.x)
        .attr("y", z.y + 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#fda4af")
        .attr("font-size", "9px")
        .attr("font-weight", "600")
        .text(z.intensity);
    });
  }

  // Render Interactive Player Nodes
  function renderPlayerNodes(g, players, managerData, isTh) {
    const nodeGroups = g.selectAll(".player-tactical-node")
      .data(players)
      .enter()
      .append("g")
      .attr("class", "player-tactical-node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .style("cursor", "pointer");

    // Outer Halo Pulse
    nodeGroups.append("circle")
      .attr("r", 19)
      .attr("fill", managerData.color)
      .attr("opacity", 0.25)
      .attr("class", "node-halo");

    // Main Circle
    nodeGroups.append("circle")
      .attr("r", 15)
      .attr("fill", "#051329")
      .attr("stroke", managerData.color)
      .attr("stroke-width", 2.5)
      .attr("class", "node-core");

    // Jersey Number / Initials
    nodeGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "4px")
      .attr("fill", "#ffffff")
      .attr("font-size", "11px")
      .attr("font-weight", "800")
      .attr("font-family", "'Space Mono', monospace")
      .text(d => d.num || d.pos);

    // Position Badge Label underneath
    nodeGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 26)
      .attr("fill", "#e0f2fe")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.9))")
      .text(d => d.pos);

    // Hover & Click Interactions
    nodeGroups
      .on("mouseenter", function(event, d) {
        d3.select(this).select(".node-halo").transition().duration(200).attr("r", 25).attr("opacity", 0.5);
        d3.select(this).select(".node-core").transition().duration(200).attr("fill", managerData.accent);
        
        // Highlight player heat blob
        d3.selectAll(`.heat-blob-${d.id}`).transition().duration(200).attr("opacity", 1.0);
        
        showTacticalTooltip(event, d, isTh);
      })
      .on("mouseleave", function(event, d) {
        if (selectedPlayerId !== d.id) {
          d3.select(this).select(".node-halo").transition().duration(200).attr("r", 19).attr("opacity", 0.25);
          d3.select(this).select(".node-core").transition().duration(200).attr("fill", "#051329");
          d3.selectAll(`.heat-blob-${d.id}`).transition().duration(200).attr("opacity", (d.heat / 100) * 0.75 + 0.15);
        }
        hideTacticalTooltip();
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        selectedPlayerId = d.id;
        d3.selectAll(".player-tactical-node").classed("node-active", false);
        d3.select(this).classed("node-active", true);
        updatePlayerInspectorUI(d, isTh);
      });
  }

  // Tactical Floating Tooltip
  function showTacticalTooltip(event, player, isTh) {
    let tooltip = document.getElementById("tacticalD3Tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "tacticalD3Tooltip";
      tooltip.className = "tactical-d3-floating-tooltip";
      document.body.appendChild(tooltip);
    }

    const roleText = isTh ? player.roleTh : player.role;
    tooltip.innerHTML = `
      <div class="tt-header">
        <span class="tt-num">#${player.num}</span>
        <span class="tt-pos">${player.pos}</span>
        <span class="tt-heat">🔥 ${player.heat}% Intensity</span>
      </div>
      <div class="tt-role">${roleText}</div>
      <div class="tt-desc">${player.desc}</div>
    `;

    tooltip.style.display = "block";
    tooltip.style.left = (event.pageX + 15) + "px";
    tooltip.style.top = (event.pageY - 20) + "px";
  }

  function hideTacticalTooltip() {
    const tooltip = document.getElementById("tacticalD3Tooltip");
    if (tooltip) {
      tooltip.style.display = "none";
    }
  }

  // Update Player Inspector Side/Bottom Panel
  function updatePlayerInspectorUI(player, isTh) {
    const inspector = document.getElementById("tacticalPlayerInspector");
    if (!inspector) return;

    if (!player) {
      inspector.innerHTML = `
        <div class="inspector-empty-state">
          <span>👆</span>
          <p>${isTh ? "คลิกที่ตำแหน่งนักเตะในสนามเพื่อดูบทบาทและหน้าที่เชิงแท็กติกอย่างละเอียด" : "Click any player position on the pitch to inspect detailed tactical instructions & metrics."}</p>
        </div>
      `;
      return;
    }

    const roleName = isTh ? player.roleTh : player.role;
    inspector.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-head">
          <div class="inspector-badge">#${player.num} ${player.pos}</div>
          <div>
            <div class="inspector-title">${roleName}</div>
            <div class="inspector-sub">${isTh ? "บทบาทเชิงตำแหน่ง" : "Positional Directive"}</div>
          </div>
          <div class="inspector-heat-pill">
            <span class="heat-icon">🔥</span>
            <span>${player.heat}% Activity</span>
          </div>
        </div>

        <p class="inspector-desc">${player.desc}</p>

        <div class="inspector-stat-grid">
          <div class="inspector-stat-box">
            <div class="stat-lbl">${isTh ? "ความหนาแน่นการสัมผัสบอล" : "Touch Density"}</div>
            <div class="stat-val">${player.heat}%</div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width: ${player.heat}%;"></div></div>
          </div>
          <div class="inspector-stat-box">
            <div class="stat-lbl">${isTh ? "การยืนตำแหน่งเฉลี่ย" : "Avg Position"}</div>
            <div class="stat-val">${player.pos} (X:${Math.round(player.x * 0.13)}m)</div>
            <div class="stat-bar"><div class="stat-bar-fill" style="width: ${Math.round((player.x / 800) * 100)}%;"></div></div>
          </div>
        </div>
      </div>
    `;
  }

  // Update Tactical KPI & Directives Card
  function updateTacticalMetricsUI(managerData, formationData, isTh) {
    // Metrics
    const m = formationData.metrics;
    if (document.getElementById("tactPossessionVal")) document.getElementById("tactPossessionVal").textContent = m.possession;
    if (document.getElementById("tactPpdaVal")) document.getElementById("tactPpdaVal").textContent = m.ppda;
    if (document.getElementById("tactHalfSpaceVal")) document.getElementById("tactHalfSpaceVal").textContent = m.halfSpaceIndex;
    if (document.getElementById("tactDefLineVal")) document.getElementById("tactDefLineVal").textContent = m.defensiveLine;
    if (document.getElementById("tactRestDefVal")) document.getElementById("tactRestDefVal").textContent = m.restDefense;

    // Formation description
    const descEl = document.getElementById("tacticalFormationDesc");
    if (descEl) {
      descEl.textContent = isTh ? formationData.descriptionTh : formationData.description;
    }

    // Tactical Directives List
    const dirContainer = document.getElementById("tacticalDirectivesList");
    if (dirContainer && formationData.tacticalDirectives) {
      dirContainer.innerHTML = formationData.tacticalDirectives.map(d => `
        <div class="tactical-directive-item">
          <div class="directive-title">
            <span class="dir-dot" style="background: ${managerData.color};"></span>
            <strong>${isTh ? d.titleTh : d.title}</strong>
          </div>
          <p class="directive-desc">${isTh ? d.descTh : d.desc}</p>
        </div>
      `).join("");
    }
  }

  // Lifecycle listeners
  document.addEventListener("DOMContentLoaded", () => {
    initTacticalHeatmap();
  });

  window.addEventListener("languageChanged", () => {
    updateFormationSelectorUI();
    renderTacticalHeatmap();
    const isTh = (window.currentLang || "th") === "th";
    const gridToggle = document.getElementById("tacticalGridToggle");
    if (gridToggle) {
      gridToggle.innerHTML = showZones
        ? `<span>📐</span> <span>${isTh ? "ซ่อน Tactical Zones" : "Hide Tactical Zones"}</span>`
        : `<span>📐</span> <span>${isTh ? "แสดง Tactical Zones" : "Show Tactical Zones"}</span>`;
    }
  });

  // Export for global access
  window.initTacticalHeatmap = initTacticalHeatmap;
  window.renderTacticalHeatmap = renderTacticalHeatmap;
})();
