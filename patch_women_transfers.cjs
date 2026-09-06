const fs = require('fs');

const file = 'data/transfers_26_27.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

const ins = [
  { player: "Katie McCabe", from: "Arsenal", fee: "Undisclosed", type: "permanent", position: "LB/LW" },
  { player: "Manaka Matsukubo", from: "North Carolina Courage", fee: "Undisclosed", type: "permanent", position: "AM/FW" },
  { player: "Melvine Malard", from: "Manchester United", fee: "Undisclosed", type: "permanent", position: "FW" },
  { player: "Nelly Las", from: "Leicester City", fee: "Undisclosed", type: "permanent", position: "DF" },
  { player: "Giulia Dragoni", from: "FC Barcelona", fee: "Undisclosed", type: "permanent", position: "MF" },
  { player: "Sandy Baltimore", from: "-", fee: "Contract Extension", type: "extension", position: "LW" },
  { player: "Lucy Bronze", from: "-", fee: "Contract Extension", type: "extension", position: "RB" },
  { player: "Aggie Beever-Jones", from: "-", fee: "Contract Extension", type: "extension", position: "FW" }
];

const outs = [
  { player: "Millie Bright", to: "Retired", fee: "Retired", type: "retired", position: "CB" },
  { player: "Sam Kerr", to: "Free Agent", fee: "End of Contract", type: "released", position: "ST" },
  { player: "Guro Reiten", to: "Free Agent", fee: "End of Contract", type: "released", position: "LW/AM" },
  { player: "Johanna Rytting Kaneryd", to: "Lyon", fee: "Undisclosed", type: "permanent", position: "RW" },
  { player: "Niamh Charles", to: "Manchester City", fee: "Undisclosed", type: "permanent", position: "LB/LW" },
  { player: "Julia Bartel", to: "Juventus", fee: "Undisclosed", type: "permanent", position: "MF" },
  { player: "Lois Shooter", to: "Nottingham Forest", fee: "Loan", type: "loan", position: "DF" },
  { player: "Brooke Aspin", to: "Bristol City", fee: "Undisclosed", type: "permanent", position: "CB" },
  { player: "Katie Cox", to: "Nottingham Forest", fee: "Loan", type: "loan", position: "GK" },
  { player: "Jorja Fox", to: "Ipswich Town", fee: "Undisclosed", type: "permanent", position: "DF" }
];

data.categories["women_in"] = {
  label: "🟢 Chelsea Women ซื้อเข้า / ต่อสัญญา",
  players: ins
};

data.categories["women_out"] = {
  label: "🔴 Chelsea Women ขายออก / ปล่อยยืม / หมดสัญญา",
  players: outs
};

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Updated women transfers.");
