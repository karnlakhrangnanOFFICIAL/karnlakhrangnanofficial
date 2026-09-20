const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Wait, the user's brief mentioned replacing Match Card. I replaced it everywhere in index.html where renderMatches/renderResults was used.
// Is there any other place?
// Let's check team.html or men-team.html or anywhere else.
