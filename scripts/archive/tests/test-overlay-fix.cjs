const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const overlayFunctions = `
    window.closeMobileMatchOverlay = function() {
      const overlay = document.getElementById('mobileMatchOverlay');
      if (overlay) {
        overlay.style.opacity = '0';
        const content = document.getElementById('mobileMatchOverlayContent');
        if (content) content.style.transform = 'translateY(20px)';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }
    };

    window.showMobileMatchOverlay = function(matches, dateStr) {
      let overlay = document.getElementById('mobileMatchOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mobileMatchOverlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 9999; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; padding: 20px;';
        
        const content = document.createElement('div');
        content.id = 'mobileMatchOverlayContent';
        content.style.cssText = 'background: var(--bg-color); border-radius: var(--radius-lg); width: 100%; max-width: 400px; max-height: 80vh; overflow-y: auto; padding: 20px; position: relative; transform: translateY(20px); transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid var(--border-color);';
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            window.closeMobileMatchOverlay();
          }
        });
      }
      
      const content = document.getElementById('mobileMatchOverlayContent');
      const lang = window.currentLang || 'th';
      const formattedDate = formatDate(dateStr, lang);
      
      let htmlContent = \`
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
          <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-color);">\${formattedDate}</h3>
          <button onclick="window.closeMobileMatchOverlay()" style="background: none; border: none; font-size: 1.5rem; color: var(--text-color); cursor: pointer; line-height: 1; padding: 0 5px;">&times;</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      \`;
      
      htmlContent += matches.map((match) => {
        const homeStr = match.home_team.toLowerCase();
        const awayStr = match.away_team.toLowerCase();
        const isChelseaHome = homeStr.includes('chelsea') || homeStr === 'kanlakhrangnan';
        const isChelseaAway = awayStr.includes('chelsea') || awayStr === 'kanlakhrangnan';
        const compName = formatCompetitionName(match.competition_name);
        
        return \`
          <a href="match-detail.html?id=\${match.id}" class="card-link" style="text-decoration: none; display: block; opacity: 1; animation: none;">
            <div class="card" style="padding: 12px; background: var(--card-bg); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 4px;">
                  \${match.competition_logo ? \`<img src="\${match.competition_logo}" style="height:14px; object-fit: contain;">\` : ''}
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">\${compName}</span>
                </div>
                <span>\${(match.time_th || match.time || 'TBC').substring(0,5)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <div style="display: flex; align-items: center; gap: 6px; flex: 1; justify-content: flex-end; text-align: right;">
                  <span style="font-size: 0.85rem; font-weight: \${isChelseaHome ? 'bold' : 'normal'}; color: \${isChelseaHome ? 'var(--text-color)' : 'var(--text-muted)'};">\${renderTeamNameHTML(match.home_team)}</span>
                  <img src="\${match.home_logo}" onerror="this.src='assets/images/placeholder-team.svg'" style="width: 24px; height: 24px; object-fit: contain;">
                </div>
                <div style="padding: 0 10px; font-weight: bold; font-size: 0.95rem; color: var(--primary-color); text-align: center; min-width: 50px;">
                  \${match.status === 'completed' ? \`\${match.home_score} - \${match.away_score}\` : 'VS'}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; flex: 1; text-align: left;">
                  <img src="\${match.away_logo}" onerror="this.src='assets/images/placeholder-team.svg'" style="width: 24px; height: 24px; object-fit: contain;">
                  <span style="font-size: 0.85rem; font-weight: \${isChelseaAway ? 'bold' : 'normal'}; color: \${isChelseaAway ? 'var(--text-color)' : 'var(--text-muted)'};">\${renderTeamNameHTML(match.away_team)}</span>
                </div>
              </div>
            </div>
          </a>
        \`;
      }).join('');
      
      htmlContent += \`</div>\`;
      content.innerHTML = htmlContent;
      
      overlay.style.display = 'flex';
      // Trigger reflow
      void overlay.offsetWidth;
      overlay.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    };
`;

html = html.replace('function renderCalendar() {', overlayFunctions + '\n    function renderCalendar() {');
fs.writeFileSync('index.html', html);
