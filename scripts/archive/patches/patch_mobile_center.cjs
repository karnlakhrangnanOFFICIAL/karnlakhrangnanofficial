const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const mobileFix = `
/* Mobile: Bring both logos to the center (next to the timebox) */
@media (max-width: 767px) {
  .match-card-team.home {
    justify-content: flex-end !important;
  }
  .match-card-team.away {
    flex-direction: row !important;
    justify-content: flex-start !important;
  }
}
`;

css += mobileFix;

fs.writeFileSync('assets/css/style.css', css);
