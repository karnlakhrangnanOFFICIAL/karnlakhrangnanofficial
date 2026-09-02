const fs = require('fs');

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const playersFile = 'data/players-men.json';
const transfersFile = 'data/transfers_26_27.json';

let playersData = JSON.parse(fs.readFileSync(playersFile, 'utf8'));
const transfersData = JSON.parse(fs.readFileSync(transfersFile, 'utf8'));

const inMap = new Map(transfersData.categories.in.players.map(p => [removeAccents(p.player), p]));
const outMap = new Map(transfersData.categories.out_permanent.players.map(p => [removeAccents(p.player), p]));
const loanMap = new Map(transfersData.categories.loan_out.players.map(p => [removeAccents(p.player), p]));

playersData.forEach(p => {
  const normName = removeAccents(p.name);
  if (outMap.has(normName)) {
    p.status = 'sold';
    p.transfer_to = outMap.get(normName).to;
  } else if (loanMap.has(normName)) {
    p.status = 'loaned_out';
    p.transfer_to = loanMap.get(normName).to;
  } else if (inMap.has(normName)) {
    p.status = 'new_signing';
  }
});

const statusOrder = { 'active': 1, 'new_signing': 2, 'loaned_out': 3, 'sold': 4 };
playersData.sort((a, b) => {
  return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
});

fs.writeFileSync(playersFile, JSON.stringify(playersData, null, 2));
console.log('Fixed player statuses.');
