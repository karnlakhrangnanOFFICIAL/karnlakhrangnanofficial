const fs = require('fs');

let content = fs.readFileSync('match-detail.html.bak', 'utf-8');

const newStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
    
    :root {
      --bg: #0c0c0e;
      --ink: #ffffff;
      --accent: #0033A0;
      --ink-faint: rgba(255, 255, 255, 0.08);
      --ink-muted: rgba(255, 255, 255, 0.5);
      --gold: #D4AF37;
    }
    
    body {
      background-color: var(--bg);
      color: var(--ink);
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* Variation 5 Layout additions */
    .match-hero-minimal {
      text-align: center;
      border-bottom: 1px solid var(--ink-faint);
      padding-bottom: 40px;
      margin-bottom: 40px;
      margin-top: 20px;
    }
    .meta-label {
      font-family: 'Space Mono', monospace;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--gold);
      margin-bottom: 24px;
      display: block;
    }
    .scoreboard-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 40px;
      margin-top: 20px;
    }
    @media (max-width: 768px) {
      .scoreboard-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .details-grid {
        grid-template-columns: 1fr !important;
      }
      .sidebar-meta {
        border-right: none !important;
        border-bottom: 1px solid var(--ink-faint);
        padding-right: 0 !important;
        padding-bottom: 30px;
        margin-bottom: 30px;
      }
    }
    .team-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .team-box img.team-logo { width: 120px; height: 120px; object-fit: contain; margin-bottom: 0; }
    .team-name-display {
      font-family: 'Syne', sans-serif;
      font-size: 1.25rem;
      text-transform: uppercase;
      margin: 0;
    }
    .score-main {
      font-family: 'Syne', sans-serif;
      font-size: 6rem;
      line-height: 0.85;
      letter-spacing: -0.05em;
    }
    .match-status {
      font-family: 'Space Mono', monospace;
      font-size: 0.75rem;
      background: var(--ink);
      color: var(--bg);
      padding: 4px 12px;
      margin-top: 16px;
      display: inline-block;
      text-transform: uppercase;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 60px;
      align-items: start;
    }
    .sidebar-meta {
      display: flex;
      flex-direction: column;
      gap: 32px;
      border-right: 1px solid var(--ink-faint);
      padding-right: 40px;
    }
    .meta-item { margin-bottom: 12px; }
    .sidebar-meta .label {
      font-family: 'Space Mono', monospace;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--ink-muted);
      display: block;
      margin-bottom: 4px;
    }
    .sidebar-meta .value { font-size: 0.9rem; font-weight: 500; }
    
    /* Adapt original events/goals to V5 style somewhat */
    .goals-card {
      margin-top: 0;
      background: none; border: none; padding: 0; box-shadow: none;
    }
    .goals-card h3 { display: none; } /* Hide old title since we use sidebar label */
    .goals-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
    }
    .col-team-name {
      font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--ink-muted);
      border-bottom: 1px solid var(--ink-faint); padding-bottom: 8px; margin-bottom: 12px;
    }
    .goals-list li {
      display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--ink-faint); font-size: 0.85rem;
    }
    .goals-list img.goal-player-img { width: 32px; height: 40px; object-fit: cover; border-radius: 2px; }
    .goals-list .goal-time { font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--gold); margin-left: auto; }
    .goals-list .no-goals { justify-content: center; color: var(--ink-muted); }

    .events-card { background: none; border: none; padding: 0; box-shadow: none; }
    .event-item {
      display: grid !important;
      grid-template-columns: 60px auto 1fr !important;
      gap: 16px;
      padding: 16px 0 !important;
      border-bottom: 1px solid var(--ink-faint) !important;
      align-items: center !important;
      background: none !important; margin: 0 !important; border-radius: 0 !important;
    }
    .event-item::before { display: none; }
    .event-time { font-family: 'Space Mono', monospace; font-weight: 700; color: var(--gold); font-size: 1rem; width: auto; background: none; box-shadow: none; padding: 0;}
    .event-icon-box { background: none; box-shadow: none; width: 24px; height: 24px; border: none; z-index: 1;}
    .event-details { display: flex; align-items: center; gap: 12px; margin-left: 0;}
    .event-title { font-size: 0.75rem; color: var(--ink-muted); font-weight: normal; margin-left: auto; background: none; padding: 0;}
    .event-desc { font-weight: 600; font-size: 0.9rem; }
    
    .section-title, .section-subtitle, h3.section-subtitle {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      text-transform: uppercase;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--ink);
      padding-bottom: 8px;
      display: inline-block;
      color: var(--ink);
      width: 100%;
    }
    .lineups-card, .commentary-card, .video-card {
      background: none !important; border: none !important; padding: 0 !important; margin-top: 40px !important; box-shadow: none !important;
    }
    .pitch-container { border: 1px solid var(--ink-faint); }
  </style>
