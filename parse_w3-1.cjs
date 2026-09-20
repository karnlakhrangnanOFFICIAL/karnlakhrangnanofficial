const fs = require('fs');

let match = {
  "id": "w3",
  "status": "completed",
  "home_score": 1,
  "away_score": 1,
  "goals": [
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
  ],
  "events": [
    { "type": "yellow_card", "team": "away", "player": "Miri Taylor", "minute": 71 },
    { "type": "yellow_card", "team": "away", "player": "Justine Kielland", "minute": 94 },
    
    { "type": "substitution", "team": "home", "player_in": "Sandy Baltimore", "player_out": "Wieke Kaptein", "minute": 82 },
    
    { "type": "substitution", "team": "away", "player_in": "Anna Patten", "player_out": "Lucia Kendall", "minute": 77 },
    { "type": "substitution", "team": "away", "player_in": "Georgia Mullett", "player_out": "Amalie Vangsgaard", "minute": 70 },
    { "type": "substitution", "team": "away", "player_in": "Lily Murphy", "player_out": "Mia McAulay", "minute": 69 },
    { "type": "substitution", "team": "away", "player_in": "Océane Deslandes", "player_out": "Chasity Grant", "minute": 69 },
    { "type": "substitution", "team": "away", "player_in": "Miri Taylor", "player_out": "Maya Hijikata", "minute": 58 }
  ],
  "home_manager": "Sonia Bompastor",
  "home_formation": "3-1-4-2",
  "home_lineup": [
    "Hannah Hampton",
    "Earl Berman",
    "Lucy Bronze",
    "Ellie Carpenter",
    "Wieke Kaptein",
    "Keira Walsh",
    "Sjoeke Nüsken",
    "Aggie Beever-Jones",
    "Alyssa Thompson",
    "Katie McCabe",
    "Lauren James"
  ],
  "home_subs": [
    "Sandy Baltimore",
    "Livia Peng",
    "Naomi Girma",
    "Giulia Dragoni",
    "Nelly Las",
    "Maika Hamano",
    "Kadeisha Buchanan",
    "Lexi Potter",
    "Becky Spencer"
  ],
  "away_manager": "Natalia Arroyo",
  "away_formation": "4-4-1-1",
  "away_lineup": [
    "Akane Ōkuma",
    "Mathilde Harviken",
    "Noelle Maritz",
    "Lucy Parker",
    "Lynn Wilms",
    "Justine Kielland",
    "Lucia Kendall",
    "Maya Hijikata",
    "Mia McAulay",
    "Amalie Vangsgaard",
    "Chasity Grant"
  ],
  "away_subs": [
    "Anna Patten",
    "Georgia Mullett",
    "Lily Murphy",
    "Océane Deslandes",
    "Miri Taylor",
    "Katie Scott",
    "Sophia Kelly"
  ]
};

const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));
const matchIndex = fixtures.findIndex(m => m.id === 'w3');

if (matchIndex !== -1) {
    Object.assign(fixtures[matchIndex], match);
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("Match updated.");
} else {
    console.log("Match not found.");
}
