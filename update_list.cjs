const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const getStyleLogic = `
        const isHomeChelsea = match.home_team.toLowerCase().includes('chelsea') || match.home_team === 'KANLAKHRANGNAN';
        const isAwayChelsea = match.away_team.toLowerCase().includes('chelsea') || match.away_team === 'KANLAKHRANGNAN';
        
        let homeNameStyle = '';
        let awayNameStyle = '';
        
        if (match.status === 'completed') {
            if (isHomeChelsea) {
                if (homeWin) homeNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
                else if (match.home_score < match.away_score) homeNameStyle = 'color: #888888; font-weight: normal;';
            }
            if (isAwayChelsea) {
                if (awayWin) awayNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
                else if (match.away_score < match.home_score) awayNameStyle = 'color: #888888; font-weight: normal;';
            }
        }
`;

const resultHtmlTarget = `<span class="team-name">\${renderTeamNameHTML(match.home_team)}</span>
              </div>
              <div class="score-display">
                <span class="score \${homeWin ? 'winner' : ''}">\${match.home_score}</span>
                <span class="score-divider">-</span>
                <span class="score \${awayWin ? 'winner' : ''}">\${match.away_score}</span>
              </div>
              <div class="team \${awayWin ? 'winner' : ''}">
                <img src="\${match.away_logo}" alt="\${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name">\${renderTeamNameHTML(match.away_team)}</span>`;

const resultHtmlReplace = `<span class="team-name" style="\${homeNameStyle}">\${renderTeamNameHTML(match.home_team)}</span>
              </div>
              <div class="score-display">
                <span class="score \${homeWin ? 'winner' : ''}">\${match.home_score}</span>
                <span class="score-divider">-</span>
                <span class="score \${awayWin ? 'winner' : ''}">\${match.away_score}</span>
              </div>
              <div class="team \${awayWin ? 'winner' : ''}">
                <img src="\${match.away_logo}" alt="\${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name" style="\${awayNameStyle}">\${renderTeamNameHTML(match.away_team)}</span>`;


html = html.replace(/const teamBadgeClass = teamBadge\.toLowerCase\(\);\s*return \`/g, (match) => {
    return \`const teamBadgeClass = teamBadge.toLowerCase();
\${getStyleLogic}
        return \\\`\`;
});

html = html.replace(new RegExp(resultHtmlTarget.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), resultHtmlReplace);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done update_list.cjs');
