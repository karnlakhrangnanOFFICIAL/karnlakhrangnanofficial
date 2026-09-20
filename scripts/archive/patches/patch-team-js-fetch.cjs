const fs = require('fs');
let content = fs.readFileSync('assets/js/team.js', 'utf8');

const fetchSheetFunc = `
// ---------- SAFE GOOGLE SHEETS FETCH (Client-side) ----------
async function fetchGoogleSheetDirect(spreadsheetId, queryParams = 'gid=0') {
  try {
    const url = \`https://docs.google.com/spreadsheets/d/\${spreadsheetId}/gviz/tq?tqx=out:json&\${queryParams}&headers=1\`;
    const res = await fetch(url);
    const text = await res.text();
    if (!text.includes('google.visualization.Query.setResponse')) {
      throw new Error('Failed to query spreadsheet. Ensure it is public.');
    }
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonStr);
    
    if (json.status === 'error') {
      throw new Error(json.errors?.[0]?.detailed_message || 'Error reading spreadsheet');
    }
    
    const table = json.table;
    const cols = table.cols.map((c, i) => (c && c.label && c.label.trim()) ? c.label.trim() : \`col_\${i}\`);
    const rows = table.rows.map(row => {
      const obj = {};
      row.c.forEach((cell, idx) => {
        const val = cell ? (cell.f !== undefined ? cell.f : cell.v) : null;
        if (val !== null && val !== undefined) {
          const colName = cols[idx] || \`col_\${idx}\`;
          obj[colName] = val;
        }
      });
      return obj;
    });
    
    return {
      success: true,
      data: rows
    };
  } catch (err) {
    console.error('Google Sheets Direct Fetch Error:', err);
    return { success: false, error: err.message };
  }
}
`;

// Insert it right before loadMenTable
content = content.replace(/async function loadMenTable\(\)/, fetchSheetFunc + '\nasync function loadMenTable()');

// Update loadMenTable usage
content = content.replace(
  /const res = await fetch\(`\/api\/sheets\/\$\{SPREADSHEET_ID\}\?gid=0`\);\s*const sheetData = await res\.json\(\);/,
  `const sheetData = await fetchGoogleSheetDirect(SPREADSHEET_ID, 'gid=0');`
);

// Update fetchPlayersFromSheet usage
content = content.replace(
  /const res = await fetch\(`\/api\/sheets\/\$\{SPREADSHEET_ID\}\?\$\{sheetParam\}`\);\s*const data = await res\.json\(\);/,
  `const data = await fetchGoogleSheetDirect(SPREADSHEET_ID, sheetParam);`
);

fs.writeFileSync('assets/js/team.js', content);
