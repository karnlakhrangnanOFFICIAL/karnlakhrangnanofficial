const fs = require('fs');
const players = JSON.parse(fs.readFileSync('data/players-men.json', 'utf-8'));

for (let p of players) {
  if (p.name === 'Robert Sánchez') {
    p.number = null; // Assuming he lost #1 to Martinez
  }
}

fs.writeFileSync('data/players-men.json', JSON.stringify(players, null, 2));
