import re

with open('index.html', 'r') as f:
    html = f.read()

fix_target = r'''        const channelsIcons = \(match\.channels && match\.channels\.length > 0\)
          \? \`<div class="channels-list">\$\{match\.channels\.map\(ch => 
              \`<span class="channel-badge" title="\$\{ch\.name\}">
                \$\{ch\.logo \? \`<img src="\$\{ch\.logo\}" alt="\$\{ch\.name\}" title="\$\{ch\.name\}" class="channel-logo" onerror="this\.style\.display='none'">\` : \`<span class="channel-name">\$\{ch\.name\}</span>\`\}
              </span>\`
            \)\.join\(''\)\}</div>\`
          : '';

        return `
        <a href="match-detail.html\?id=\$\{match\.id\}" class="card-link">
          <div class="card">
            <div class="card-header">
              <div class="card-date"><span class="date-icon">📅</span><span>\$\{formatDate\(displayDate, window\.currentLang\|\|'th'\)\}</span></div>
              <div class="card-competition">
                \$\{compLogo \? \`<img src="\$\{compLogo\}" alt="" onerror="this\.style\.display='none'" style="height:20px;">\` : ''\}
                <span>\$\{compName\}</span>
                <span class="team-badge \$\{teamBadgeClass\}">\$\{teamBadge\}</span>
              </div>
            </div>
            <div class="card-fixture">
              <div class="team">
                <img src="\$\{match\.home_logo\}" alt="\$\{match\.home_team\}" title="\$\{match\.home_team\}" onerror="this\.src='assets/images/placeholder-team\.svg'">
                <div class="team-divider"></div>
                <span class="team-name">\$\{renderTeamNameHTML\(match\.home_team\)\}</span>
              </div>
              <div class="fixture-info">
                \$\{match\.status === 'live' \? \`<div style="display:flex; gap:10px; font-size:1.5rem; font-weight:bold;"><span style="color:var\(--primary-color\);">\$\{match\.home_score\|\|0\}</span><span>-</span><span style="color:var\(--primary-color\);">\$\{match\.away_score\|\|0\}</span></div>\` : '<span class="fixture-vs">VS</span>'\}
                <span class="fixture-time" \$\{match\.status==='live' \? 'style="margin-top:5px;"' : ''\}>\$\{displayTime\}</span>
              </div>
              <div class="team">
                <img src="\$\{match\.away_logo\}" alt="\$\{match\.away_team\}" title="\$\{match\.away_team\}" onerror="this\.src='assets/images/placeholder-team\.svg'">
                <div class="team-divider"></div>
                <span class="team-name">\$\{renderTeamNameHTML\(match\.away_team\)\}</span>
              </div>
            </div>'''

fix_replace = '''        const channelsIcons = (match.channels && match.channels.length > 0)
          ? `<div class="channels-list">${match.channels.map(ch => 
              `<span class="channel-badge" title="${ch.name}">
                ${ch.logo ? \`<img src="${ch.logo}" alt="${ch.name}" title="${ch.name}" class="channel-logo" onerror="this.style.display='none'">\` : \`<span class="channel-name">${ch.name}</span>\`}
              </span>`
            ).join('')}</div>`
          : '';

        const homeStr = match.home_team.toLowerCase();
        const awayStr = match.away_team.toLowerCase();
        const isChelseaHome = homeStr.includes('chelsea') || homeStr === 'kanlakhrangnan';
        const isChelseaAway = awayStr.includes('chelsea') || awayStr === 'kanlakhrangnan';
        
        let homeNameStyle = '';
        let awayNameStyle = '';
        
        if (match.status === 'live') {
            const homeWin = match.home_score > match.away_score;
            const awayWin = match.away_score > match.home_score;
            if (isChelseaHome) {
                if (homeWin) homeNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
                else if (awayWin) homeNameStyle = 'color: #888888; font-weight: normal;';
            }
            if (isChelseaAway) {
                if (awayWin) awayNameStyle = 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);';
                else if (homeWin) awayNameStyle = 'color: #888888; font-weight: normal;';
            }
        }

        return `
        <a href="match-detail.html?id=${match.id}" class="card-link">
          <div class="card">
            <div class="card-header">
              <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(displayDate, window.currentLang||'th')}</span></div>
              <div class="card-competition">
                ${compLogo ? \`<img src="${compLogo}" alt="" onerror="this.style.display='none'" style="height:20px;">\` : ''}
                <span>${compName}</span>
                <span class="team-badge ${teamBadgeClass}">${teamBadge}</span>
              </div>
            </div>
            <div class="card-fixture">
              <div class="team">
                <img src="${match.home_logo}" alt="${match.home_team}" title="${match.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name" style="${homeNameStyle}">${renderTeamNameHTML(match.home_team)}</span>
              </div>
              <div class="fixture-info">
                ${match.status === 'live' ? \`<div style="display:flex; gap:10px; font-size:1.5rem; font-weight:bold;"><span style="color:var(--primary-color);">${match.home_score||0}</span><span>-</span><span style="color:var(--primary-color);">${match.away_score||0}</span></div>\` : '<span class="fixture-vs">VS</span>'}
                <span class="fixture-time" ${match.status==='live' ? 'style="margin-top:5px;"' : ''}>${displayTime}</span>
              </div>
              <div class="team">
                <img src="${match.away_logo}" alt="${match.away_team}" title="${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
                <div class="team-divider"></div>
                <span class="team-name" style="${awayNameStyle}">${renderTeamNameHTML(match.away_team)}</span>
              </div>
            </div>'''
            
html = re.sub(fix_target, fix_replace, html)

with open('index.html', 'w') as f:
    f.write(html)
    
print("Replaced Fixtures!")
