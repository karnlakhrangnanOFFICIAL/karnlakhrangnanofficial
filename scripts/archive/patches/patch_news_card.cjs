const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Ensure that other .card-link instances are not affected by .match-card if we accidentally applied it
// .match-card already handles itself, but let's make sure .card styles don't conflict

fs.writeFileSync('assets/css/style.css', css);
