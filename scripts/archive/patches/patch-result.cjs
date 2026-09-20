const fs = require('fs');
const path = './data/fixtures.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const matchIndex = data.findIndex(m => m.id === 'w_uwcl_2');
if (matchIndex !== -1) {
  data[matchIndex].status = "completed";
  data[matchIndex].home_score = 0;
  data[matchIndex].away_score = 1;
  data[matchIndex].goals = [
    {
      team: "away",
      player: "Keira Walsh",
      minute: "2nd Half"
    }
  ];
  data[matchIndex].events = [
    {
      type: "goal",
      team: "away",
      player: "Keira Walsh",
      minute: "2nd Half",
      detail: "Assist: Sandy Baltimore"
    }
  ];
  data[matchIndex].commentary = [
    {
      section: "Full Time / บทสรุปหลังเกม",
      events: [
        {
          minute: "FT",
          text: "รวมผลสองนัด (Aggregate): เชลซีชนะ 6-2 ผ่านเข้าสู่รอบต่อไปในศึกยูฟ่า วีเมนส์ แชมเปียนส์ลีก!"
        }
      ]
    }
  ];
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log("Match updated successfully.");
} else {
  console.log("Match not found!");
}
