const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

if (!code.includes('api/wsl-standings.js')) {
  code = code.replace(
    "app.get('/api/news', (req, res) => {\n  newsHandler(req, res);\n});",
    `app.get('/api/news', (req, res) => {\n  newsHandler(req, res);\n});\n\nimport wslStandingsHandler from './api/wsl-standings.js';\napp.get('/api/wsl-standings', (req, res) => {\n  wslStandingsHandler(req, res);\n});`
  );
  fs.writeFileSync('server.js', code);
}
