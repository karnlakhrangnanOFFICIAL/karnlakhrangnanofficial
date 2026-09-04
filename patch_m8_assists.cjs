const fs = require('fs');
const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));

const matchIndex = fixtures.findIndex(m => m.id === 'm8');
if (matchIndex !== -1) {
    // Add goals to events if they are missing
    let newEvents = fixtures[matchIndex].events.filter(e => e.type !== 'goal');
    
    newEvents.push({ type: "goal", team: "home", player: "Romeo Lavia", minute: 4 });
    newEvents.push({ type: "goal", team: "home", player: "Pedro Neto", minute: 14, detail: "Assist: Morgan Rogers" });
    newEvents.push({ type: "goal", team: "home", player: "Joao Pedro", minute: 32, detail: "Assist: Jorrel Hato" });
    newEvents.push({ type: "goal", team: "away", player: "Malick Yalcouyé", minute: 35 });
    newEvents.push({ type: "goal", team: "away", player: "Joao Pedro", minute: 63, detail: "Own Goal" });
    newEvents.push({ type: "goal", team: "home", player: "Cole Palmer", minute: 74, detail: "Assist: Joao Pedro" });
    newEvents.push({ type: "goal", team: "away", player: "Pascal Groß", minute: 96 }); // 90'+6'

    // Sort events
    newEvents.sort((a, b) => {
        const parseMin = m => {
            if (typeof m === 'number') return m;
            if (typeof m === 'string') {
                const parts = m.split('+');
                return parseInt(parts[0]) + (parts[1] ? parseInt(parts[1]) / 100 : 0);
            }
            return 0;
        };
        return parseMin(a.minute) - parseMin(b.minute);
    });

    fixtures[matchIndex].events = newEvents;
    
    // Also we need to make sure the goals array itself has the correct OG format for Joao Pedro.
    // The goals array at the top might be displaying it.
    // Let's just rewrite the goals array for clarity.
    fixtures[matchIndex].goals = [
        { team: "home", player: "Romeo Lavia", minute: 4 },
        { team: "home", player: "Pedro Neto", minute: 14 },
        { team: "home", player: "Joao Pedro", minute: 32 },
        { team: "away", player: "Malick Yalcouyé", minute: 35 },
        { team: "away", player: "Joao Pedro (OG)", minute: 63 },
        { team: "home", player: "Cole Palmer", minute: 74 },
        { team: "away", player: "Pascal Groß", minute: 96 }
    ];
    
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("Match m8 updated with assist and goal events.");
}
