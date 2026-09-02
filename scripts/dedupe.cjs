const fs = require('fs');

const playersFile = 'data/players-men.json';
let playersData = JSON.parse(fs.readFileSync(playersFile, 'utf8'));

// The duplicates have higher IDs (48 and up, or we can just remove those with "" number that match normalized name of an existing one)
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const seen = new Set();
const deduped = [];

for (const p of playersData) {
  const normName = removeAccents(p.name);
  if (seen.has(normName)) {
    // We already have this player. Let's prefer the one with a number or the earlier one.
    // In our case, the earlier ones (original) are better since they have full bios/stats.
    console.log('Removing duplicate:', p.name);
    continue;
  }
  seen.add(normName);
  deduped.push(p);
}

fs.writeFileSync(playersFile, JSON.stringify(deduped, null, 2));
console.log('Deduped successfully.');
