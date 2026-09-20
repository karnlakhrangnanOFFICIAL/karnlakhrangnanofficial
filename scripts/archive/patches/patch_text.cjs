const fs = require('fs');
let content = fs.readFileSync('match-detail.html', 'utf-8');

content = content.replace(
    "return e.detail ? `ทำประตู (${e.detail})` : 'ทำประตู';",
    "return e.detail ? `(${e.detail})` : '';"
);

fs.writeFileSync('match-detail.html', content);
