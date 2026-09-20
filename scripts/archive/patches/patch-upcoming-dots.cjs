const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  /mEl\.innerHTML = `\n\s*<div style="display: flex; align-items: center; gap: 4px; overflow: hidden;">\n\s*<span class="team-badge \$\{teamBadgeClass\}" style="padding: 1px 4px; font-size: 0.6rem; min-width: unset;">\$\{match\.team_type\}<\/span>/,
  `const isHomeUpcoming = match.home_team.toLowerCase().includes('chelsea') || match.home_team.toLowerCase() === 'kanlakhrangnan';
            mEl.innerHTML = \`
              <div style="display: flex; align-items: center; gap: 4px; overflow: hidden;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background-color: \${isHomeUpcoming ? 'var(--primary-color)' : '#ff6b6b'}; display: inline-block; flex-shrink: 0;" title="\${isHomeUpcoming ? 'Home' : 'Away'}"></span>
                <span class="team-badge \${teamBadgeClass}" style="padding: 1px 4px; font-size: 0.6rem; min-width: unset;">\${match.team_type}</span>`
);

fs.writeFileSync('index.html', html);
