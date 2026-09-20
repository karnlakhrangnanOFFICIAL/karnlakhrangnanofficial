const fs = require('fs');
let html = fs.readFileSync('match-detail.html', 'utf8');
if (html.includes('renderMatches')) {
  console.log('match-detail has renderMatches');
}
