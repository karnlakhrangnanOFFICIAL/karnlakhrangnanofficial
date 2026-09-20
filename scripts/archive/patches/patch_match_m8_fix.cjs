const fs = require('fs');
const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));

const matchIndex = fixtures.findIndex(m => m.id === 'm8');
if (matchIndex !== -1) {
    fixtures[matchIndex].events = fixtures[matchIndex].events.map(ev => {
        if (ev.type === 'substitution') {
            return {
                ...ev,
                player: ev.player_in // set player to player_in
            };
        }
        return ev;
    });
    
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("Match m8 events fixed.");
}
