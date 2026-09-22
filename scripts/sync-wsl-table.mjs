import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TARGET_FILE = path.join(__dirname, '../data/tables-women.json');
const WSL_STANDINGS_URL = 'https://www.wslfootball.com/standings/wsl';

const LOCAL_TEAM_LOGOS = {
  'chelsea': 'databases/logo/teams/england_chelsea.svg',
  'arsenal': 'databases/logo/teams/england_arsenal.svg',
  'aston villa': 'databases/logo/teams/england_aston-villa.svg',
  'birmingham': 'databases/logo/teams/england_birmingham.svg',
  'birmingham city': 'databases/logo/teams/england_birmingham.svg',
  'bournemouth': 'databases/logo/teams/england_bournemouth.svg',
  'afc bournemouth': 'databases/logo/teams/england_bournemouth.svg',
  'brentford': 'databases/logo/teams/england_brentford.svg',
  'brighton': 'databases/logo/teams/england_brighton.svg',
  'brighton & hove albion': 'databases/logo/teams/england_brighton.svg',
  'charlton': 'databases/logo/teams/england_charlton.svg',
  'charlton athletic': 'databases/logo/teams/england_charlton.svg',
  'coventry': 'databases/logo/teams/england_coventry-city.svg',
  'coventry city': 'databases/logo/teams/england_coventry-city.svg',
  'crystal palace': 'databases/logo/teams/england_crystal-palace.svg',
  'everton': 'databases/logo/teams/england_everton.svg',
  'fulham': 'databases/logo/teams/england_fulham.svg',
  'hull': 'databases/logo/teams/england_hull-city.svg',
  'hull city': 'databases/logo/teams/england_hull-city.svg',
  'ipswich': 'databases/logo/teams/england_ipswich.svg',
  'ipswich town': 'databases/logo/teams/england_ipswich.svg',
  'leeds': 'databases/logo/teams/england_leeds-united.svg',
  'leeds united': 'databases/logo/teams/england_leeds-united.svg',
  'liverpool': 'databases/logo/teams/england_liverpool.svg',
  'london city lionesses': 'databases/logo/teams/London_City_Lionesses.svg',
  'luton': 'databases/logo/teams/england_luton.svg',
  'luton town': 'databases/logo/teams/england_luton.svg',
  'manchester city': 'databases/logo/teams/england_manchester-city.svg',
  'man city': 'databases/logo/teams/england_manchester-city.svg',
  'manchester united': 'databases/logo/teams/england_manchester-united.svg',
  'man utd': 'databases/logo/teams/england_manchester-united.svg',
  'newcastle': 'databases/logo/teams/england_newcastle.svg',
  'newcastle united': 'databases/logo/teams/england_newcastle.svg',
  'nottingham forest': 'databases/logo/teams/england_nottingham-forest.svg',
  'sunderland': 'databases/logo/teams/england_sunderland.svg',
  'tottenham': 'databases/logo/teams/england_tottenham--2006-2013.svg',
  'tottenham hotspur': 'databases/logo/teams/england_tottenham--2006-2013.svg',
  'spurs': 'databases/logo/teams/england_tottenham--2006-2013.svg',
  'west ham': 'databases/logo/teams/england_west-ham.svg',
  'west ham united': 'databases/logo/teams/england_west-ham.svg',
  'juventus': 'databases/logo/teams/italy_juventus--white.svg',
  'milan': 'databases/logo/teams/italy_milan.svg',
  'ac milan': 'databases/logo/teams/italy_milan.svg',
  'real sociedad': 'databases/logo/teams/spain_real-sociedad.svg',
  'auckland fc': 'databases/logo/teams/new-zealand_auckland-fc.svg',
  'western sydney wanderers': 'databases/logo/teams/australia_western-sydney-wanderers.svg',
  'johor darul tazim': 'databases/logo/teams/malaysia_johor-darul-tazim.svg',
  'a league women all stars': 'databases/logo/teams/a-league-women-all-stars.svg'
};

