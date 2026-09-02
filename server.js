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

// Custom API route for news scraping
import newsHandler from './api/news.js';
app.get('/api/news', (req, res) => {
  newsHandler(req, res);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
