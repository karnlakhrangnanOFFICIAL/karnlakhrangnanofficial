const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');
const teamJs = fs.readFileSync('assets/js/team.js', 'utf8');

const { JSDOM } = require('jsdom');
const dom = new JSDOM(\`<!DOCTYPE html><html><body><div id="menTableContainer"></div></body></html>\`, {
  runScripts: "dangerously"
});

// We can't easily run it. 
