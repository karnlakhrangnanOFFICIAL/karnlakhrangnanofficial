const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

const newCSS = `
/* ==================== MATCH WEB CARD CSS ==================== */
/* Base Match Card Typography */
.match-card {
  font-family: sans-serif;
  font-size: 14pt;
  background-color: var(--card-bg, #1a1a24);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

/* Images always keep aspect ratio */
.match-card img {
  object-fit: contain;
}

/* Top Section (Vertical Flow) */
.match-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 0 20px;
}
.match-card-date {
  color: #a0aec0;
  font-size: 0.9em;
  margin-bottom: 14px;
}
.match-card-league {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-weight: bold;
}
.match-card-league img {
  height: 24px;
}
.match-card-venue {
  color: #cbd5e1;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}

/* Match Row (Team & Score) */
.match-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 30px;
  width: 100%;
}
.match-card-team {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.match-card-team.home {
  justify-content: flex-start;
}
.match-card-team.away {
  justify-content: flex-end;
  text-align: right;
  flex-direction: row-reverse;
}
.match-card-team-logo {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}
.match-card-team-name {
  font-weight: bold;
  font-size: 1.1em;
  display: none; /* Hidden on mobile by default */
}
.match-card-timebox {
  width: 90px;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255,255,255,0.1);
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2em;
  margin: 0 15px;
}

/* Footer Section */
.match-card-footer {
  height: 70px;
  width: 100%;
  border-radius: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  background-color: rgba(0,0,0,0.3);
  margin-top: 10px;
}
.match-card-footer-text {
  font-size: 0.9em;
  color: #a0aec0;
}
.match-card-providers {
  display: flex;
  gap: 10px;
}

/* Tablet View (768px and up) */
@media (min-width: 768px) {
  .match-card-team-name {
    display: block; /* Show team names on tablet/desktop */
  }
}
`;

css += '\n' + newCSS;
fs.writeFileSync('assets/css/style.css', css);

let html = fs.readFileSync('index.html', 'utf8');

// Replace card rendering for fixtures
html = html.replace(/<a href="match-detail\.html\?id=\$\{match\.id\}" class="card-link"[\s\S]*?<\/a>`/g, (match) => {
    // Determine if it's a fixture or result based on match.status
    if (match.includes('fixture-time')) {
        return `
        <a href="match-detail.html?id=\${match.id}" class="card-link match-card" style="animation-delay: \${index * 0.05}s; text-decoration: none; display: block;">
          <div class="match-card-top">
            <div class="match-card-date">📅 \${formatDate(displayDate, window.currentLang||'th')}</div>
            <div class="match-card-league">
              \${compLogo ? \`<img src="\${compLogo}" alt="">\` : ''}
              <span>\${compName} <span class="team-badge \${teamBadgeClass}">\${teamBadge}</span></span>
            </div>
            <div class="match-card-venue">
              <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
              <span>\${match.venue}</span>
            </div>
          </div>
          
          <div class="match-card-row">
            <div class="match-card-team home">
              <img src="\${match.home_logo}" alt="\${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
              <span class="match-card-team-name" style="\${homeNameStyle}">\${renderTeamNameHTML(match.home_team)}</span>
            </div>
            
            <div class="match-card-timebox">
              \${match.status === 'live' ? \`<span style="color:var(--primary-color);">\${match.home_score||0} - \${match.away_score||0}</span>\` : \`<span>\${displayTime}</span>\`}
            </div>
            
            <div class="match-card-team away">
              <img src="\${match.away_logo}" alt="\${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
              <span class="match-card-team-name" style="\${awayNameStyle}">\${renderTeamNameHTML(match.away_team)}</span>
            </div>
          </div>
          
          <div class="match-card-footer">
            <span class="match-card-footer-text">\${match.status === 'live' ? 'LIVE NOW' : 'UPCOMING MATCH'}</span>
            <div class="match-card-providers">
              \${channelsIcons}
            </div>
          </div>
        </a>\``;
    } else if (match.includes('card-result')) {
        return `
        <a href="match-detail.html?id=\${match.id}" class="card-link match-card" style="animation-delay: \${index * 0.05}s; text-decoration: none; display: block;">
          <div class="match-card-top">
            <div class="match-card-date">📅 \${formatDate(displayDate, window.currentLang||'th')}</div>
            <div class="match-card-league">
              \${match.competition_logo ? \`<img src="\${match.competition_logo}" alt="">\` : ''}
              <span>\${compName} <span class="team-badge \${teamBadgeClass}">\${teamBadge}</span></span>
            </div>
            <div class="match-card-venue">
              <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
              <span>\${match.venue || 'Stadium'}</span>
            </div>
          </div>
          
          <div class="match-card-row">
            <div class="match-card-team home">
              <img src="\${match.home_logo}" alt="\${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
              <span class="match-card-team-name" style="\${homeNameStyle}">\${renderTeamNameHTML(match.home_team)}</span>
            </div>
            
            <div class="match-card-timebox" style="background: rgba(255,255,255,0.05);">
              <span>\${match.home_score} - \${match.away_score}</span>
            </div>
            
            <div class="match-card-team away">
              <img src="\${match.away_logo}" alt="\${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
              <span class="match-card-team-name" style="\${awayNameStyle}">\${renderTeamNameHTML(match.away_team)}</span>
            </div>
          </div>
          
          \${match.goals && match.goals.length > 0 ? \`
          <div style="display: flex; justify-content: space-between; font-size: 0.8em; padding: 0 20px 10px; color: #a0aec0;">
            <div style="flex:1;">\${match.goals.filter(g => g.team === 'home').map(g => \`<div>\${g.player} \${g.minute}'</div>\`).join('')}</div>
            <div style="flex:1; text-align:right;">\${match.goals.filter(g => g.team === 'away').map(g => \`<div>\${g.player} \${g.minute}'</div>\`).join('')}</div>
          </div>\` : ''}
          
          <div class="match-card-footer">
            <span class="match-card-footer-text">FULL TIME</span>
            <div class="match-card-providers">
               <!-- Channels could go here if stored in result -->
            </div>
          </div>
        </a>\``;
    }
    return match;
});

fs.writeFileSync('index.html', html);
