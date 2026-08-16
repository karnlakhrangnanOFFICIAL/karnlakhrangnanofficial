const fs = require('fs');
const jsPath = 'assets/js/team.js';
let js = fs.readFileSync(jsPath, 'utf8');

const targetWomenFetch = `let players = await safeFetchJson('data/players-women.json');
    if (!Array.isArray(players) || players.length === 0) {
      players = await safeFetchJson(API_PLAYERS_WOMEN);
    }`;

const replaceWomenFetch = `let players = await fetchPlayersFromSheet(false);
    if (!players || players.length === 0) {
      players = await safeFetchJson('data/players-women.json');
    }`;

js = js.replace(targetWomenFetch, replaceWomenFetch);

fs.writeFileSync(jsPath, js);
