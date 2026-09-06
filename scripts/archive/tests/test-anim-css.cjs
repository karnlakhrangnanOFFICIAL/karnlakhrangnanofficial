const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css += `
/* Apply fade-in animation to all match items for smoother page loads */
.card-link, .cal-match-item {
  opacity: 0;
  animation: fadeInCard 0.4s ease-out forwards;
}
`;

fs.writeFileSync('assets/css/style.css', css);
