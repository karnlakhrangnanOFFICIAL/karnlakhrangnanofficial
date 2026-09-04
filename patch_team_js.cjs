const fs = require('fs');
let js = fs.readFileSync('assets/js/team.js', 'utf8');

// The renderFixtures function in team.js returns an HTML string for each match.
// It uses `<div class="card">` which is different from `<div class="match-card">`.
// We need to apply the same `match-card` template to `team.js` as in `index.html`.
// Wait, the brief says "ทำแบบเดียวกันให้เหมือนกัน ทั้งหน้าทีมชายและทีมหญิง"
// Meaning they want the exact same visual card on those pages.
// Let's get the template from index.html!
