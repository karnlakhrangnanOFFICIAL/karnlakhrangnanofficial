const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/\.match-card-providers \{[\s\S]*?\}/, `.match-card-providers {
  display: flex;
  gap: 10px;
  width: 120px; /* Fixed width for Provider Badges */
  justify-content: flex-end;
}`);

fs.writeFileSync('assets/css/style.css', css);
