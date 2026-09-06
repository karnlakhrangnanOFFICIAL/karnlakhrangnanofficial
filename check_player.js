const fs = require('fs');
const players = JSON.parse(fs.readFileSync('data/players-men.json', 'utf-8'));
console.log(players[31]);
