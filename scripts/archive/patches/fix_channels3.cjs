const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/return \\\\?`\<img src/g, "return `<img src");
fs.writeFileSync('index.html', html);
