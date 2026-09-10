const fs = require('fs');

const fixtures = JSON.parse(fs.readFileSync('./data/fixtures.json', 'utf8'));
const comms = JSON.parse(fs.readFileSync('/tmp/pl_all_commentary.json', 'utf8'));
const stats = JSON.parse(fs.readFileSync('/tmp/_v3_matches_2645215_stats.json', 'utf8'));

const m9Index = fixtures.findIndex(m => m.id === 'm9');
if (m9Index === -1) {
  console.error('m9 not found');
  process.exit(1);
}

const m9 = fixtures[m9Index];

// 1. Stats from Premier League Official
m9.stats = [
  { name: 'การครองบอล (Possession)', home: 54.5, away: 45.5, isPercentage: true },
  { name: 'โอกาสทำประตูที่คาดหวัง (Expected Goals - xG)', home: 2.05, away: 0.39, isPercentage: false },
  { name: 'โอกาสยิงทั้งหมด (Total Shots)', home: 16, away: 13, isPercentage: false },
  { name: 'ยิงตรงกรอบ (Shots on Target)', home: 9, away: 5, isPercentage: false },
  { name: 'ยิงหลุดกรอบ (Shots off Target)', home: 1, away: 6, isPercentage: false },
  { name: 'ยิงติดบล็อก (Blocked Shots)', home: 6, away: 2, isPercentage: false },
  { name: 'ยิงในกรอบเขตโทษ (Shots Inside Box)', home: 13, away: 5, isPercentage: false },
  { name: 'ยิงนอกกรอบเขตโทษ (Shots Outside Box)', home: 3, away: 8, isPercentage: false },
  { name: 'ความแม่นยำในการส่งบอล (Passing Accuracy)', home: 84.6, away: 81.8, isPercentage: true },
  { name: 'การส่งบอลทั้งหมด (Total Passes)', home: 461, away: 384, isPercentage: false },
  { name: 'ส่งบอลสำเร็จ (Accurate Passes)', home: 390, away: 314, isPercentage: false },
  { name: 'สัมผัสบอลทั้งหมด (Touches)', home: 634, away: 549, isPercentage: false },
  { name: 'สัมผัสบอลในกรอบคู่แข่ง (Touches in Opp Box)', home: 44, away: 26, isPercentage: false },
  { name: 'โอกาสทองที่สร้างได้ (Big Chances Created)', home: 3, away: 1, isPercentage: false },
  { name: 'พลาดโอกาสทอง (Big Chances Missed)', home: 3, away: 1, isPercentage: false },
  { name: 'เตะมุม (Corners)', home: 5, away: 3, isPercentage: false },
  { name: 'ล้ำหน้า (Offsides)', home: 3, away: 0, isPercentage: false },
  { name: 'เข้าปะทะสำเร็จ (Tackles Won)', home: 5, away: 6, isPercentage: false },
  { name: 'เคลียร์บอล (Clearances)', home: 24, away: 23, isPercentage: false },
  { name: 'ตัดบอล (Interceptions)', home: 9, away: 7, isPercentage: false },
  { name: 'ชนะการดวลกลางอากาศ (Aerial Duels Won)', home: 13, away: 16, isPercentage: false },
  { name: 'เซฟของผู้รักษาประตู (Saves)', home: 4, away: 8, isPercentage: false },
  { name: 'ทำฟาวล์ (Fouls Conceded)', home: 13, away: 16, isPercentage: false },
  { name: 'ใบเหลือง (Yellow Cards)', home: 2, away: 4, isPercentage: false },
  { name: 'ใบแดง (Red Cards)', home: 0, away: 0, isPercentage: false }
];

