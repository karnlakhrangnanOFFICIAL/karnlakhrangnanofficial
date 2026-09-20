const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Remove the block added in the previous turn
css = css.replace(/\/\* Fix logo balance on mobile \*\/[\s\S]*?@media \(max-width: 767px\) \{[\s\S]*?\.match-card-team\.home \{[\s\S]*?\}[\s\S]*?\.match-card-team\.away \{[\s\S]*?\}[\s\S]*?\}/, '');

fs.writeFileSync('assets/css/style.css', css);
