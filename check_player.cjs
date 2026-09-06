const fs = require('fs');
const players = JSON.parse(fs.readFileSync('data/players-men.json', 'utf-8'));
console.log("32nd player (index 31):", players[31]);
