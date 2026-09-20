const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/main:nth-of-type\(1\) > section#tab-tables:nth-of-type\(3\) > div#menTableContainer:nth-of-type\(2\) > table:nth-of-type\(1\) > tbody:nth-of-type\(1\) > tr:nth-of-type\(6\) > td:nth-of-type\(3\) > span:nth-of-type\(1\) > span:nth-of-type\(1\) \{\s*color: #[a-f0-9]+ !important;\s*font-weight: bold !important;\s*\}/g, '');

css = css.replace(/main:nth-of-type\(1\) > section#tab-tables:nth-of-type\(3\) > div#menTableContainer:nth-of-type\(2\) > table:nth-of-type\(1\) > tbody:nth-of-type\(1\) > tr:nth-of-type\(8\) > td:nth-of-type\(3\) > span:nth-of-type\(1\) > span:nth-of-type\(1\) \{\s*color: #[a-f0-9]+ !important;\s*font-weight: bold !important;\s*\}/g, '');

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('done css remove');
