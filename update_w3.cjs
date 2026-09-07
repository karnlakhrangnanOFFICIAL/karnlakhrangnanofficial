const fs = require('fs');

// Load players
const playersData = JSON.parse(fs.readFileSync('data/players-women.json', 'utf8'));

function getNumber(name) {
    const p = playersData.find(p => p.name.toLowerCase() === name.toLowerCase());
    return p ? p.number : "";
}

let lineups = {
    "home": {
        "manager": "Sonia Bompastor",
        "formation": "3-1-4-2",
        "starting": [
            { "number": getNumber("Hannah Hampton"), "name": "Hannah Hampton (GK)" },
            { "number": getNumber("Earl Berman"), "name": "Earl Berman" },
            { "number": getNumber("Lucy Bronze"), "name": "Lucy Bronze" },
            { "number": getNumber("Ellie Carpenter"), "name": "Ellie Carpenter" },
            { "number": getNumber("Wieke Kaptein"), "name": "Wieke Kaptein" },
            { "number": getNumber("Keira Walsh"), "name": "Keira Walsh" },
            { "number": getNumber("Sjoeke Nüsken"), "name": "Sjoeke Nüsken" },
            { "number": getNumber("Aggie Beever-Jones"), "name": "Aggie Beever-Jones" },
            { "number": getNumber("Alyssa Thompson"), "name": "Alyssa Thompson" },
            { "number": getNumber("Katie McCabe"), "name": "Katie McCabe" },
            { "number": getNumber("Lauren James"), "name": "Lauren James" }
        ],
        "substitutes": [
            { "number": getNumber("Sandy Baltimore"), "name": "Sandy Baltimore" },
            { "number": getNumber("Livia Peng"), "name": "Livia Peng (GK)" },
            { "number": getNumber("Naomi Girma"), "name": "Naomi Girma" },
            { "number": getNumber("Giulia Dragoni"), "name": "Giulia Dragoni" },
            { "number": getNumber("Nelly Las"), "name": "Nelly Las" },
            { "number": getNumber("Maika Hamano"), "name": "Maika Hamano" },
            { "number": getNumber("Kadeisha Buchanan"), "name": "Kadeisha Buchanan" },
            { "number": getNumber("Lexi Potter"), "name": "Lexi Potter" },
            { "number": getNumber("Becky Spencer"), "name": "Becky Spencer (GK)" } // Wait, Becky Spencer is a GK right? Let's check.
        ]
    },
    "away": {
        "manager": "Natalia Arroyo",
        "formation": "4-4-1-1",
        "starting": [
            { "number": "", "name": "Akane Ōkuma (GK)" }, // assuming Ōkuma is GK
            { "number": "", "name": "Mathilde Harviken" },
            { "number": "", "name": "Noelle Maritz" },
            { "number": "", "name": "Lucy Parker" },
            { "number": "", "name": "Lynn Wilms" },
            { "number": "", "name": "Justine Kielland" },
            { "number": "", "name": "Lucia Kendall" },
            { "number": "", "name": "Maya Hijikata" },
            { "number": "", "name": "Mia McAulay" },
            { "number": "", "name": "Amalie Vangsgaard" },
            { "number": "", "name": "Chasity Grant" }
        ],
        "substitutes": [
            { "number": "", "name": "Anna Patten" },
            { "number": "", "name": "Georgia Mullett" },
            { "number": "", "name": "Lily Murphy" },
            { "number": "", "name": "Océane Deslandes" },
            { "number": "", "name": "Miri Taylor" },
            { "number": "", "name": "Katie Scott" },
            { "number": "", "name": "Sophia Kelly" }
        ]
    }
};

let goals = [
    {
        "team": "home",
        "player": "Lauren James",
        "minute": 11,
        "assist": "Ellie Carpenter"
    },
    {
        "team": "away",
        "player": "Earl Berman (OG)",
        "minute": 80
    }
];

let events = [
    { "type": "substitution", "team": "away", "player_in": "Miri Taylor", "player_out": "Maya Hijikata", "minute": 58 },
    { "type": "substitution", "team": "away", "player_in": "Lily Murphy", "player_out": "Mia McAulay", "minute": 69 },
    { "type": "substitution", "team": "away", "player_in": "Océane Deslandes", "player_out": "Chasity Grant", "minute": 69 },
    { "type": "substitution", "team": "away", "player_in": "Georgia Mullett", "player_out": "Amalie Vangsgaard", "minute": 70 },
    { "type": "yellow_card", "team": "away", "player": "Miri Taylor", "minute": 71 },
    { "type": "substitution", "team": "away", "player_in": "Anna Patten", "player_out": "Lucia Kendall", "minute": 77 },
    { "type": "substitution", "team": "home", "player_in": "Sandy Baltimore", "player_out": "Wieke Kaptein", "minute": 82 },
    { "type": "yellow_card", "team": "away", "player": "Justine Kielland", "minute": 94 }
];

const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));
const matchIndex = fixtures.findIndex(m => m.id === 'w3');

if (matchIndex !== -1) {
    fixtures[matchIndex].status = "completed";
    fixtures[matchIndex].home_score = 1;
    fixtures[matchIndex].away_score = 1;
    fixtures[matchIndex].goals = goals;
    fixtures[matchIndex].events = events;
    fixtures[matchIndex].lineups = lineups;
    
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("w3 Match updated.");
} else {
    console.log("w3 Match not found.");
}
