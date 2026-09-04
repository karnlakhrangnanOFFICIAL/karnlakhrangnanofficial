const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  /<span class="match-card-team-name cal-team-name" style="\$\{homeNameStyle\}">\$\{renderTeamNameHTML\(match\.home_team\)\}<\/span>/g,
  '<span class="match-card-team-name" style="${homeNameStyle}">${renderTeamNameHTML(match.home_team)}</span>'
).replace(
  /<span class="match-card-team-name cal-team-name" style="\$\{awayNameStyle\}">\$\{renderTeamNameHTML\(match\.away_team\)\}<\/span>/g,
  '<span class="match-card-team-name" style="${awayNameStyle}">${renderTeamNameHTML(match.away_team)}</span>'
);

fs.writeFileSync('index.html', html);
