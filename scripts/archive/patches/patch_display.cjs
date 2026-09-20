const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The match card looks fine but we need to ensure mobile names are hidden via CSS
// wait, the CSS was already patched to include:
// .match-card-team-name { display: none; }
// @media (min-width: 768px) { .match-card-team-name { display: block; } }

// Check if there are other places where card-link is used
// Wait, I should also modify the match.html rendering if there is any

