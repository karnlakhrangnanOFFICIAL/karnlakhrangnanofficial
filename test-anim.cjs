const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');
console.log(css.includes('fadeInCard'));
