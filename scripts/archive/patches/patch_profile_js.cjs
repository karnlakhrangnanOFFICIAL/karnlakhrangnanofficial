const fs = require('fs');
let content = fs.readFileSync('assets/js/team.js', 'utf-8');

content = content.replace(
    "document.getElementById('playerNumber').textContent = '#' + (player.number || '?');",
    "document.getElementById('playerNumber').textContent = '#' + ((player.status === 'sold' || player.status === 'loaned_out') ? '?' : (player.number || '?'));"
);

fs.writeFileSync('assets/js/team.js', content);
