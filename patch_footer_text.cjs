const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const footerTextHide = `
/* Hide footer text on men/women team pages - based on brief */
@media (max-width: 767px) {
  .match-card-footer-text {
    display: none !important;
  }
}
`;

css += footerTextHide;

fs.writeFileSync('assets/css/style.css', css);
