const fs = require('fs');
const jsPath = 'assets/js/team.js';
let js = fs.readFileSync(jsPath, 'utf8');

const newFetcher = `
// Function to fetch and map players from Google Sheet
async function fetchPlayersFromSheet(isMen = true) {
  const SPREADSHEET_ID = '11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs';
  const gid = isMen ? '353315489' : '353315489'; // Same sheet for now, unless women has another sheet
  try {
    const res = await fetch(\`/api/sheets/\${SPREADSHEET_ID}?gid=\${gid}\`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    return data.data.map((row, index) => {
      // Calculate age from date string (DD/MM/YYYY)
      let age = null;
      let dobIso = null;
      if (row['วันเกิด']) {
        const parts = row['วันเกิด'].split('/');
        if (parts.length === 3) {
          const dob = new Date(parts[2], parts[1] - 1, parts[0]);
          dobIso = \`\${parts[2]}-\${parts[1]}-\${parts[0]}\`;
          const diffMs = Date.now() - dob.getTime();
          const ageDt = new Date(diffMs);
          age = Math.abs(ageDt.getUTCFullYear() - 1970);
        }
      }

      // Extract image name (e.g. "reece-james.png (หรือ James.jpg)" -> "reece-james.png")
      let imageName = row['link png'] || 'placeholder-player.svg';
      imageName = imageName.split(' ')[0]; // Take first part if there are spaces

      return {
        id: 'sheet_' + index,
        name: row['ชื่อ'] || '--',
        number: row['เบอร์เสื้อ'] !== '-' ? row['เบอร์เสื้อ'] : null,
        position: 'Unknown', // Not in sheet, defaulting
        nationality: row['สัญชาติ'] || '--',
        image: 'assets/images/players/' + imageName,
        height: null,
        foot: null,
        date_of_birth: dobIso,
        age: age,
        joined: null,
        signed_from: null,
        market_value: null,
        appearances: 0,
        goals: 0,
        assists: 0,
        bio: ''
      };
    }).filter(p => p.name !== '--');
  } catch (err) {
    console.error('Error fetching players from sheet:', err);
    return [];
  }
}
`;

// Insert the new function before initPlayerProfile
js = js.replace('async function initPlayerProfile()', newFetcher + '\nasync function initPlayerProfile()');

// Replace the data fetching in initPlayerProfile
const targetProfileFetch = `let players = await safeFetchJson(jsonPath);
    if (!Array.isArray(players) || players.length === 0) {
      players = await safeFetchJson(apiUrl);
    }`;

const replaceProfileFetch = `let players = await fetchPlayersFromSheet(isMen);
    if (!players || players.length === 0) {
      // Fallback to local JSON
      players = await safeFetchJson(jsonPath);
    }`;

js = js.replace(targetProfileFetch, replaceProfileFetch);

// Update loadMenPlayers as well to use this
const targetMenFetch = `let players = await safeFetchJson('data/players-men.json');
    if (!Array.isArray(players) || players.length === 0) {
      players = await safeFetchJson(API_PLAYERS_MEN);
    }`;

const replaceMenFetch = `let players = await fetchPlayersFromSheet(true);
    if (!players || players.length === 0) {
      players = await safeFetchJson('data/players-men.json');
    }`;

js = js.replace(targetMenFetch, replaceMenFetch);

fs.writeFileSync(jsPath, js);
