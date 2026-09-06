const fs = require('fs');

let html = fs.readFileSync('match-detail.html', 'utf8');

// We also need to add a color for the Own Goal title text (Strong element).
// CSS selector 2: ... > tr(6) > td(4) > div(1) > strong (This is the text for Own Goal in the Key Events table)
html = html.replace(/<strong>\$\{title\}<\/strong>/, `<strong\${eType === 'own_goal' ? ' style="color: #f56565;"' : ''}>\${title}</strong>`);

// And let's make sure the icon text color in the description is red. (Already done by wrapping in span color #f56565).

fs.writeFileSync('match-detail.html', html);
