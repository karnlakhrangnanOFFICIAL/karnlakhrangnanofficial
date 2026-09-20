const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('match-card-team-name')) {
    console.log("Match card team name exists");
}
