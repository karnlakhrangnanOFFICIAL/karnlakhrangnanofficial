const fs = require('fs');
const jsPath = 'assets/js/team.js';
let js = fs.readFileSync(jsPath, 'utf8');

const updatedFetcher = `
// Function to fetch and map players from Google Sheet
async function fetchPlayersFromSheet(isMen = true) {
  const SPREADSHEET_ID = '11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs';
  const gid = isMen ? '353315489' : '353315489'; // Same sheet for now
  try {
    const res = await fetch(\`/api/sheets/\${SPREADSHEET_ID}?gid=\${gid}\`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    // Try to load local JSON to merge missing fields (like Position, bio, etc.)
    let localData = [];
    try {
      const localRes = await fetch(isMen ? 'data/players-men.json' : 'data/players-women.json');
      localData = await localRes.json();
    } catch(e) {
      console.warn('Could not load local JSON for merging');
    }

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

      let imageName = row['link png'] || 'placeholder-player.svg';
      imageName = imageName.split(' ')[0]; // Handle "reece-james.png (หรือ James.jpg)"
      
      const sheetName = row['ชื่อ'] || '--';
      const localMatch = localData.find(p => p.name.toLowerCase() === sheetName.toLowerCase()) || {};

      return {
        id: 'sheet_' + index,
        name: sheetName,
        number: row['เบอร์เสื้อ'] && row['เบอร์เสื้อ'] !== '-' ? row['เบอร์เสื้อ'] : localMatch.number,
        position: localMatch.position || 'Unknown',
        nationality: row['สัญชาติ'] || localMatch.nationality || '--',
        image: 'assets/images/players/' + imageName,
        height: localMatch.height || null,
        foot: localMatch.foot || null,
        date_of_birth: dobIso || localMatch.date_of_birth,
        age: age || localMatch.age,
        joined: localMatch.joined || null,
        signed_from: localMatch.signed_from || null,
        market_value: localMatch.market_value || null,
        appearances: localMatch.appearances || 0,
        goals: localMatch.goals || 0,
        assists: localMatch.assists || 0,
        bio: localMatch.bio || '',
        instagram: localMatch.instagram || '',
        twitter: localMatch.twitter || ''
      };
    }).filter(p => p.name !== '--');
  } catch (err) {
    console.error('Error fetching players from sheet:', err);
    return null;
  }
}
`;

// Replace the previous fetchPlayersFromSheet
const startIdx = js.indexOf('// Function to fetch and map players from Google Sheet');
const endIdx = js.indexOf('async function initPlayerProfile()');
js = js.substring(0, startIdx) + updatedFetcher + js.substring(endIdx);

fs.writeFileSync(jsPath, js);
