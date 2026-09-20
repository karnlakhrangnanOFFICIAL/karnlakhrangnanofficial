const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add class to completed matches
html = html.replace(/<span class="team-name"/g, '<span class="team-name cal-team-name"');

// Add class to upcoming matches
html = html.replace(/<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px;">\$\{oppName\}<\/span>/g, '<span class="cal-team-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px;">${oppName}</span>');

fs.writeFileSync('index.html', html);
