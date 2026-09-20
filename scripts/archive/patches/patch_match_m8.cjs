const fs = require('fs');

const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));

const matchIndex = fixtures.findIndex(m => m.id === 'm8');
if (matchIndex !== -1) {
    fixtures[matchIndex].status = "completed";
    fixtures[matchIndex].home_score = 4;
    fixtures[matchIndex].away_score = 3;
    
    fixtures[matchIndex].goals = [
        { team: "home", player: "Romeo Lavia", minute: 4 },
        { team: "home", player: "Pedro Neto", minute: 14 },
        { team: "home", player: "Joao Pedro", minute: 32 },
        { team: "away", player: "Malick Yalcouyé", minute: 35 },
        { team: "away", player: "Joao Pedro (OG)", minute: 63 },
        { team: "home", player: "Cole Palmer", minute: 74 },
        { team: "away", player: "Pascal Groß", minute: 96 } // 90'+6'
    ];
    
    fixtures[matchIndex].events = [
        { type: "yellow_card", team: "home", player: "Wesley Fofana", minute: 55 },
        { type: "substitution", team: "home", player_in: "Moises Caicedo", player_out: "Pedro Neto", minute: 68 },
        { type: "substitution", team: "home", player_in: "Reece James", player_out: "Romeo Lavia", minute: 68 },
        { type: "substitution", team: "home", player_in: "Josh Acheampong", player_out: "Wesley Fofana", minute: 68 },
        { type: "yellow_card", team: "away", player: "Lewis Dunk", minute: 70 },
        { type: "substitution", team: "home", player_in: "Pep Chavarria", player_out: "Levi Colwill", minute: 72 },
        { type: "substitution", team: "away", player_in: "Ibrahim Osman", player_out: "Malick Yalcouyé", minute: 74 },
        { type: "substitution", team: "away", player_in: "Costinha", player_out: "Mats Wieffer", minute: 80 },
        { type: "substitution", team: "away", player_in: "Promise David", player_out: "Charalampos Kostoulas", minute: 80 },
        { type: "yellow_card", team: "away", player: "Olivier Boscagli", minute: 89 },
        { type: "yellow_card", team: "away", player: "Costinha", minute: 91 }
    ];
    
    fixtures[matchIndex].lineups = {
        home: {
            manager: "Xabi Alonso",
            formation: "3-4-2-1",
            starting: [
                { number: 26, name: "Emiliano Martinez" },
                { number: 7, name: "Pedro Neto" },
                { number: 21, name: "Jorrel Hato" },
                { number: 6, name: "Levi Colwill" },
                { number: 5, name: "Maxence Lacroix" },
                { number: 3, name: "Wesley Fofana" },
                { number: 27, name: "Malo Gusto" },
                { number: 45, name: "Romeo Lavia" },
                { number: 9, name: "Joao Pedro" },
                { number: 10, name: "Cole Palmer" },
                { number: 17, name: "Morgan Rogers" }
            ],
            substitutes: [
                { number: 11, name: "Jamie Gittens" },
                { number: 18, name: "Danny Welbeck" },
                { number: 25, name: "Moises Caicedo" },
                { number: 29, name: "Pep Chavarria" },
                { number: 24, name: "Reece James" },
                { number: 39, name: "Mike Penders" },
                { number: 4, name: "Valentin Barco" },
                { number: 34, name: "Josh Acheampong" },
                { number: 41, name: "Estevao Willian" }
            ]
        },
        away: {
            manager: "Fabian Hürzeler",
            formation: "4-2-3-1",
            starting: [
                { number: 1, name: "Bart Verbruggen" },
                { number: 27, name: "Mats Wieffer" },
                { number: 24, name: "Ferdi Kadioglu" },
                { number: 21, name: "Olivier Boscagli" },
                { number: 44, name: "Luka Vuskovic" },
                { number: 5, name: "Lewis Dunk" },
                { number: 25, name: "Diego Gómez" },
                { number: 13, name: "Pascal Groß" },
                { number: 19, name: "Charalampos Kostoulas" },
                { number: 35, name: "Malick Yalcouyé" },
                { number: 29, name: "Maxim De Cuyper" }
            ],
            substitutes: [
                { number: 6, name: "Jaouen Hadjam" },
                { number: 20, name: "Costinha" },
                { number: 4, name: "Pascal Struijk" },
                { number: 12, name: "Promise David" },
                { number: 49, name: "Nehemiah Oriola" },
                { number: 33, name: "Matt O'Riley" },
                { number: 22, name: "Amario Cozier-Duberry" },
                { number: 15, name: "Ibrahim Osman" },
                { number: 23, name: "Jason Steele" }
            ]
        }
    };
    
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("Match m8 updated successfully.");
} else {
    console.log("Match m8 not found!");
}
