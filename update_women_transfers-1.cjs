const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/transfers_26_27.json', 'utf8'));

const womenIn = [
  { date: '31 Jul 2026', player: 'Giulia Dragoni', from: 'FC Barcelona', type: 'Permanent Transfer' },
  { date: '24 Jul 2026', player: 'Nelly Las', from: 'Leicester City', type: 'Permanent Transfer' },
  { date: '04 Jul 2026', player: 'Manaka Matsukubo', from: 'North Carolina Courage', type: 'Permanent Transfer' },
  { date: '30 Jun 2026', player: 'Vera Jones', from: 'Bristol City', type: 'End of Loan' },
  { date: '30 Jun 2026', player: 'Katie Cox', from: 'Aberdeen LFC', type: 'End of Loan' },
  { date: '30 Jun 2026', player: 'Mara Alber', from: 'Werder Bremen', type: 'End of Loan' },
  { date: '30 Jun 2026', player: 'Maika Hamano', from: 'Tottenham Hotspur', type: 'End of Loan' },
  { date: '01 Jun 2026', player: 'Katie McCabe', from: 'Arsenal', type: 'Free Transfer' }
];

const womenOut = [
  { date: '21 Aug 2026', player: 'Vera Jones', to: 'Watford', type: 'Loan' },
  { date: '20 Aug 2026', player: 'Katie Cox', to: 'Nottingham Forest', type: 'Loan' },
  { date: '14 Aug 2026', player: 'Mara Alber', to: 'VfL Wolfsburg', type: 'Loan' },
  { date: '11 Jul 2026', player: 'Julia Bartel', to: 'Juventus', type: 'Permanent Transfer' },
  { date: '10 Jul 2026', player: 'Niamh Charles', to: 'Manchester City', type: 'Permanent Transfer' },
  { date: '06 Jul 2026', player: 'Johanna Rytting Kaneryd', to: 'OL Lyonnes', type: 'Permanent Transfer' },
  { date: '29 Jun 2026', player: 'Sam Kerr', to: 'NJ/NY Gotham FC', type: 'Free Transfer' },
  { date: '12 Mar 2026', player: 'Guro Reiten', to: 'NJ/NY Gotham FC', type: 'Permanent Transfer' },
  { date: '23 Jan 2026', player: 'Ashanti Akpa', to: 'Newcastle United', type: 'Permanent Transfer' },
  { date: '12 Jan 2026', player: 'Oriane Jean-François', to: 'Aston Villa', type: 'Permanent Transfer' },
  { date: '06 Jan 2026', player: 'Mara Alber', to: 'Werder Bremen', type: 'Loan' },
  { date: '04 Jan 2026', player: 'Maika Hamano', to: 'Tottenham Hotspur', type: 'Loan' }
];

const inPlayers = womenIn.map(p => ({
  date: p.date,
  player: p.player,
  from: p.from,
  fee: p.type === 'Free Transfer' ? 'Free Transfer' : (p.type === 'End of Loan' ? 'End of Loan' : 'Undisclosed'),
  type: p.type.toLowerCase().includes('loan') ? 'loan_return' : 'permanent',
  position: ''
}));

const outPermanent = womenOut.filter(p => !p.type.includes('Loan')).map(p => ({
  date: p.date,
  player: p.player,
  to: p.to,
  fee: p.type === 'Free Transfer' ? 'Free Transfer' : 'Undisclosed',
  type: p.type === 'Free Transfer' ? 'released' : 'permanent',
  position: ''
}));

const outLoan = womenOut.filter(p => p.type.includes('Loan')).map(p => ({
  date: p.date,
  player: p.player,
  to: p.to,
  fee: 'Loan',
  loan_term: 'Season Loan',
  type: 'loan',
  position: ''
}));

data.categories.women_in.players = inPlayers;
data.categories.women_out_permanent.players = outPermanent;
data.categories.women_loan_out.players = outLoan;

fs.writeFileSync('data/transfers_26_27.json', JSON.stringify(data, null, 2));
console.log('Updated women transfers in data/transfers_26_27.json');
