const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Replace match-card-top CSS to exactly match brief gaps
css = css.replace(/\.match-card-top \{[\s\S]*?\}/, `.match-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 0 20px;
  gap: 14px;
}`);

css = css.replace(/\.match-card-date \{[\s\S]*?\}/, `.match-card-date {
  color: #a0aec0;
  font-size: 0.9em;
}`);

css = css.replace(/\.match-card-league \{[\s\S]*?\}/, `.match-card-league {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}`);

css = css.replace(/\.match-card-venue \{[\s\S]*?\}/, `.match-card-venue {
  color: #cbd5e1;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 6px;
}`);

fs.writeFileSync('assets/css/style.css', css);
