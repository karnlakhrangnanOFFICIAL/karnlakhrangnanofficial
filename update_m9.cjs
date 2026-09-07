const fs = require('fs');

const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));
const matchIndex = fixtures.findIndex(m => m.id === 'm9');

const playersData = JSON.parse(fs.readFileSync('data/players-men.json', 'utf8'));
function getNumber(name) {
    const p = playersData.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    return p ? p.number : "";
}

if (matchIndex !== -1) {
    let match = fixtures[matchIndex];
    match.status = "completed";
    match.home_score = 2;
    match.away_score = 1;
    
    match.goals = [
        { team: "away", player: "Morgan Rogers", minute: 2, assist: "Jorrel Hato" },
        { team: "home", player: "Kai Havertz", minute: 24, assist: "Declan Rice" },
        { team: "home", player: "Martin Ødegaard", minute: 49, assist: "Christos Tzolis" }
    ];
    
    match.events = [
        { type: "var", team: "home", player: "Riccardo Calafiori", minute: 13, detail: "Goal Overturned" },
        { type: "yellow_card", team: "away", player: "João Pedro", minute: 15 },
        { type: "yellow_card", team: "away", player: "Cole Palmer", minute: 45 },
        { type: "yellow_card", team: "away", player: "Maxence Lacroix", minute: 58 },
        { type: "yellow_card", team: "home", player: "Christos Tzolis", minute: 58 },
        { type: "substitution", team: "away", player_in: "Pep Chavarría", player_out: "Jorrel Hato", minute: 60 },
        { type: "substitution", team: "away", player_in: "Malo Gusto", player_out: "Roméo Lavia", minute: 60 },
        { type: "substitution", team: "home", player_in: "Piero Hincapié", player_out: "Riccardo Calafiori", minute: 67 },
        { type: "substitution", team: "home", player_in: "Martín Zubimendi", player_out: "Myles Lewis-Skelly", minute: 69 },
        { type: "substitution", team: "home", player_in: "Mikel Merino", player_out: "Martin Ødegaard", minute: 77 },
        { type: "substitution", team: "home", player_in: "Viktor Gyökeres", player_out: "Kai Havertz", minute: 79 },
        { type: "substitution", team: "away", player_in: "Estêvão", player_out: "Pedro Neto", minute: 82 },
        { type: "yellow_card", team: "away", player: "Morgan Rogers", minute: 87 },
        { type: "substitution", team: "away", player_in: "Danny Welbeck", player_out: "Morgan Rogers", minute: 88 },
        { type: "substitution", team: "home", player_in: "Noni Madueke", player_out: "Bukayo Saka", minute: 90 },
        { type: "yellow_card", team: "home", player: "Mikel Merino", minute: 95 }
    ];
    
    // push goals to events
    match.events.push(
        { type: "goal", team: "away", player: "Morgan Rogers", minute: 2, detail: "Assist: Jorrel Hato" },
        { type: "goal", team: "home", player: "Kai Havertz", minute: 24, detail: "Assist: Declan Rice" },
        { type: "goal", team: "home", player: "Martin Ødegaard", minute: 49, detail: "Assist: Christos Tzolis" }
    );
    match.events.sort((a, b) => a.minute - b.minute);
    
    match.lineups = {
        home: {
            manager: "Mikel Arteta",
            formation: "4-2-3-1",
            starting: [
                { number: "", name: "David Raya (GK)" },
                { number: "", name: "Ben White" },
                { number: "", name: "Ezri Konsa" },
                { number: "", name: "Gabriel" },
                { number: "", name: "Riccardo Calafiori" },
                { number: "", name: "Myles Lewis-Skelly" },
                { number: "", name: "Declan Rice" },
                { number: "", name: "Bukayo Saka" },
                { number: "", name: "Martin Ødegaard" },
                { number: "", name: "Christos Tzolis" },
                { number: "", name: "Kai Havertz" }
            ],
            substitutes: [
                { number: "", name: "Kepa Arrizabalaga (GK)" },
                { number: "", name: "Piero Hincapié" },
                { number: "", name: "Max Dowman" },
                { number: "", name: "Bruno Guimarães" },
                { number: "", name: "Mikel Merino" },
                { number: "", name: "Martín Zubimendi" },
                { number: "", name: "Eberechi Eze" },
                { number: "", name: "Noni Madueke" },
                { number: "", name: "Viktor Gyökeres" }
            ]
        },
        away: {
            manager: "Xabi Alonso",
            formation: "3-4-2-1",
            starting: [
                { number: getNumber("Martinez"), name: "Emiliano Martínez (GK)" },
                { number: getNumber("Acheampong"), name: "Josh Acheampong" },
                { number: getNumber("Fofana"), name: "Wesley Fofana" },
                { number: getNumber("Lacroix"), name: "Maxence Lacroix" },
                { number: getNumber("Neto"), name: "Pedro Neto" },
                { number: getNumber("James"), name: "Reece James" },
                { number: getNumber("Lavia"), name: "Roméo Lavia" },
                { number: getNumber("Hato"), name: "Jorrel Hato" },
                { number: getNumber("Palmer"), name: "Cole Palmer" },
                { number: getNumber("Rogers"), name: "Morgan Rogers" },
                { number: getNumber("Joao Pedro"), name: "João Pedro" }
            ],
            substitutes: [
                { number: getNumber("Penders"), name: "Mike Penders (GK)" },
                { number: getNumber("Colwill"), name: "Levi Colwill" },
                { number: getNumber("Chavarria"), name: "Pep Chavarría" },
                { number: getNumber("Gusto"), name: "Malo Gusto" },
                { number: getNumber("Barco"), name: "Valentín Barco" },
                { number: getNumber("Estevao"), name: "Estêvão" },
                { number: getNumber("Gittens"), name: "Jamie Bynoe-Gittens" },
                { number: getNumber("Quenda"), name: "Geovany Quenda" },
                { number: getNumber("Welbeck"), name: "Danny Welbeck" }
            ]
        }
    };
    
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("m9 Match updated.");
} else {
    console.log("m9 Match not found.");
}
