const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');
if (js.includes('match-card')) {
    console.log("Found match-card in main.js!");
}
if (js.includes('renderFixtures')) {
    console.log("Found renderFixtures in main.js!");
}
