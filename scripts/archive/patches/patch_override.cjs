const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const override = `
/* Force hide on mobile just in case */
@media (max-width: 767px) {
  .match-card-team-name {
    display: none !important;
  }
}
`;
css += override;
fs.writeFileSync('assets/css/style.css', css);
