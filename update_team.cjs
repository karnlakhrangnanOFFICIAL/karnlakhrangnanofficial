const fs = require('fs');
const jsPath = 'assets/js/team.js';
let js = fs.readFileSync(jsPath, 'utf8');

const newFetcher = `// Function to fetch and map players from Google Sheet
async function fetchPlayersFromSheet(isMen = true) {
  const SPREADSHEET_ID = '11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs';
  const sheetParam = isMen ? 'gid=1721120655&sheet=profile-men' : 'gid=353315489';
  try {
    const res = await fetch(\`/api/sheets/\${SPREADSHEET_ID}?\${sheetParam}\`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error(data.error || 'Failed to fetch sheet');

    // Try to load local JSON as fallback/merge for extra details if needed
    let localData = [];
    try {
      const localRes = await fetch(isMen ? 'data/players-men.json' : 'data/players-women.json');
      localData = await localRes.json();
    } catch(e) {
      console.warn('Could not load local JSON');
    }

    return data.data.map((row, index) => {
      const sheetName = row.name || row['ชื่อ'] || '--';
      if (sheetName === '--') return null;

      const localMatch = localData.find(p => p.name.toLowerCase() === sheetName.toLowerCase()) || {};

      // Calculate or format age/dob
      let age = row.age || localMatch.age || null;
      let dobIso = row.date_of_birth || localMatch.date_of_birth || null;
      if (!dobIso && row['วันเกิด']) {
        const parts = row['วันเกิด'].split('/');
        if (parts.length === 3) {
          dobIso = \`\${parts[2]}-\${parts[1]}-\${parts[0]}\`;
          const dob = new Date(parts[2], parts[1] - 1, parts[0]);
          const diffMs = Date.now() - dob.getTime();
          age = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
        }
      }

      // Format image path
      let rawImg = row.image || row['link png'] || localMatch.image || 'placeholder-player.svg';
      rawImg = String(rawImg).trim().split(' ')[0]; // Handle "reece-james.png (หรือ James.jpg)"
      let imagePath = rawImg;
      if (!imagePath.startsWith('assets/') && !imagePath.startsWith('http')) {
        imagePath = 'assets/images/players/' + imagePath;
      }

      // Format Market Value
      let mv = row.market_value || localMatch.market_value || null;
      if (mv && typeof mv === 'string') {
        mv = Number(mv.replace(/[^0-9.]/g, '')) || mv;
      }

      const idVal = row.id ? String(row.id) : (localMatch.id ? String(localMatch.id) : \`sheet_\${index}\`);

      return {
        id: idVal,
        name: sheetName,
        number: row.number || (row['เบอร์เสื้อ'] && row['เบอร์เสื้อ'] !== '-' ? row['เบอร์เสื้อ'] : localMatch.number),
        position: row.position || localMatch.position || 'Unknown',
        nationality: row.nationality || row['สัญชาติ'] || localMatch.nationality || '--',
        image: imagePath,
        height: row.height || localMatch.height || null,
        foot: row.foot || localMatch.foot || null,
        date_of_birth: dobIso,
        age: age,
        current_club: row.current_club || localMatch.current_club || 'Chelsea FC',
        joined: row.joined || localMatch.joined || null,
        signed_from: row.signed_from || localMatch.signed_from || null,
        market_value: mv,
        appearances: row.appearances !== undefined ? Number(row.appearances) : (localMatch.appearances || 0),
        goals: row.goals !== undefined ? Number(row.goals) : (localMatch.goals || 0),
        assists: row.assists !== undefined ? Number(row.assists) : (localMatch.assists || 0),
        bio: row.bio || localMatch.bio || '',
        instagram: row.instagram || localMatch.instagram || '',
        twitter: row.twitter || localMatch.twitter || ''
      };
    }).filter(Boolean);
  } catch (err) {
    console.error('Error fetching players from sheet:', err);
    return null;
  }
}`;

// Helper position formatter
const helperPosFormatter = `function formatPlayerPosition(pos, isTh) {
  if (!pos) return '--';
  if (!isTh) return pos;
  const p = pos.toLowerCase();
  if (p.includes('goalkeeper') || p.includes('gk')) return 'ผู้รักษาประตู';
  if (p.includes('defender') || p.includes('cb') || p.includes('lb') || p.includes('rb') || p.includes('wb')) return 'กองหลัง';
  if (p.includes('midfielder') || p.includes('cm') || p.includes('dm') || p.includes('am')) return 'กองกลาง';
  if (p.includes('forward') || p.includes('striker') || p.includes('winger') || p.includes('st') || p.includes('rw') || p.includes('lw') || p.includes('cf')) return 'กองหน้า';
  return pos;
}`;

// Replace fetchPlayersFromSheet
const startIdx = js.indexOf('// Function to fetch and map players from Google Sheet');
const endIdx = js.indexOf('async function initPlayerProfile()');
js = js.substring(0, startIdx) + newFetcher + '\n\n' + helperPosFormatter + '\n\n' + js.substring(endIdx);

// Replace position rendering in renderPlayers
js = js.replace(/if \(isTh\) \{[\s\S]*?pos = 'กองหน้า';\s*\}/, `pos = formatPlayerPosition(p.position, isTh);`);

// Replace position rendering in initPlayerProfile
js = js.replace(/let pos = player\.position \|\| '--';[\s\S]*?document\.getElementById\('playerPosition'\)\.textContent = pos;/, `let pos = formatPlayerPosition(player.position, isTh);\n    document.getElementById('playerPosition').textContent = pos;`);

// Replace player lookup in initPlayerProfile to match string ID or Name
js = js.replace('const player = players.find(p => p.id == playerId);', `const player = players.find(p => String(p.id) === String(playerId) || p.name.toLowerCase() === String(playerId).toLowerCase());`);

fs.writeFileSync(jsPath, js);
console.log('Successfully updated assets/js/team.js');
