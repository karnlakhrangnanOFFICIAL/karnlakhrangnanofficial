export default async function handler(req, res) {
  try {
    const DEFAULT_SPREADSHEET_ID = '11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs';
    
    // Extract parameters from query or route path
    const { spreadsheetId: paramId, gid = '0', sheet } = req.query;
    const spreadsheetId = paramId || DEFAULT_SPREADSHEET_ID;
    const sheetName = sheet ? `&sheet=${encodeURIComponent(sheet)}` : '';
    
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}${sheetName}&headers=1`;
    const response = await fetch(url);
    const text = await response.text();
    
    if (!text.includes('google.visualization.Query.setResponse')) {
      return res.status(400).json({ error: 'Failed to query spreadsheet. Please ensure the document is shared/accessible.' });
    }

    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonStr);

    if (json.status === 'error') {
      return res.status(400).json({
        error: json.errors && json.errors[0] ? json.errors[0].detailed_message : 'Error reading spreadsheet'
      });
    }

    const table = json.table;
    const cols = table.cols.map((c, i) => (c && c.label && c.label.trim()) ? c.label.trim() : `col_${i}`);

    const rows = table.rows.map(row => {
      const obj = {};
      row.c.forEach((cell, idx) => {
        const val = cell ? (cell.f !== undefined ? cell.f : cell.v) : null;
        if (val !== null && val !== undefined) {
          const colName = cols[idx] || `col_${idx}`;
          obj[colName] = val;
        }
      });
      return obj;
    });

    // Set CORS and Caching headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json({
      success: true,
      spreadsheetId,
      totalRows: rows.length,
      columns: cols.filter(c => !c.startsWith('col_')),
      data: rows
    });
  } catch (err) {
    console.error('Spreadsheet API Error:', err);
    return res.status(500).json({ error: 'Internal server error while fetching Google Sheet' });
  }
}
