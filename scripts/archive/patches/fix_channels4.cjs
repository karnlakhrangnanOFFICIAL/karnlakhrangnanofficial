const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/onerror="this\.style\.display='none'">\\\\?`;/g, "onerror=\"this.style.display='none'\">`;");
fs.writeFileSync('index.html', html);
