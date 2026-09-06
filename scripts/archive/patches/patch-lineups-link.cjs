const fs = require('fs');

let content = fs.readFileSync('match-detail.html', 'utf8');

const lineupReplacement = `
      // Lineups Section
      let lineupsHtml = '';
      if (match.lineups) {
        const homeL = match.lineups.home;
        const awayL = match.lineups.away;
        const teamType = match.team_type || 'men';
        const isHomeChelsea = match.home_team && match.home_team.toLowerCase().includes('chelsea');
        const isAwayChelsea = match.away_team && match.away_team.toLowerCase().includes('chelsea');

        const renderPlayer = (p, isChelsea) => {
          let pNameDisplay = p.name;
          if (isChelsea) {
             const cleanName = p.name.replace(/\\s*\\(GK\\)/i, '').replace(/\\s*\\(C\\)/i, '').trim();
             const pId = getPlayerIdByName(cleanName);
             const pTeam = getPlayerTeamByName(cleanName, teamType);
             if (pId) {
                pNameDisplay = \`<a href="player-profile.html?id=\${pId}&team=\${pTeam}" style="color: var(--primary-color); text-decoration: none; font-weight: 600;" class="scorer-link">\${p.name}</a>\`;
             }
          }
          return \`
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-weight: bold; width: 24px; text-align: right; color: var(--text-muted);">\${p.number}</span>
            <span>\${pNameDisplay}</span>
          </div>
          \`;
        };

        lineupsHtml = \`
          <div class="lineups-card" style="margin-top: 2rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem;">
            <h3 class="section-subtitle" style="text-align: center; margin-bottom: 1.5rem;">📋 รายชื่อผู้เล่น (Lineups)</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
              
              <div style="flex: 1; min-width: 250px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                  <img src="\${match.home_logo}" style="width: 30px; height: 30px; object-fit: contain;">
                  <strong style="font-size: 1.1rem;">\${renderTeamNameHTML(match.home_team)}</strong>
                </div>
                <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-muted);">
                  ผู้จัดการทีม: <strong>\${homeL.manager}</strong>
                </div>
                
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">11 ตัวจริง (Starting XI)</h4>
                <div style="margin-bottom: 1.5rem;">
                  \${homeL.starting.map(p => renderPlayer(p, isHomeChelsea)).join('')}
                </div>
                
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">ตัวสำรอง (Substitutes)</h4>
                <div>
                  \${homeL.substitutes.map(p => renderPlayer(p, isHomeChelsea)).join('')}
                </div>
              </div>

              <div style="flex: 1; min-width: 250px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                  <img src="\${match.away_logo}" style="width: 30px; height: 30px; object-fit: contain;">
                  <strong style="font-size: 1.1rem;">\${renderTeamNameHTML(match.away_team)}</strong>
                </div>
                <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-muted);">
                  ผู้จัดการทีม: <strong>\${awayL.manager}</strong>
                </div>

                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">11 ตัวจริง (Starting XI)</h4>
                <div style="margin-bottom: 1.5rem;">
                  \${awayL.starting.map(p => renderPlayer(p, isAwayChelsea)).join('')}
                </div>
                
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">ตัวสำรอง (Substitutes)</h4>
                <div>
                  \${awayL.substitutes.map(p => renderPlayer(p, isAwayChelsea)).join('')}
                </div>
              </div>

            </div>
          </div>
        \`;
      }`;

const startMarker = "// Lineups Section";
const endMarker = "let commentaryHtml = '';";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    content = before + lineupReplacement + "\\n      " + after;
    fs.writeFileSync('match-detail.html', content);
    console.log("Updated lineups successfully.");
} else {
    console.log("Could not find lineup section to replace.");
}

