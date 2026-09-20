import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname, { extensions: ['html'] }));
app.use('/databases', express.static(path.join(__dirname, 'databases')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Explicit routes for each page (Hardcoded strings are REQUIRED for Vercel's nft static analysis)
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/icons', (req, res) => res.sendFile(path.join(__dirname, 'icons.html')));
app.get('/match-detail', (req, res) => res.sendFile(path.join(__dirname, 'match-detail.html')));
app.get('/men-team', (req, res) => res.sendFile(path.join(__dirname, 'men-team.html')));
app.get('/player-profile', (req, res) => res.sendFile(path.join(__dirname, 'player-profile.html')));
app.get('/post-match-graphic', (req, res) => res.sendFile(path.join(__dirname, 'post-match-graphic.html')));
app.get('/pre-match-graphic', (req, res) => res.sendFile(path.join(__dirname, 'pre-match-graphic.html')));
app.get('/the-story-blue', (req, res) => res.sendFile(path.join(__dirname, 'the-story-blue.html')));
app.get('/transfers', (req, res) => res.sendFile(path.join(__dirname, 'transfers.html')));
app.get('/trophy', (req, res) => res.sendFile(path.join(__dirname, 'trophy.html')));
app.get('/women-team', (req, res) => res.sendFile(path.join(__dirname, 'women-team.html')));

// Custom API route for news scraping (PRESERVED)
import newsHandler from './api/news.js';
app.get('/api/news', (req, res) => {
  newsHandler(req, res);
});

// Football-Data.org API Proxy with Token & CORS support
const FOOTBALL_DATA_TOKEN = process.env.FOOTBALL_DATA_TOKEN || 'fb73ad1df2194fdab3fe56614d1a953e';

app.get('/api/football-data/*', async (req, res) => {
  try {
    const apiPath = req.params[0] || '';
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex !== -1 ? req.url.substring(queryIndex) : '';
    const targetUrl = `https://api.football-data.org/v4/${apiPath}${queryString}`;

    const response = await fetch(targetUrl, {
      headers: {
        'X-Auth-Token': FOOTBALL_DATA_TOKEN,
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');
    if (queryString.includes('_t=') || queryString.includes('live=true') || req.headers['cache-control'] === 'no-cache') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    } else {
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    }
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Football-data proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
