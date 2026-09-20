const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Insert the new media query for mobile alignment inside style.css
// I will append it near the bottom where the other media queries are.

const mobileFix = `
/* Fix logo balance on mobile */
@media (max-width: 767px) {
  .match-card-team.home {
    justify-content: flex-end !important;
  }
  .match-card-team.away {
    justify-content: flex-start !important;
  }
}
`;

css += mobileFix;

fs.writeFileSync('assets/css/style.css', css);
