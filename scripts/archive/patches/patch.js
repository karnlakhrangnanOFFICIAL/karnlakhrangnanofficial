const fs = require('fs');

function injectGoalScorers(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the renderResults card-result replacement
    const replacement = `            <div class="team \${awayWin ? 'winner' : ''}">
                <img src="\${match.away_logo}" alt="\${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name cal-team-name">\${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
              </div>
            </div>
            \${match.status === 'completed' && match.goals && match.goals.length > 0 ? \`
            <div class="card-goalscorers" style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 0 10px 10px; margin-top: -5px; opacity: 0.8;">
              <div class="home-scorers" style="text-align: left; flex: 1; padding-right: 10px; border-right: 1px solid rgba(255,255,255,0.1);">
                \${match.goals.filter(g => g.team === 'home').map(g => \`<div>\${g.player} \${g.minute}'</div>\`).join('')}
              </div>
              <div class="away-scorers" style="text-align: right; flex: 1; padding-left: 10px;">
                \${match.goals.filter(g => g.team === 'away').map(g => \`<div>\${g.player} \${g.minute}'</div>\`).join('')}
              </div>
            </div>\` : ''}
            <div class="card-footer">`;

    const searchStr = `            <div class="team \${awayWin ? 'winner' : ''}">
                <img src="\${match.away_logo}" alt="\${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name cal-team-name">\${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
              </div>
            </div>
            <div class="card-footer">`;

    // team.js might not have cal-team-name or typeof check in the original?
    // Let's use a regex instead.
}
