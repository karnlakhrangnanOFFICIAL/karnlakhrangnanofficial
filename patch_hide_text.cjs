const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const hideTextRule = `
/* Hide footer text ONLY on mobile devices, globally for match cards */
@media (max-width: 767px) {
  .team-page-hide-text {
    display: none !important;
  }
}
`;

css += hideTextRule;
fs.writeFileSync('assets/css/style.css', css);
