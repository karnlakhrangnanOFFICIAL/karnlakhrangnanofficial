const fs = require('fs');

const playersFile = 'data/players-men.json';
const transfersFile = 'data/transfers_26_27.json';

const playersData = JSON.parse(fs.readFileSync(playersFile, 'utf8'));
const transfersData = JSON.parse(fs.readFileSync(transfersFile, 'utf8'));

// Create maps
const inMap = new Map(transfersData.categories.in.players.map(p => [p.player.toLowerCase(), p]));
const outMap = new Map(transfersData.categories.out_permanent.players.map(p => [p.player.toLowerCase(), p]));
const loanMap = new Map(transfersData.categories.loan_out.players.map(p => [p.player.toLowerCase(), p]));

// Update existing players
let updatedPlayers = playersData.map(p => {
  const lowerName = p.name.toLowerCase();
  
  if (outMap.has(lowerName)) {
    p.status = 'sold';
    p.transfer_to = outMap.get(lowerName).to;
  } else if (loanMap.has(lowerName)) {
    p.status = 'loaned_out';
    p.transfer_to = loanMap.get(lowerName).to;
  } else if (inMap.has(lowerName)) {
    p.status = 'new_signing';
  } else {
    p.status = 'active'; // Default
  }
  return p;
});

// Add missing incoming players
transfersData.categories.in.players.forEach(p => {
  const lowerName = p.player.toLowerCase();
  const exists = updatedPlayers.some(up => up.name.toLowerCase() === lowerName);
  if (!exists) {
    updatedPlayers.push({
      id: updatedPlayers.length > 0 ? Math.max(...updatedPlayers.map(u => u.id)) + 1 : 1,
      name: p.player,
      position: p.position,
      number: "",
      nationality: "",
      image: "assets/images/placeholder-player.svg",
      status: p.current_status && p.current_status.includes('loaned') ? 'loaned_out' : 'new_signing',
      transfer_to: p.current_status && p.current_status.includes('loaned') ? p.current_status.split('to ')[1] : undefined,
      biography_en: `Joined Chelsea from ${p.from} in 2026.`,
      biography_th: `ย้ายมาร่วมทีมเชลซีจาก ${p.from} ในปี 2026`
    });
  }
});

// Also add missing loan out players just in case they were left out? (Optional, maybe not needed if they were not in the first team squad JSON).
// Let's stick to the prompt.

// Sort: active > new_signing > loaned_out > sold (or whatever order makes sense)
// Or just return the array to let JS sort it. The user said "ให้ขึ้นสถานะเรียงตัว" (show status sequentially / in order). We can sort them by status so active/new are first, then loans, then sold.
const statusOrder = { 'active': 1, 'new_signing': 2, 'loaned_out': 3, 'sold': 4 };
updatedPlayers.sort((a, b) => {
  return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
});

fs.writeFileSync(playersFile, JSON.stringify(updatedPlayers, null, 2));
console.log('Updated players-men.json');
