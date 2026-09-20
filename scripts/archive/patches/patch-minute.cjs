const fs = require('fs');
const path = './data/fixtures.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const matchIndex = data.findIndex(m => m.id === 'w_uwcl_2');
if (matchIndex !== -1) {
  const goalIndex = data[matchIndex].goals.findIndex(g => g.player === 'Keira Walsh');
  if (goalIndex !== -1) {
    data[matchIndex].goals[goalIndex].minute = 54;
  }
  
  const eventIndex = data[matchIndex].events.findIndex(e => e.player === 'Keira Walsh' && e.type === 'goal');
  if (eventIndex !== -1) {
    data[matchIndex].events[eventIndex].minute = 54;
  }
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log("Goal minute updated successfully to 54.");
} else {
  console.log("Match not found!");
}
