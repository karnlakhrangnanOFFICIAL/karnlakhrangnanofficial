import fs from 'fs';
import path from 'path';

function getMatchTimestamp(match) {
  let timeStr = match.time_th || match.time;
  if (!timeStr || timeStr === 'TBC' || timeStr === '00:00') {
    timeStr = '00:00';
  }
  const dtStr = `${match.date}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
  const t = new Date(dtStr).getTime();
  return isNaN(t) ? (new Date(match.date).getTime() || 0) : t;
}

try {
  let allMatches = [];

  // Load Men Fixtures
  const dataMen = JSON.parse(fs.readFileSync('data/fixtures-men.json', 'utf8'));
  for (const competition in dataMen) {
    if (Array.isArray(dataMen[competition])) {
      dataMen[competition].forEach(match => {
        allMatches.push({ ...match, competition_name: competition, team_type: 'M' });
      });
    }
  }

  // Load Women Fixtures
  const dataWomen = JSON.parse(fs.readFileSync('data/fixtures-women.json', 'utf8'));
  for (const competition in dataWomen) {
    if (Array.isArray(dataWomen[competition])) {
      dataWomen[competition].forEach(match => {
        allMatches.push({ ...match, competition_name: competition, team_type: 'W' });
      });
    }
  }

  // Separate upcoming and completed
  const fixtures = allMatches
    .filter(m => m.status === 'upcoming' || m.status === 'live')
    .sort((a, b) => getMatchTimestamp(a) - getMatchTimestamp(b));

  const results = allMatches
    .filter(m => m.status === 'completed')
    .sort((a, b) => getMatchTimestamp(b) - getMatchTimestamp(a));

  // Write to files
  fs.writeFileSync('data/combined-fixtures.json', JSON.stringify(fixtures, null, 2), 'utf8');
  fs.writeFileSync('data/combined-results.json', JSON.stringify(results, null, 2), 'utf8');

  console.log(`[Combine Data] Generated combined-fixtures.json (${fixtures.length} matches)`);
  console.log(`[Combine Data] Generated combined-results.json (${results.length} matches)`);
} catch (err) {
  console.error('[Combine Data Error]', err);
  process.exit(1);
}
