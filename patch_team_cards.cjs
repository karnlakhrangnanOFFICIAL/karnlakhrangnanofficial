const fs = require('fs');
let js = fs.readFileSync('assets/js/team.js', 'utf8');

// The logic in team.js uses <div class="card"> instead of <div class="match-card"> from the brief.
// I will rewrite `renderFixtures` and `renderResults` in team.js to use the exact same template logic.
// However, the brief says "ทำแบบเดียวกันให้เหมือนกัน ทั้งหน้าทีมชายและทีมหญิง แต่!ต้องซ่อนข้อความ upcoming match และ Full time แถวบรรทัดสุดท้ายของใบการ์ด"
// Let's use the code from index.html for match-card and replace `renderFixtures` and `renderResults` in team.js

// Wait, team.js also renders goalscorers for results. I should keep that.
// Let's just modify the HTML template in team.js.

// For renderFixtures
let newRenderFixtures = `function renderFixtures(container, fixtures, badgeClass) {
  if (!container) return;
  const lang = window.currentLang || 'th';
  if (fixtures.length === 0) {
    const noMsg = lang === 'th' ? 'ไม่มีโปรแกรมแข่งขัน' : 'No upcoming fixtures';
    container.innerHTML = \\\`<div class="empty-state"><span class="empty-icon">📅</span><p>\\\${noMsg}</p></div>\\\`;
    return;
  }
  const timeNote = lang === 'th' 
    ? 'ℹ️ เวลาการแข่งขันแสดงเป็นเวลาประเทศอังกฤษ (UK Time - GMT/BST)' 
    : 'ℹ️ Match times are displayed in UK Time (GMT/BST)';
  const cardsHtml = fixtures.map((match, index) => {
    const compLogo = match.competition_logo || '';
    const compName = formatCompetitionName(match.competition_name || match.competition);
    const localDT = window.getLocalMatchDateTime ? window.getLocalMatchDateTime(match.date, match.time_th || match.time, match.time_uk) : { date: match.date, time: (match.time_uk || match.time_th || match.time || 'TBC').substring(0,5) };
    const displayDate = localDT.date;
    const displayTime = localDT.time === 'TBC' ? 'TBC' : localDT.time;
    
    let channelsIcons = '';
    if (match.channels && match.channels.length > 0) {
        channelsIcons = match.channels.map(ch => {
            let chName = typeof ch === 'string' ? ch : (ch.name || '');
            let iconUrl = (ch && typeof ch === 'object' && ch.logo) ? ch.logo : 'databases/logo/channels/default.png';
            if (!ch.logo) {
                if (chName.toLowerCase().includes('true')) iconUrl = 'databases/logo/channels/true_premier.png';
                else if (chName.toLowerCase().includes('bein')) iconUrl = 'databases/logo/channels/bein.png';
                else if (chName.toLowerCase().includes('pptv')) iconUrl = 'databases/logo/channels/pptv.png';
                else if (chName.toLowerCase().includes('apple')) iconUrl = 'databases/logo/channels/apple.png';
            }
            return \\\`<img src="\\\${iconUrl}" class="channel-icon" alt="\\\${chName}" title="\\\${chName}" onerror="this.style.display='none'">\\\`;
        }).join('');
    }

    const teamParam = badgeClass === 'W' ? '&team=women' : '&team=men';
    
    const homeStr = match.home_team.toLowerCase();
    const awayStr = match.away_team.toLowerCase();
    const isChelseaHome = homeStr.includes('chelsea') || homeStr === 'kanlakhrangnan';
    const isChelseaAway = awayStr.includes('chelsea') || awayStr === 'kanlakhrangnan';
    
    let homeNameStyle = 'color: #ffffff;';
    let awayNameStyle = 'color: #ffffff;';
    if (isChelseaHome) homeNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
    if (isChelseaAway) awayNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
    const teamBadgeClass = badgeClass.toLowerCase();

    return \\\`
    <a href="match-detail.html?id=\\\${match.id}\\\${teamParam}" class="card-link match-card" style="animation-delay: \\\${index * 0.05}s; text-decoration: none; display: block;">
      <div class="match-card-top">
        <div class="match-card-date">📅 \\\${formatDate(displayDate, lang)}</div>
        <div class="match-card-league">
          \\\${compLogo ? \\\\\\\`<img src="\\\${compLogo}" alt="">\\\\\\\` : ''}
          <span>\\\${compName} <span class="team-badge \\\${teamBadgeClass}">\\\${badgeClass}</span></span>
        </div>
        <div class="match-card-venue">
          <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
          <span>\\\${match.venue || 'Stadium'}</span>
        </div>
      </div>
      
      <div class="match-card-row">
        <div class="match-card-team home">
          <img src="\\\${match.home_logo}" alt="\\\${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="\\\${homeNameStyle}">\\\${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.home_team) : match.home_team}</span>
        </div>
        
        <div class="match-card-timebox">
          \\\${match.status === 'live' ? \\\\\\\`<span style="color:var(--primary-color);">\\\${match.home_score||0} - \\\${match.away_score||0}</span>\\\\\\\` : \\\\\\\`<span>\\\${displayTime}</span>\\\\\\\`}
        </div>
        
        <div class="match-card-team away">
          <img src="\\\${match.away_logo}" alt="\\\${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="\\\${awayNameStyle}">\\\${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
        </div>
      </div>
      
      <div class="match-card-footer team-page-footer">
        <span class="match-card-footer-text team-page-hide-text">\\\${match.status === 'live' ? 'LIVE NOW' : 'UPCOMING MATCH'}</span>
        <div class="match-card-providers">
          \\\${channelsIcons}
        </div>
      </div>
    </a>\\\`;
  }).join('');
  container.innerHTML = \\\`<div class="time-zone-note" style="font-size:0.8rem; color:var(--text-muted, #94a3b8); margin-bottom:0.75rem; font-weight:500;">\\\${timeNote}</div>\\\${cardsHtml}\\\`;
}`;

