const fs = require('fs');

let content = fs.readFileSync('match-detail.html', 'utf8');

const lineupLogic = `
      // Lineups Section
      let lineupsHtml = '';
      if (match.lineups) {
        const homeL = match.lineups.home;
        const awayL = match.lineups.away;

        const renderPlayer = (p) => \`
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-weight: bold; width: 24px; text-align: right; color: var(--text-muted);">\${p.number}</span>
            <span>\${p.name}</span>
          </div>
        \`;

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
                  \${homeL.starting.map(renderPlayer).join('')}
                </div>
                
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">ตัวสำรอง (Substitutes)</h4>
                <div>
                  \${homeL.substitutes.map(renderPlayer).join('')}
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
                  \${awayL.starting.map(renderPlayer).join('')}
                </div>
                
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">ตัวสำรอง (Substitutes)</h4>
                <div>
                  \${awayL.substitutes.map(renderPlayer).join('')}
                </div>
              </div>

            </div>
          </div>
        \`;
      }
      
      let commentaryHtml = '';`;

content = content.replace("let commentaryHtml = '';", lineupLogic);

const finalReplacement = `        <!-- Goals -->
        \${goalsHtml}
        <!-- Lineups -->
        \${lineupsHtml}
        <!-- Events -->`;

content = content.replace("        <!-- Goals -->\n        ${goalsHtml}\n        <!-- Events -->", finalReplacement);

fs.writeFileSync('match-detail.html', content);
console.log("Updated match-detail.html successfully.");
