const fs = require('fs');

const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));
const matchIndex = fixtures.findIndex(m => m.id === 'w3');

if (matchIndex !== -1) {
    let match = fixtures[matchIndex];
    // Add goal events if not present
    const goalEvents = [
        { type: "goal", team: "home", player: "Lauren James", minute: 11, detail: "Assist: Ellie Carpenter" },
        { type: "goal", team: "away", player: "Earl Berman (OG)", minute: 80, detail: "Own Goal" }
    ];
    
    // push goals to events
    match.events.push(...goalEvents);
    
    // sort events by minute
    match.events.sort((a, b) => a.minute - b.minute);
    
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("w3 Match events updated.");
}