// 2. Lineups from Premier League Official
m9.lineups = {
  home: {
    manager: 'Mikel Arteta',
    formation: '4-2-3-1',
    starting: [
      { number: 1, name: 'David Raya (GK)' },
      { number: 4, name: 'Ben White' },
      { number: 15, name: 'Ezri Konsa' },
      { number: 6, name: 'Gabriel Magalhães' },
      { number: 33, name: 'Riccardo Calafiori' },
      { number: 41, name: 'Declan Rice' },
      { number: 49, name: 'Myles Lewis-Skelly' },
      { number: 7, name: 'Bukayo Saka' },
      { number: 8, name: 'Martin Ødegaard (C)' },
      { number: 17, name: 'Christos Tzolis' },
      { number: 29, name: 'Kai Havertz' }
    ],
    substitutes: [
      { number: 13, name: 'Kepa Arrizabalaga (GK)' },
      { number: 5, name: 'Piero Hincapié' },
      { number: 10, name: 'Eberechi Eze' },
      { number: 14, name: 'Viktor Gyökeres' },
      { number: 20, name: 'Noni Madueke' },
      { number: 23, name: 'Mikel Merino' },
      { number: 36, name: 'Martín Zubimendi' },
      { number: 39, name: 'Bruno Guimarães' },
      { number: 56, name: 'Max Dowman' }
    ]
  },
  away: {
    manager: 'Xabi Alonso',
    formation: '3-4-2-1',
    starting: [
      { number: 1, name: 'Emiliano Martínez (GK)' },
      { number: 34, name: 'Josh Acheampong' },
      { number: 5, name: 'Maxence Lacroix' },
      { number: 3, name: 'Wesley Fofana' },
      { number: 7, name: 'Pedro Neto' },
      { number: 45, name: 'Roméo Lavia' },
      { number: 24, name: 'Reece James (C)' },
      { number: 21, name: 'Jorrel Hato' },
      { number: 10, name: 'Cole Palmer' },
      { number: 17, name: 'Morgan Rogers' },
      { number: 9, name: 'João Pedro' }
    ],
    substitutes: [
      { number: 39, name: 'Mike Penders (GK)' },
      { number: 4, name: 'Valentín Barco' },
      { number: 6, name: 'Levi Colwill' },
      { number: 11, name: 'Jamie Gittens' },
      { number: 18, name: 'Danny Welbeck' },
      { number: 23, name: 'Geovany Quenda' },
      { number: 27, name: 'Malo Gusto' },
      { number: 29, name: 'Pep Chavarría' },
      { number: 41, name: 'Estêvão' }
    ]
  },
  officials: [
    { role: 'ผู้ตัดสิน (Referee)', name: 'Chris Kavanagh' },
    { role: 'ผู้ช่วยผู้ตัดสิน 1 (Assistant Referee 1)', name: 'Dan Cook' },
    { role: 'ผู้ช่วยผู้ตัดสิน 2 (Assistant Referee 2)', name: 'Timothy Wood' },
    { role: 'ผู้ตัดสินที่ 4 (Fourth Official)', name: 'Thomas Bramall' },
    { role: 'ผู้ตัดสิน VAR (Video Assistant Referee)', name: 'Darren England' },
    { role: 'ผู้ช่วยผู้ตัดสิน VAR (Assistant VAR)', name: 'Constantine Hatzidakis' }
  ]
};

// 3. Events Timeline from Premier League Official
m9.events = [
  { type: 'goal', team: 'away', player: 'Morgan Rogers', minute: 2, detail: 'Assist: Jorrel Hato' },
  { type: 'var', team: 'home', player: 'Riccardo Calafiori', minute: 13, detail: 'Goal Overturned' },
  { type: 'yellow_card', team: 'away', player: 'João Pedro', minute: 14 },
  { type: 'goal', team: 'home', player: 'Kai Havertz', minute: 25, detail: 'Assist: Declan Rice' },
  { type: 'yellow_card', team: 'away', player: 'Cole Palmer', minute: 45 },
  { type: 'goal', team: 'home', player: 'Martin Ødegaard', minute: 50, detail: 'Assist: Christos Tzolis' },
  { type: 'yellow_card', team: 'home', player: 'Christos Tzolis', minute: 58 },
  { type: 'yellow_card', team: 'away', player: 'Maxence Lacroix', minute: 58 },
  { type: 'substitution', team: 'away', player_in: 'Pep Chavarría', player_out: 'Jorrel Hato', minute: 60 },
  { type: 'substitution', team: 'away', player_in: 'Malo Gusto', player_out: 'Roméo Lavia', minute: 60 },
  { type: 'substitution', team: 'home', player_in: 'Piero Hincapié', player_out: 'Riccardo Calafiori', minute: 67 },
  { type: 'substitution', team: 'home', player_in: 'Martín Zubimendi', player_out: 'Myles Lewis-Skelly', minute: 67 },
  { type: 'substitution', team: 'home', player_in: 'Mikel Merino', player_out: 'Martin Ødegaard', minute: 77 },
  { type: 'substitution', team: 'home', player_in: 'Viktor Gyökeres', player_out: 'Kai Havertz', minute: 78 },
  { type: 'substitution', team: 'away', player_in: 'Estêvão', player_out: 'Pedro Neto', minute: 81 },
  { type: 'yellow_card', team: 'away', player: 'Morgan Rogers', minute: 83 },
  { type: 'substitution', team: 'away', player_in: 'Danny Welbeck', player_out: 'Morgan Rogers', minute: 87 },
  { type: 'substitution', team: 'home', player_in: 'Noni Madueke', player_out: 'Bukayo Saka', minute: 90 },
  { type: 'yellow_card', team: 'home', player: 'Mikel Merino', minute: 95 }
];

// 4. Live Play-by-play Commentary List (all 127 events from Premier League)
const keyTypes = new Set(['goal', 'yellow card', 'red card', 'substitution', 'var cancelled goal', 'contentious referee decisions']);

m9.live_commentary = comms.map((c, index) => {
  const cType = (c.type || '').toLowerCase();
  const isKey = keyTypes.has(cType) || (c.comment && c.comment.startsWith('Goal!'));
  let team = null;
  if (c.team1 === '3') team = 'home';
  else if (c.team1 === '8') team = 'away';
  else if (c.comment?.includes('(Arsenal)')) team = 'home';
  else if (c.comment?.includes('(Chelsea)')) team = 'away';

  return {
    id: index + 1,
    time: c.time ? c.time.trim() : '',
    type: c.type || 'commentary',
    text: c.comment || '',
    team: team,
    isKey: isKey,
    timestamp: c.timestamp || ''
  };
});

fs.writeFileSync('./data/fixtures.json', JSON.stringify(fixtures, null, 2));
console.log('Successfully updated m9 in fixtures.json!');
