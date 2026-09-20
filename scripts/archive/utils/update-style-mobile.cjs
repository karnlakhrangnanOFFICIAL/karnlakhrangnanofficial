const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/\.league-table th,\n\s+\.league-table td \{[^}]+font-size: 0\.8rem;/, match => match.replace('0.8rem', '1.6rem'));

fs.writeFileSync('assets/css/style.css', css);