function resolveLocalTeamLogo(teamName) {
  if (!teamName) return 'databases/logo/teams/england_chelsea.svg';
  const clean = teamName.toLowerCase().replace(/^(wfc|fc|afc)\s+|\s+(wfc|fc|afc|women|lfc)$/gi, '').trim();
  
  if (LOCAL_TEAM_LOGOS[clean]) return LOCAL_TEAM_LOGOS[clean];
  if (LOCAL_TEAM_LOGOS[teamName.toLowerCase()]) return LOCAL_TEAM_LOGOS[teamName.toLowerCase()];
  
  for (const [key, pathVal] of Object.entries(LOCAL_TEAM_LOGOS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return pathVal;
    }
  }
  return 'databases/logo/teams/england_chelsea.svg';
}

export async function syncWSLStandings() {
  console.log(`[WSL Sync] Fetching standings from ${WSL_STANDINGS_URL}...`);
  try {
    const res = await fetch(WSL_STANDINGS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }

    const html = await res.text();
    const regex = /self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g;
    let match;
    let rawPayload = null;

    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes('initialStandings')) {
        try {
          rawPayload = JSON.parse('"' + match[1] + '"');
          break;
        } catch (parseErr) {
          console.warn('[WSL Sync] Warning: failed to parse payload chunk:', parseErr.message);
        }
      }
    }

    if (!rawPayload) {
      throw new Error('Could not locate initialStandings data in WSL webpage response');
    }

    const initIdx = rawPayload.indexOf('"initialStandings":');
    if (initIdx === -1) {
      throw new Error('"initialStandings" key not found in payload');
    }

    const jsonStart = initIdx + '"initialStandings":'.length;
    let depth = 0;
    let jsonEnd = jsonStart;
    for (let i = jsonStart; i < rawPayload.length; i++) {
      if (rawPayload[i] === '[') depth++;
      else if (rawPayload[i] === ']') {
        depth--;
        if (depth === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    const standingsJsonStr = rawPayload.substring(jsonStart, jsonEnd);
    const initialStandings = JSON.parse(standingsJsonStr);

    if (!Array.isArray(initialStandings) || initialStandings.length === 0) {
      throw new Error('Parsed initialStandings is empty or not an array');
    }

    // Get latest active season standings table
    const latestSeason = initialStandings[0];
    const tableObj = (latestSeason.standings || []).find(s => s.type === 'table') || latestSeason.standings?.[0];

    if (!tableObj || !Array.isArray(tableObj.teams)) {
      throw new Error('Standings table teams list not found');
    }

    const standings = tableObj.teams.map((t, idx) => {
      const statsMap = {};
      (t.stats || []).forEach(s => {
        statsMap[s.statsId] = s.statsValue;
      });

      const teamName = t.officialName || t.shortName || t.mediaName || 'Unknown Team';
      const localLogo = resolveLocalTeamLogo(teamName);

      return {
        pos: statsMap['rank'] ?? (idx + 1),
        team: teamName,
        p: Number(statsMap['matches-played'] ?? 0),
        w: Number(statsMap['win'] ?? 0),
        d: Number(statsMap['draw'] ?? 0),
        l: Number(statsMap['lose'] ?? 0),
        gf: Number(statsMap['goals-for'] ?? 0),
        ga: Number(statsMap['goals-against'] ?? 0),
        gd: Number(statsMap['goal-difference'] ?? ((statsMap['goals-for'] || 0) - (statsMap['goals-against'] || 0))),
        pts: Number(statsMap['points'] ?? 0),
        logo: localLogo
      };
    });

    // Sort by position ascending
    standings.sort((a, b) => a.pos - b.pos);

    const outputData = {
      season: latestSeason.season || '2026/2027',
      competition: "Barclays Women's Super League",
      last_updated: new Date().toISOString(),
      standings: standings
    };

    fs.writeFileSync(TARGET_FILE, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`[WSL Sync] Successfully updated ${standings.length} teams with local logos in ${TARGET_FILE}!`);
    return outputData;
  } catch (error) {
    console.error('[WSL Sync] Error syncing WSL standings:', error.message);
    throw error;
  }
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncWSLStandings()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