</head>`;
content = content.replace('</head>', newStyles);

const templateRegex = /container\.innerHTML = `[\s\S]*?`;\s+if \(typeof updateUIText === 'function'\) updateUIText\(\);/m;

const newTemplate = `
      const isHomeChelsea = match.home_team && match.home_team.toLowerCase().includes('chelsea');
      const isAwayChelsea = match.away_team && match.away_team.toLowerCase().includes('chelsea');
      const sHome = match.home_score !== null ? match.home_score : '-';
      const sAway = match.away_score !== null ? match.away_score : '-';

      container.innerHTML = \`
        <div style="text-align: left; margin-bottom: 1.5rem;">
          <a href="\${backHref}" class="back-link" style="font-family: 'Space Mono', monospace; text-transform: uppercase; font-size: 0.75rem;">\${backText}</a>
        </div>
        
        <header class="match-hero-minimal">
          <span class="meta-label">\${compName}</span>
          <div class="scoreboard-grid">
            <div class="team-box">
              <img src="\${match.home_logo}" alt="\${match.home_team}" class="team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
              <h2 class="team-name-display" style="\${isHomeChelsea ? 'color:var(--gold)' : ''}">\${renderTeamNameHTML(match.home_team)}</h2>
            </div>
            <div class="team-box">
              <div class="score-main">\${sHome}-\${sAway}</div>
              \${match.status === 'live' ? \`<div class="match-status" style="background:red;color:white;">\${match.time_live || 'LIVE'}</div>\` : (match.status === 'completed' ? '<div class="match-status">FULL TIME</div>' : '<div class="match-status" style="background:var(--ink-muted);">UPCOMING</div>')}
            </div>
            <div class="team-box">
              <img src="\${match.away_logo}" alt="\${match.away_team}" class="team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
              <h2 class="team-name-display" style="\${isAwayChelsea ? 'color:var(--gold)' : ''}">\${renderTeamNameHTML(match.away_team)}</h2>
            </div>
          </div>
        </header>

        <div class="details-grid">
          <aside class="sidebar-meta">
            <div>
              <div class="meta-item">
                <span class="label">Date</span>
                <span class="value">\${formatDate(displayDate, window.currentLang || 'th')}</span>
              </div>
              <div class="meta-item">
                <span class="label">Kick Off</span>
                <span class="value">\${displayTime}</span>
              </div>
              <div class="meta-item">
                <span class="label">Venue</span>
                <span class="value">\${match.venue}</span>
              </div>
              \${channelsHtml ? \`<div class="meta-item" style="margin-top:20px;"><span class="label">Broadcaster</span><span class="value">\${channelsHtml}</span></div>\` : ''}
            </div>

            <div>
              <span class="label" style="border-bottom: 1px solid var(--ink-faint); padding-bottom: 8px; margin-bottom: 12px; font-size: 0.9rem; color: var(--ink);">Goalscorers</span>
              \${goalsHtml}
            </div>
          </aside>

          <section class="events-log">
            \${eventsHtml}
            \${lineupsHtml}
            \${commentaryHtml}
            \${videoHtml}
          </section>
        </div>
      \`;
      if (typeof updateUIText === 'function') updateUIText();
`;

content = content.replace(templateRegex, newTemplate);

fs.writeFileSync('match-detail.html', content);
console.log('match-detail.html updated successfully.');
