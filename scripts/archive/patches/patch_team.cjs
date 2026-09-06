const fs = require('fs');
let code = fs.readFileSync('assets/js/team.js', 'utf8');

code = code.replace(
  "const data = await safeFetchJson('data/tables-women.json');",
  `let data = await safeFetchJson('/api/wsl-standings');
    if (data && data.success && data.data) {
      data = data.data;
    } else {
      data = await safeFetchJson('data/tables-women.json');
    }`
);

fs.writeFileSync('assets/js/team.js', code);
