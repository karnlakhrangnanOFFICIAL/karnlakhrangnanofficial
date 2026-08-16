import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Logo image route
app.get(['/assets/images/karnlakhrangnan-logo.png', '/assets/images/kanlakhrangnan-logo.png'], (req, res) => {
  const customLogoPath = path.join(__dirname, 'assets/images/karnlakhrangnan-logo.png');
  res.type('image/svg+xml');
  res.sendFile(customLogoPath, (err) => {
    if (err) {
      res.type('image/svg+xml');
      res.sendFile(path.join(__dirname, 'databases/logo/teams/england_chelsea.svg'));
    }
  });
});

// Google Sheets Integration API
const DEFAULT_SPREADSHEET_ID = '11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs';

app.get(['/api/sheets', '/api/sheets/:spreadsheetId'], async (req, res) => {
  try {
    const spreadsheetId = req.params.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const gid = req.query.gid || '0';
    const sheetName = req.query.sheet ? `&sheet=${encodeURIComponent(req.query.sheet)}` : '';
    
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

    res.json({
      success: true,
      spreadsheetId,
      totalRows: rows.length,
      columns: cols.filter(c => !c.startsWith('col_')),
      data: rows
    });
  } catch (err) {
    console.error('Spreadsheet API Error:', err);
    res.status(500).json({ error: 'Internal server error while fetching Google Sheet' });
  }
});

// Serve static files from root directory with html extension fallback
app.use(express.static(__dirname, { extensions: ['html', 'htm'] }));

// Fallback route to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
