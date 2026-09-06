import fs from 'fs';
let content = fs.readFileSync('server.js', 'utf8');

// Add import if not present
if (!content.includes('eplStandingsHandler')) {
  content = content.replace(
    "import wslStandingsHandler from './api/wsl-standings.js';",
    "import wslStandingsHandler from './api/wsl-standings.js';\nimport eplStandingsHandler from './api/epl-standings.js';"
  );
  
  // Add endpoint
  content = content.replace(
    "app.get('/api/wsl-standings', (req, res) => {",
    "app.get('/api/epl-standings', (req, res) => {\n  eplStandingsHandler(req, res);\n});\n\napp.get('/api/wsl-standings', (req, res) => {"
  );
  
  fs.writeFileSync('server.js', content);
}
