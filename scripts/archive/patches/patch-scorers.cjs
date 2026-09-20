const fs = require('fs');

function injectGoalScorers(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // We want to insert the goalscorers block just before <div class="card-footer">
    // But ONLY for results, i.e., where match.status === 'completed'.
    // Let's replace '</div>\n        <div class="card-footer">'
    // Wait, the spacing might be different. Let's use regex.
    
    const replacement = `</div>
            \${match.status === 'completed' && match.goals && match.goals.length > 0 ? \`
            <div class="card-goalscorers" style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 0 10px 10px; margin-top: -5px; opacity: 0.8; font-family: var(--font-body);">
              <div class="home-scorers" style="text-align: left; flex: 1; padding-right: 10px; \${match.goals.filter(g => g.team === 'away').length > 0 ? 'border-right: 1px solid rgba(255,255,255,0.1);' : ''}">
                \${match.goals.filter(g => g.team === 'home').map(g => \`<div>\${g.player.replace(/\\(OG\\)/i, '(OG)').replace(/\\(Pen\\)/i, '(Pen)')} \${g.minute}'</div>\`).join('')}
              </div>
              <div class="away-scorers" style="text-align: right; flex: 1; padding-left: 10px;">
                \${match.goals.filter(g => g.team === 'away').map(g => \`<div>\${g.player.replace(/\\(OG\\)/i, '(OG)').replace(/\\(Pen\\)/i, '(Pen)')} \${g.minute}'</div>\`).join('')}
              </div>
            </div>\` : ''}
            <div class="card-footer">`;

    // Regex to match the end of card-result and start of card-footer
    // Because there could be different indentations, we use \s*
    // It looks like:
    // </div>
    // <div class="card-footer">
    content = content.replace(/<\/div>\s*<div class="card-footer">/g, replacement);
    
    fs.writeFileSync(file, content);
}

injectGoalScorers('assets/js/team.js');
injectGoalScorers('index.html');
console.log("Done injecting goal scorers");
