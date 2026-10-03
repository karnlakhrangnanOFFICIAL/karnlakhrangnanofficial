import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import newsHandler from './api/news.js';
import wslHandler from './api/wsl-standings.js';
import uwclHandler from './api/uwcl-standings.js';
import eplHandler from './api/epl-standings.js';
import plMatchHandler from './api/pl-match.js';
import eflMatchHandler from './api/efl-match.js';
import matchesHandler from './api/football-data/teams/61/matches.js';
import footballDataHandler from './api/football-data/[...path].js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Explicit page routes BEFORE static middlewares (Prevents folder-name redirect loops)
app.get(['/about', '/about/'], (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get(['/icons', '/icons/'], (req, res) => res.sendFile(path.join(__dirname, 'icons.html')));
app.get(['/match-detail', '/match-detail/'], (req, res) => res.sendFile(path.join(__dirname, 'match-detail.html')));
app.get(['/match-detail-women', '/match-detail-women/'], (req, res) => res.sendFile(path.join(__dirname, 'match-detail-women.html')));
app.get(['/men-team', '/men-team/'], (req, res) => res.sendFile(path.join(__dirname, 'men-team.html')));
app.get(['/player-card', '/player-card/'], (req, res) => res.sendFile(path.join(__dirname, 'player-card.html')));
app.get(['/player-profile', '/player-profile/'], (req, res) => res.sendFile(path.join(__dirname, 'player-profile.html')));
app.get(['/post-match-graphic', '/post-match-graphic/'], (req, res) => res.sendFile(path.join(__dirname, 'post-match-graphic.html')));
app.get(['/pre-match-graphic', '/pre-match-graphic/'], (req, res) => res.sendFile(path.join(__dirname, 'pre-match-graphic.html')));
app.get(['/the-story-blue', '/the-story-blue/'], (req, res) => res.sendFile(path.join(__dirname, 'the-story-blue.html')));
app.get(['/transfers', '/transfers/'], (req, res) => res.sendFile(path.join(__dirname, 'transfers.html')));
app.get(['/trophy', '/trophy/'], (req, res) => res.sendFile(path.join(__dirname, 'trophy.html')));
app.get(['/women-team', '/women-team/'], (req, res) => res.sendFile(path.join(__dirname, 'women-team.html')));
app.get(['/chelsea', '/chelsea/'], (req, res) => res.sendFile(path.join(__dirname, 'chelsea.html')));
app.get(['/epl', '/epl/'], (req, res) => res.sendFile(path.join(__dirname, 'epl.html')));

// Subfolder route handlers for clean URLs
app.get('/trophy/:id', (req, res, next) => {
  const file = req.params.id.endsWith('.html') ? req.params.id : `${req.params.id}.html`;
  const target = path.join(__dirname, 'trophy', file);
  if (fs.existsSync(target)) {
    return res.sendFile(target);
  }
  next();
});

app.get('/the-story-blue/:chapter', (req, res, next) => {
  const file = req.params.chapter.endsWith('.html') ? req.params.chapter : `${req.params.chapter}.html`;
  const target = path.join(__dirname, 'the-story-blue', file);
  if (fs.existsSync(target)) {
    return res.sendFile(target);
  }
  next();
});

app.get('/icon/:name', (req, res, next) => {
  const file = req.params.name.endsWith('.html') ? req.params.name : `${req.params.name}.html`;
  const target = path.join(__dirname, 'icon', file);
  if (fs.existsSync(target)) {
    return res.sendFile(target);
  }
  next();
});

// Serve static assets with redirect: false to prevent redirect loops
app.use(express.static(__dirname, { extensions: ['html'], redirect: false }));
app.use('/databases', express.static(path.join(__dirname, 'databases'), { redirect: false }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { redirect: false }));
app.use('/img', express.static(path.join(__dirname, 'img'), { redirect: false }));
app.use('/data', express.static(path.join(__dirname, 'data'), { redirect: false }));
app.use('/lang', express.static(path.join(__dirname, 'lang'), { redirect: false }));
app.use('/icon', express.static(path.join(__dirname, 'icon'), { extensions: ['html'], redirect: false }));
app.use('/trophy', express.static(path.join(__dirname, 'trophy'), { extensions: ['html'], redirect: false }));
app.use('/the-story-blue', express.static(path.join(__dirname, 'the-story-blue'), { extensions: ['html'], redirect: false }));

// Custom API route handlers
app.all('/api/news', (req, res) => newsHandler(req, res));
app.all('/api/pl-match', (req, res) => plMatchHandler(req, res));
app.all('/api/efl-match', (req, res) => eflMatchHandler(req, res));
app.all('/api/epl-standings', (req, res) => eplHandler(req, res));
app.all('/api/wsl-standings', (req, res) => wslHandler(req, res));
app.all('/api/uwcl-standings', (req, res) => uwclHandler(req, res));

// Dedicated Chelsea Matches Endpoint
app.all('/api/football-data/teams/61/matches', (req, res) => matchesHandler(req, res));

// Football-Data.org API Proxy with Token & CORS support
app.all('/api/football-data*', (req, res) => footballDataHandler(req, res));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
