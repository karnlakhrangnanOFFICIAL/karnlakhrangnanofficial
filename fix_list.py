import re

with open('index.html', 'r') as f:
    html = f.read()

# Fix renderResults
res_target = r'''        const teamBadgeClass = teamBadge\.toLowerCase\(\);

        return `
        <a href="match-detail.html\?id=\$\{match\.id\}" class="card-link">
          <div class="card">
            <div class="card-header">
              <div class="card-date"><span class="date-icon">📅</span><span>\$\{formatDate\(displayDate, window\.currentLang\|\|'th'\)\}</span></div>
              <div class="card-competition">
                \$\{match\.competition_logo \? \`<img src="\$\{match\.competition_logo\}" alt="" onerror="this\.style\.display='none'" style="height:20px;">\` : ''\}
                <span>\$\{compName\}</span>
                <span class="team-badge \$\{teamBadgeClass\}">\$\{teamBadge\}</span>
              </div>
            </div>
            <div class="card-result">
              <div class="team \$\{homeWin \? 'winner' : ''\}">
                <img src="\$\{match\.home_logo\}" alt="\$\{match\.home_team\}" onerror="this\.src='assets/images/placeholder-team\.svg'">
                <div class="team-divider"></div>
                <span class="team-name">\$\{renderTeamNameHTML\(match\.home_team\)\}</span>
              </div>
              <div class="score-display">
                <span class="score \$\{homeWin \? 'winner' : ''\}">\$\{match\.home_score\}</span>
                <span class="score-divider">-</span>
                <span class="score \$\{awayWin \? 'winner' : ''\}">\$\{match\.away_score\}</span>
              </div>
              <div class="team \$\{awayWin \? 'winner' : ''\}">
                <img src="\$\{match\.away_logo\}" alt="\$\{match\.away_team\}" onerror="this\.src='assets/images/placeholder-team\.svg'">
                <div class="team-divider"></div>
                <span class="team-name">\$\{renderTeamNameHTML\(match\.away_team\)\}</span>
              </div>
            </div>'''

res_replace = '''        const teamBadgeClass = teamBadge.toLowerCase();
        
        const homeStr = match.home_team.toLowerCase();
        const awayStr = match.away_team.toLowerCase();
        const isChelseaHome = homeStr.includes('chelsea') || homeStr === 'kanlakhrangnan';
        const isChelseaAway = awayStr.includes('chelsea') || awayStr === 'kanlakhrangnan';
        
        let homeNameStyle = '';
        let awayNameStyle = '';
        
        if (isChelseaHome) {
            if (homeWin) homeNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
            else if (awayWin) homeNameStyle = 'color: #888888; font-weight: normal;';
        }
        if (isChelseaAway) {
            if (awayWin) awayNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
            else if (homeWin) awayNameStyle = 'color: #888888; font-weight: normal;';
        }

        return `
        <a href="match-detail.html?id=${match.id}" class="card-link">
          <div class="card">
            <div class="card-header">
              <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(displayDate, window.currentLang||'th')}</span></div>
              <div class="card-competition">
                ${match.competition_logo ? \`<img src="${match.competition_logo}" alt="" onerror="this.style.display='none'" style="height:20px;">\` : ''}
                <span>${compName}</span>
                <span class="team-badge ${teamBadgeClass}">${teamBadge}</span>
              </div>
            </div>
            <div class="card-result">
              <div class="team ${homeWin ? 'winner' : ''}">
                <img src="${match.home_logo}" alt="${match.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name" style="${homeNameStyle}">${renderTeamNameHTML(match.home_team)}</span>
              </div>
              <div class="score-display">
                <span class="score ${homeWin ? 'winner' : ''}">${match.home_score}</span>
                <span class="score-divider">-</span>
                <span class="score ${awayWin ? 'winner' : ''}">${match.away_score}</span>
              </div>
              <div class="team ${awayWin ? 'winner' : ''}">
                <img src="${match.away_logo}" alt="${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name" style="${awayNameStyle}">${renderTeamNameHTML(match.away_team)}</span>
              </div>
            </div>'''
            
html = re.sub(res_target, res_replace, html)

with open('index.html', 'w') as f:
    f.write(html)
    
print("Replaced!")