let newRenderResults = `function renderResults(container, results, badgeClass) {
  if (!container) return;
  const lang = window.currentLang || 'th';
  if (results.length === 0) {
    const noMsg = lang === 'th' ? 'ยังไม่มีผลการแข่งขัน' : 'No results yet';
    container.innerHTML = \\\`<div class="empty-state"><span class="empty-icon">📊</span><p>\\\${noMsg}</p></div>\\\`;
    return;
  }
  const teamParam = badgeClass === 'W' ? '&team=women' : '&team=men';
  container.innerHTML = results.map((match, index) => {
    const localDT = window.getLocalMatchDateTime ? window.getLocalMatchDateTime(match.date, match.time_th || match.time, match.time_uk) : { date: match.date };
    const displayDate = localDT.date;
    const homeWin = match.home_score > match.away_score;
    const awayWin = match.away_score > match.home_score;
    const compName = formatCompetitionName(match.competition_name || match.competition);
    const compLogo = match.competition_logo || '';
    const teamBadgeClass = badgeClass.toLowerCase();
    
    const homeStr = match.home_team.toLowerCase();
    const awayStr = match.away_team.toLowerCase();
    const isChelseaHome = homeStr.includes('chelsea') || homeStr === 'kanlakhrangnan';
    const isChelseaAway = awayStr.includes('chelsea') || awayStr === 'kanlakhrangnan';
    
    let homeNameStyle = 'color: #ffffff;';
    let awayNameStyle = 'color: #ffffff;';
    if (isChelseaHome) homeNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
    if (isChelseaAway) awayNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';

    let channelsIcons = '';
    
    let scorersHtml = '';
    if (match.status === 'completed' && match.goals && match.goals.length > 0) {
      scorersHtml = \\\\\\\`
        <div class="card-goalscorers" style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 0 20px 10px; margin-top: -15px; opacity: 0.8; font-family: var(--font-body);">
          <div class="home-scorers" style="text-align: left; flex: 1; padding-right: 10px; \\\${match.goals.filter(g => g.team === 'away').length > 0 ? 'border-right: 1px solid rgba(255,255,255,0.1);' : ''}">
            \\\${match.goals.filter(g => g.team === 'home').map(g => \\\\\\\`<div>\\\${g.player.replace(/\\\(OG\\\)/i, '(OG)').replace(/\\\(Pen\\\)/i, '(Pen)')} \\\${g.minute}'</div>\\\\\\\`).join('')}
          </div>
          <div class="away-scorers" style="text-align: right; flex: 1; padding-left: 10px;">
            \\\${match.goals.filter(g => g.team === 'away').map(g => \\\\\\\`<div>\\\${g.player.replace(/\\\(OG\\\)/i, '(OG)').replace(/\\\(Pen\\\)/i, '(Pen)')} \\\${g.minute}'</div>\\\\\\\`).join('')}
          </div>
        </div>\\\\\\\`;
    }

    return \\\`
    <a href="match-detail.html?id=\\\${match.id}\\\${teamParam}" class="card-link match-card" style="animation-delay: \\\${index * 0.05}s; text-decoration: none; display: block;">
      <div class="match-card-top">
        <div class="match-card-date">📅 \\\${formatDate(displayDate, lang)}</div>
        <div class="match-card-league">
          \\\${compLogo ? \\\\\\\`<img src="\\\${compLogo}" alt="">\\\\\\\` : ''}
          <span>\\\${compName} <span class="team-badge \\\${teamBadgeClass}">\\\${badgeClass}</span></span>
        </div>
        <div class="match-card-venue">
          <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
          <span>\\\${match.venue || 'Stadium'}</span>
        </div>
      </div>
      
      <div class="match-card-row">
        <div class="match-card-team home">
          <img src="\\\${match.home_logo}" alt="\\\${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="\\\${homeNameStyle}">\\\${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.home_team) : match.home_team}</span>
        </div>
        
        <div class="match-card-timebox">
          <span style="color:var(--primary-color);">\\\${match.home_score} - \\\${match.away_score}</span>
        </div>
        
        <div class="match-card-team away">
          <img src="\\\${match.away_logo}" alt="\\\${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="\\\${awayNameStyle}">\\\${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
        </div>
      </div>
      
      \\\${scorersHtml}
      
      <div class="match-card-footer team-page-footer">
        <span class="match-card-footer-text team-page-hide-text">FULL TIME</span>
        <div class="match-card-providers">
          \\\${channelsIcons}
        </div>
      </div>
    </a>\\\`;
  }).join('');
}`;

js = js.replace(/function renderFixtures\(container, fixtures, badgeClass\) \{[\s\S]*?function renderResults\(container, results, badgeClass\) \{/m, newRenderFixtures + "\n\n" + "function renderResults(container, results, badgeClass) {");

js = js.replace(/function renderResults\(container, results, badgeClass\) \{[\s\S]*?function renderTable\(container, table, highlightTeam, compLogo, compName\) \{/m, newRenderResults + "\n\n" + "function renderTable(container, table, highlightTeam, compLogo, compName) {");

fs.writeFileSync('assets/js/team.js', js);
