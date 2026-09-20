const fs = require('fs');

function patchPage(filename) {
    if (!fs.existsSync(filename)) return;
    let html = fs.readFileSync(filename, 'utf8');
    
    // Check if the html has renderFixtures or renderResults
    if (html.includes("match-card-team.home")) {
        console.log(filename + " has match-card-team.home");
    } else {
        console.log(filename + " doesn't have match-card inline. Maybe JS?");
    }
}

patchPage('men-team.html');
patchPage('women-team.html');
