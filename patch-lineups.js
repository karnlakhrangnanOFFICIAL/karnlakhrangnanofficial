const fs = require('fs');
const path = './data/fixtures.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const match = data.find(m => m.id === 'w_uwcl_2');
if (match) {
  match.lineups = {
    home: {
      manager: "Gorka Alvarez Esteibar",
      starting: [
        {number: 13, name: "Julia Arrula (GK)"},
        {number: 3, name: "Ainhoa Vicente Moraza"},
        {number: 4, name: "Nahia Aparicio"},
        {number: 20, name: "Ainoa Campo"},
        {number: 2, name: "Claudia Florentino"},
        {number: 7, name: "Laura Camino"},
        {number: 22, name: "Klára Cahynová"},
        {number: 5, name: "Paula Fernández"},
        {number: 14, name: "Intza Eguiguren"},
        {number: 18, name: "Ava Seelenfreund"},
        {number: 8, name: "Ainhoa Marín Martín"}
      ],
      substitutes: [
        {number: 30, name: "Mendiburu (GK)"},
        {number: 6, name: "Esther Laborde"},
        {number": 10, name: "Nerea Eizaguirre Lasa"},
        {number: 11, name: "Cecilia Marcos Nabal"},
        {number: 17, name: "Maren Lezeta Iturbe"},
        {number: 19, name: "Arola Aparicio Gili"},
        {number: 26, name: "Carlota Chacón"},
        {number: 27, name: "Isasisasmendi"},
        {number: 28, name: "Soroa"}
      ]
    },
    away: {
      manager: "Sonia Bompastor",
      starting: [
        {number: 24, name: "Hannah Hampton (GK)"},
        {number: 4, name: "Naomi Girma"},
        {number: 26, name: "Kadeisha Buchanan"},
        {number: 22, name: "Lucy Bronze"},
        {number: 11, name: "Sandy Baltimore"},
        {number: 21, name: "Keira Walsh"},
        {number: 32, name: "Lexi Potter"},
        {number: 2, name: "Ellie Carpenter"},
        {number: 10, name: "Lauren James"},
        {number: 33, name: "Aggie Beever-Jones"},
        {number: 19, name: "Wieke Kaptein"}
      ],
      substitutes: [
        {number: 1, name: "Livia Peng (GK)"},
        {number: 38, name: "Becky Spencer (GK)"},
        {number: 5, "name": "Veerle Buurman"},
        {number: 6, name: "Sjoeke Nüsken"},
        {number: 12, name: "Alyssa Thompson"},
        {number: 15, name: "Katie McCabe"},
        {number: 16, name: "Giulia Dragoni"},
        {number: 17, name: "Nelly Las"},
        {number: 23, name: "Maika Hamano"},
        {number: 62, name: "Chloe Sarwie"}
      ]
    }
  };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log("Lineups added successfully.");
} else {
  console.log("Match w_uwcl_2 not found!");
}
