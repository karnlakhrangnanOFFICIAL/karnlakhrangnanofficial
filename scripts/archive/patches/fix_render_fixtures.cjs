const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = `      }).join('');
    }

    // ---------- RENDER RESULTS (CARDS) ----------`;

const replacement = `      }).join('');
      content.innerHTML = htmlContent;
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 10);
    }

    // ---------- RENDER FIXTURES (CARDS) ----------
    function renderFixtures(fixtures) {
      const container = document.getElementById('fixturesContainer');
      if (fixtures.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p data-i18n="home.no_fixtures">ยังไม่มีโปรแกรมการแข่งขัน</p></div>';
        return;
      }
      
      container.innerHTML = fixtures.map((match, index) => {
        const localDT = window.getLocalMatchDateTime ? window.getLocalMatchDateTime(match.date, match.time_th || match.time, match.time_uk) : { date: match.date };
        const displayDate = localDT.date;
        const displayTime = localDT.time;
        const compName = formatCompetitionName(match.competition_name);
        const compLogo = match.competition_logo;
        const teamBadge = match.team_type || 'M';
        const teamBadgeClass = teamBadge.toLowerCase();
        
        let channelsIcons = '';
        if (match.channels && match.channels.length > 0) {
            channelsIcons = match.channels.map(ch => {
                let iconUrl = 'databases/logo/channels/default.png';
                if (ch.toLowerCase().includes('true')) iconUrl = 'databases/logo/channels/true_premier.png';
                else if (ch.toLowerCase().includes('bein')) iconUrl = 'databases/logo/channels/bein.png';
                else if (ch.toLowerCase().includes('pptv')) iconUrl = 'databases/logo/channels/pptv.png';
                else if (ch.toLowerCase().includes('apple')) iconUrl = 'databases/logo/channels/apple.png';
                return \`<img src="\${iconUrl}" class="channel-icon" alt="\${ch}" title="\${ch}" onerror="this.style.display='none'">\`;
            }).join('');
        }

        const homeStr = match.home_team.toLowerCase();
        const awayStr = match.away_team.toLowerCase();
        const isChelseaHome = homeStr.includes('chelsea') || homeStr === 'kanlakhrangnan';
        const isChelseaAway = awayStr.includes('chelsea') || awayStr === 'kanlakhrangnan';
        
        let homeNameStyle = 'color: #ffffff;';
        let awayNameStyle = 'color: #ffffff;';
        if (isChelseaHome) homeNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
        if (isChelseaAway) awayNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';

        return \`
        <a href="match-detail.html?id=\${match.id}" class="card-link match-card" style="animation-delay: \${index * 0.05}s; text-decoration: none; display: block;">
          <div class="match-card-top">
            <div class="match-card-date">📅 \${formatDate(displayDate, window.currentLang||'th')}</div>
            <div class="match-card-league">
              \${compLogo ? \\\`<img src="\${compLogo}" alt="">\\\` : ''}
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
            
            <div class="match-card-timebox">
              \${match.status === 'live' ? \\\`<span style="color:var(--primary-color);">\${match.home_score||0} - \${match.away_score||0}</span>\\\` : \\\`<span>\${displayTime}</span>\\\`}
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
        </a>\`;
      }).join('');
    }

    // ---------- RENDER RESULTS (CARDS) ----------`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('index.html', html);
  console.log("Successfully replaced");
} else {
  console.log("Target not found!");
}
