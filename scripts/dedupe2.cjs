const fs = require('fs');

const playersFile = 'data/players-men.json';
let playersData = JSON.parse(fs.readFileSync(playersFile, 'utf8'));

playersData = playersData.filter(p => p.name !== 'Emmanuel Emegha');

// Make sure the original Emanuel Emegha has status "new_signing"
const em = playersData.find(p => p.name === 'Emanuel Emegha');
if(em) em.status = 'new_signing';

fs.writeFileSync(playersFile, JSON.stringify(playersData, null, 2));
console.log('Deduped Emegha.');
