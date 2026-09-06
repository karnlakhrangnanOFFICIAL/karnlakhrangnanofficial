const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/\.match-card-team\.home \{[\s\S]*?\}/, `.match-card-team.home {
  justify-content: flex-start;
}`);

css = css.replace(/\.match-card-team\.away \{[\s\S]*?\}/, `.match-card-team.away {
  justify-content: flex-end;
  text-align: right;
  flex-direction: row-reverse;
}`);

fs.writeFileSync('assets/css/style.css', css);
