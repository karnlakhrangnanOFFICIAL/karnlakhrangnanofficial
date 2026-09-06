const fs = require('fs');
let html = fs.readFileSync('match-detail.html', 'utf8');
if (html.includes('renderMatches')) {
  console.log("match-detail.html has renderMatches");
} else {
  console.log("No renderMatches in match-detail.html");
}
