import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Also serve the databases directory explicitly if needed
app.use('/databases', express.static(path.join(__dirname, 'databases')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Serve index.html for the root route
// Custom API route for fetching from Google Sheets
import sheetsHandler from './api/sheets.js';
app.get('/api/sheets/:spreadsheetId', (req, res) => {
  req.query = req.query || {};
  req.query.spreadsheetId = req.params.spreadsheetId;
  sheetsHandler(req, res);
});
app.get('/api/sheets', (req, res) => {
  sheetsHandler(req, res);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
