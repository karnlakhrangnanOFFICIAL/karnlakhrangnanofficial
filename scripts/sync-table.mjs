import fs from 'fs';

async function syncTable() {
  try {
    const spreadsheetId = '1mdFJwRXRB-xBYiDMJK0LoUD9n3Jf9iF1x6NH1V4W1gY';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=0&headers=1`;
    const response = await fetch(url);
    const text = await response.text();
    
    if (!text.includes('google.visualization.Query.setResponse')) {
      throw new Error('Failed to query spreadsheet.');
    }

    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonStr);
    
    const table = json.table;
    const cols = table.cols.map(c => c && c.label ? c.label.toLowerCase().trim() : '');
    
    const numericCols = ['pos', 'p', 'w', 'd', 'l', 'gf', 'ga', 'gd', 'pts'];
    
    const standings = [];
    table.rows.forEach(row => {
      const obj = {};
      let hasData = false;
      row.c.forEach((cell, idx) => {
        let val = cell ? (cell.v !== undefined ? cell.v : cell.f) : null;
        const colName = cols[idx];
        if (['pos', 'logo', 'team', 'p', 'w', 'd', 'l', 'gf', 'ga', 'gd', 'pts'].includes(colName)) {
          if (val !== null && val !== '') {
            // Ensure numeric columns are actually numbers
            if (numericCols.includes(colName)) {
              const numVal = parseInt(val, 10);
              if (!isNaN(numVal)) {
                val = numVal;
              }
            }
            obj[colName] = val;
            hasData = true;
          }
        }
      });
      if (hasData && obj.pos) {
        standings.push(obj);
      }
    });

    // Sort standings by pos
    standings.sort((a, b) => (a.pos || 0) - (b.pos || 0));

    const fileData = {
      competition: "premier-league",
      competition_logo: "databases/logo/competitions/men/premier-league.png",
      season: "2026/27",
      standings: standings
    };

    fs.writeFileSync('data/tables-men.json', JSON.stringify(fileData, null, 2));
    console.log('Successfully updated data/tables-men.json from Google Sheet with correct data types!');
  } catch (err) {
    console.error('Error syncing table:', err);
  }
}

syncTable();
