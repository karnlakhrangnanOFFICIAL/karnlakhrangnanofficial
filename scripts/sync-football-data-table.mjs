import fs from 'fs';
import path from 'path';

const API_KEY = process.env.FOOTBALL_DATA_TOKEN || 'fb73ad1df2194fdab3fe56614d1a953e';

const LOCAL_LOGO_MAP = {
  'Manchester City FC': 'databases/logo/teams/england_manchester-city.svg',
  'Arsenal FC': 'databases/logo/teams/england_arsenal.svg',
  'Brighton & Hove Albion FC': 'databases/logo/teams/england_brighton.svg',
  'Brentford FC': 'databases/logo/teams/england_brentford.svg',
  'Leeds United FC': 'databases/logo/teams/england_leeds-united.svg',
  'Liverpool FC': 'databases/logo/teams/england_liverpool.svg',
  'Everton FC': 'databases/logo/teams/england_everton.svg',
  'Hull City AFC': 'databases/logo/teams/england_hull-city.svg',
  'Newcastle United FC': 'databases/logo/teams/england_newcastle.svg',
  'Chelsea FC': 'databases/logo/teams/england_chelsea.svg',
  'Ipswich Town FC': 'databases/logo/teams/england_ipswich.svg',
  'Manchester United FC': 'databases/logo/teams/england_manchester-united.svg',
  'Nottingham Forest FC': 'databases/logo/teams/england_nottingham-forest.svg',
  'Sunderland AFC': 'databases/logo/teams/england_sunderland.svg',
  'Crystal Palace FC': 'databases/logo/teams/england_crystal-palace.svg',
  'Aston Villa FC': 'databases/logo/teams/england_aston-villa.svg',
  'AFC Bournemouth': 'databases/logo/teams/england_bournemouth.svg',
  'Coventry City FC': 'databases/logo/teams/england_coventry-city.svg',
  'Fulham FC': 'databases/logo/teams/england_fulham.svg',
  'Tottenham Hotspur FC': 'databases/logo/teams/england_tottenham--2006-2013.svg'
};

async function syncFootballDataStandings() {
  console.log('Fetching latest Premier League standings from Football-Data.org...');
  try {
    const url = 'https://api.football-data.org/v4/competitions/PL/standings';
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': API_KEY,
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const table = data.standings?.[0]?.table;

    if (!Array.isArray(table) || table.length === 0) {
      throw new Error('No standings table data found in API response');
    }

    const standings = table.map(row => {
      const fullName = row.team?.name || '';
      const shortName = row.team?.shortName || fullName.replace(/\s+(FC|AFC)$/i, '');
      const localLogo = LOCAL_LOGO_MAP[fullName];
      const logo = localLogo || row.team?.crest || 'databases/logo/teams/england_chelsea.svg';

      return {
        pos: row.position,
        logo: logo,
        team: shortName,
        p: row.playedGames,
        w: row.won,
        d: row.draw,
        l: row.lost,
        gf: row.goalsFor,
        ga: row.goalsAgainst,
        gd: row.goalDifference,
        pts: row.points
      };
    });

    const fileData = {
      competition: "premier-league",
      competition_logo: "databases/logo/competitions/men/premier-league.png",
      season: "2026/27",
      lastUpdated: new Date().toISOString(),
      standings: standings
    };

    const targetPath = path.resolve('data/tables-men.json');
    fs.writeFileSync(targetPath, JSON.stringify(fileData, null, 2), 'utf8');
    console.log(`Successfully saved ${standings.length} teams to ${targetPath}!`);
  } catch (err) {
    console.error('Error syncing Football-Data standings:', err);
    process.exit(1);
  }
}

syncFootballDataStandings();
