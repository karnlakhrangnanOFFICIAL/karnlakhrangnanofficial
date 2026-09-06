const fs = require('fs');
let js = fs.readFileSync('assets/js/team.js', 'utf8');

js = js.replace(/\\`/g, '`');

fs.writeFileSync('assets/js/team.js', js);
