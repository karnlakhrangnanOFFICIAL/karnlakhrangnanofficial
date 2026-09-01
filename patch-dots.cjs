const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The match item card has:
// <span class="team-badge ${teamBadgeClass}" style="padding: 1px 4px; font-size: 0.6rem;">${teamBadge}</span>
// Let's replace it with the team badge AND the dot indicator.
html = html.replace(
  /<span class="team-badge \$\{teamBadgeClass\}" style="padding: 1px 4px; font-size: 0.6rem;">\$\{teamBadge\}<\/span>/g,
  `<span style="width: 6px; height: 6px; border-radius: 50%; background-color: \${isChelseaHome ? 'var(--primary-color)' : '#ff6b6b'}; display: inline-block;" title="\${isChelseaHome ? 'Home' : 'Away'}"></span>
                    <span class="team-badge \${teamBadgeClass}" style="padding: 1px 4px; font-size: 0.6rem;">\${teamBadge}</span>`
);

// For the compact upcoming match item, it has:
// <span class="team-badge ${teamBadgeClass}" style="padding: 1px 4px; font-size: 0.6rem; min-width: unset;">${match.team_type}</span>
// But wait, the upcoming match uses `match.team_type` as text and does not have `isChelseaHome` calculated. 
// Ah, let's see how upcoming match is rendered.
