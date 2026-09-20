const fs = require('fs');
let content = fs.readFileSync('assets/js/team.js', 'utf-8');

// Replace the number rendering logic
content = content.replace(
    '<span class="player-number">#${p.number || \'?\'}</span>',
    '<span class="player-number">#${(p.status === \'sold\' || p.status === \'loaned_out\') ? \'?\' : (p.number || \'?\')}</span>'
);

fs.writeFileSync('assets/js/team.js', content);
