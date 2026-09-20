const fs = require('fs');
let js = fs.readFileSync('assets/js/team.js', 'utf8');
if (js.includes('match-card')) {
    console.log("Found match-card in team.js!");
}
if (js.includes('renderTeamMatches')) {
    console.log("Found renderTeamMatches in team.js!");
}
