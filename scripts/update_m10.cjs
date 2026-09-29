const fs = require('fs');
const path = './data/fixtures.json';

const fixtures = JSON.parse(fs.readFileSync(path, 'utf8'));
const m10 = fixtures.find((m) => m.id === 'm10');

if (m10) {
  m10.native_stats_id = '560581';
  m10.native_stats_url = 'https://native-stats.org/match/560581';
  m10.competition = 'premier-league';
  m10.competition_name = 'Premier League';
  m10.competition_logo = 'databases/logo/competitions/men/premier-league.png';
  m10.date = '2026-09-12';
  m10.time = '21:00';
  m10.time_uk = '15:00';
  m10.time_th = '21:00';
  m10.venue = 'Stamford Bridge';
  m10.referee = 'Farai Hallam';
  m10.attendance = 39824;
  m10.status = 'completed';
  m10.period = 'FullTime';
  m10.clock = "90+7'";
  m10.home_team = 'Chelsea';
  m10.away_team = 'Hull City';
  m10.home_score = 2;
  m10.away_score = 2;
  m10.home_half_score = 1;
  m10.away_half_score = 2;
  m10.score = '2:2';
  m10.half_time_score = '1:2';

  // Goals table according to native-stats.org/match/560581
  m10.goals = [
    {
      minute: 7,
      player: 'Morgan Rogers',
      assist: 'João Pedro',
      team: 'home',
      score: '1:0',
      type: 'regular',
    },
    {
      minute: 28,
      player: 'Mohamed Belloumi',
      assist: 'Ryan John Giles',
      team: 'away',
      score: '1:1',
      type: 'regular',
    },
    {
      minute: 34,
      player: 'Mohamed Belloumi',
      assist: 'Oliver McBurnie',
      team: 'away',
      score: '1:2',
      type: 'regular',
    },
    {
      minute: 66,
      player: 'João Pedro',
      assist: 'Cole Palmer',
      team: 'home',
      score: '2:2',
      type: 'regular',
    },
  ];

  // Market valuations from native-stats.org
  m10.valuations = {
    home: {
      starting_lineup_value: '415.0 Mio. €',
      bench_value: '26.0 Mio. €',
    },
    away: {
      bench_value: '10.0 Mio. €',
    },
  };

  // Lineup tactical changes from previous match (native-stats)
  m10.lineup_changes = {
    home: {
      in: [
        { number: 6, name: 'Levi Colwill', position: 'Defence' },
        { number: 27, name: 'Malo Gusto', position: 'Defence' },
      ],
      out: [
        { number: 5, name: 'Maxence Lacroix', position: 'Defence' },
        { number: 34, name: 'Josh Acheampong', position: 'Defence' },
      ],
    },
    away: {
      in: [{ number: 25, name: 'Matt Crooks', position: 'Midfield' }],
      out: [{ number: 29, name: 'Lucas Gourna-Douath', position: 'Midfield' }],
    },
  };

  // Complete Lineups
  m10.lineups = {
    home: {
      manager: 'Xabi Alonso',
      formation: '3-4-2-1',
      starting: [
        { number: 1, name: 'Emiliano Martínez', position: 'GK' },
        { number: 6, name: 'Levi Colwill', position: 'CB' },
        { number: 3, name: 'Wesley Fofana', position: 'CB' },
        { number: 21, name: 'Jorrel Hato', position: 'CB' },
        { number: 27, name: 'Malo Gusto', position: 'RWB' },
        { number: 24, name: 'Reece James', position: 'CM' },
        { number: 45, name: 'Roméo Lavia', position: 'CM' },
        { number: 17, name: 'Morgan Rogers', position: 'AM' },
        { number: 10, name: 'Cole Palmer', position: 'AM' },
        { number: 7, name: 'Pedro Neto', position: 'LW' },
        { number: 9, name: 'João Pedro', position: 'ST' },
      ],
      substitutes: [
        { number: 39, name: 'Mike Penders', position: 'GK' },
        { number: 34, name: 'Josh Acheampong', position: 'DF' },
        { number: 29, name: 'Pep Chavarría', position: 'DF' },
        { number: 5, name: 'Maxence Lacroix', position: 'DF' },
        { number: 4, name: 'Valentín Barco', position: 'DF' },
        { number: 41, name: 'Estêvão', position: 'FW' },
        { number: 11, name: 'Jamie Bynoe-Gittens', position: 'FW' },
        { number: 18, name: 'Danny Welbeck', position: 'FW' },
        { number: 23, name: 'Geovany Quenda', position: 'FW' },
      ],
    },
    away: {
      manager: 'Sergej Jakirović',
      formation: '5-4-1',
      starting: [
        { number: 19, name: 'Konstantinos Tzolakis', position: 'GK' },
        { number: 32, name: 'Nobel Mendy', position: 'CB' },
        { number: 15, name: 'John Egan', position: 'CB' },
        { number: 6, name: 'Semi Ajayi', position: 'CB' },
        { number: 3, name: 'Ryan John Giles', position: 'LWB' },
        { number: 2, name: 'Lewie Coyle', position: 'RWB' },
        { number: 27, name: 'Regan Slater', position: 'CM' },
        { number: 25, name: 'Matt Crooks', position: 'CM' },
        { number: 21, name: 'Elliot Stroud', position: 'LM' },
        { number: 10, name: 'Mohamed Belloumi', position: 'RM' },
        { number: 9, name: 'Oliver McBurnie', position: 'ST' },
      ],
      substitutes: [
        { number: 12, name: 'Dillon Phillips', position: 'GK' },
        { number: 22, name: 'Lucas Herrington', position: 'DF' },
        { number: 18, name: 'Brooke Norton-Cuffy', position: 'DF' },
        { number: 23, name: 'Matt Targett', position: 'DF' },
        { number: 29, name: 'Lucas Gourna-Douath', position: 'MF' },
        { number: 42, name: 'Tim Iroegbunam', position: 'MF' },
        { number: 50, name: 'Mohamed-Ali Cho', position: 'FW' },
        { number: 7, name: 'Sorba Thomas', position: 'FW' },
        { number: 47, name: 'Robinio Vaz', position: 'FW' },
      ],
    },
    officials: [
      { role: 'ผู้ตัดสินหลัก (Referee)', name: 'Farai Hallam' },
    ],
  };

  // Events
  m10.events = [
    {
      minute: 7,
      type: 'goal',
      team: 'home',
      player: 'Morgan Rogers',
      assist: 'João Pedro',
      detail:
        'Goal! Chelsea 1, Hull City 0. Morgan Rogers (Chelsea) left footed shot from the left side of the box to the bottom left corner. Assisted by João Pedro following a fast break.',
    },
    {
      minute: 17,
      type: 'yellow_card',
      team: 'away',
      player: 'Oliver McBurnie',
      detail:
        'Oliver McBurnie (Hull City) is shown the yellow card for a bad foul.',
    },
    {
      minute: 28,
      type: 'goal',
      team: 'away',
      player: 'Mohamed Belloumi',
      assist: 'Ryan John Giles',
      detail:
        'Goal! Chelsea 1, Hull City 1. Mohamed Belloumi (Hull City) left footed shot from the centre of the box to the bottom right corner. Assisted by Ryan John Giles with a cross.',
    },
    {
      minute: 34,
      type: 'goal',
      team: 'away',
      player: 'Mohamed Belloumi',
      assist: 'Oliver McBurnie',
      detail:
        'Goal! Chelsea 1, Hull City 2. Mohamed Belloumi (Hull City) left footed shot from outside the box to the bottom left corner. Assisted by Oliver McBurnie following a corner.',
    },
    {
      minute: 45,
      type: 'substitution',
      team: 'home',
      player: 'Pep Chavarría',
      player_in: 'Pep Chavarría',
      player_out: 'Jorrel Hato',
      detail: 'Substitution, Chelsea. Pep Chavarría replaces Jorrel Hato.',
    },
    {
      minute: 50,
      type: 'yellow_card',
      team: 'away',
      player: 'John Egan',
      detail: 'John Egan (Hull City) is shown the yellow card for a bad foul.',
    },
    {
      minute: 52,
      type: 'yellow_card',
      team: 'away',
      player: 'Matt Crooks',
      detail:
        'Matt Crooks (Hull City) is shown the yellow card for a bad foul.',
    },
    {
      minute: 59,
      type: 'substitution',
      team: 'away',
      player: 'Lucas Herrington',
      player_in: 'Lucas Herrington',
      player_out: 'Nobel Mendy',
      injury: true,
      detail:
        'Substitution, Hull City. Lucas Herrington replaces Nobel Mendy because of an injury.',
    },
    {
      minute: 60,
      type: 'substitution',
      team: 'away',
      player: 'Sorba Thomas',
      player_in: 'Sorba Thomas',
      player_out: 'Elliot Stroud',
      detail:
        'Substitution, Hull City. Sorba Thomas replaces Elliot Stroud.',
    },
    {
      minute: 66,
      type: 'goal',
      team: 'home',
      player: 'João Pedro',
      assist: 'Cole Palmer',
      detail:
        'Goal! Chelsea 2, Hull City 2. João Pedro (Chelsea) right footed shot from the centre of the box to the bottom right corner. Assisted by Cole Palmer.',
    },
  ];

  fs.writeFileSync(path, JSON.stringify(fixtures, null, 2), 'utf8');
  console.log('Successfully updated match m10 with referee and native-stats details!');
} else {
  console.error('m10 not found in fixtures.json!');
}
