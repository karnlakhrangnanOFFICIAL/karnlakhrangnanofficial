// ============================================
// KARN LA KHRANg NAN Official - Team Page JS
// ============================================

const API_PLAYERS_MEN = 'https://script.google.com/macros/s/AKfycbx1XcMAxsYaTm7AvRPg8q1CtiyXrCJXp27LX-Lh5V36JdBWPF87yXuyhkZm6hqwJAU3/exec?team=men';
const API_PLAYERS_WOMEN = 'https://script.google.com/macros/s/AKfycbx1XcMAxsYaTm7AvRPg8q1CtiyXrCJXp27LX-Lh5V36JdBWPF87yXuyhkZm6hqwJAU3/exec?team=women';

// ---------- TAB SYSTEM ----------
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const targetTab = document.getElementById('tab-' + tabName);
  if (targetTab) targetTab.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
  });
}

function initTabButtons() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');
      if (tabName) showTab(tabName);
    });
  });
}

// ---------- FORMAT DATE ----------
function formatDate(dateString, lang) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  if (lang === 'th') {
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  }
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCompetitionName(name) {
  if (!name) return '';
  return name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function renderFixtures(container, fixtures, badgeClass) {
  if (!container) return;
  const lang = window.currentLang || 'th';
  if (fixtures.length === 0) {
    const noMsg = lang === 'th' ? 'ไม่มีโปรแกรมแข่งขัน' : 'No upcoming fixtures';
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">📅</span><p>${noMsg}</p></div>`;
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
            return `<img src="${iconUrl}" class="channel-icon" alt="${chName}" title="${chName}" onerror="this.style.display='none'">`;
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

    return `
    <a href="match-detail.html?id=${match.id}${teamParam}" class="card-link match-card" style="animation-delay: ${index * 0.05}s; text-decoration: none; display: block;">
      <div class="match-card-top">
        <div class="match-card-date">📅 ${formatDate(displayDate, lang)}</div>
        <div class="match-card-league">
          ${compLogo ? `<img src="${compLogo}" alt="">` : ''}
          <span>${compName} <span class="team-badge ${teamBadgeClass}">${badgeClass}</span></span>
        </div>
        <div class="match-card-venue">
          <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
          <span>${match.venue || 'Stadium'}</span>
        </div>
      </div>
      
      <div class="match-card-row">
        <div class="match-card-team home">
          <img src="${match.home_logo}" alt="${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${homeNameStyle}">${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.home_team) : match.home_team}</span>
        </div>
        
        <div class="match-card-timebox">
          ${match.status === 'live' ? `<span style="color:var(--primary-color);">${match.home_score||0} - ${match.away_score||0}</span>` : `<span>${displayTime}</span>`}
        </div>
        
        <div class="match-card-team away">
          <img src="${match.away_logo}" alt="${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${awayNameStyle}">${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
        </div>
      </div>
      
      <div class="match-card-footer team-page-footer">
        <span class="match-card-footer-text team-page-hide-text">${match.status === 'live' ? 'LIVE NOW' : 'UPCOMING MATCH'}</span>
        <div class="match-card-providers">
          ${channelsIcons}
        </div>
      </div>
    </a>`;
  }).join('');
  container.innerHTML = `<div class="time-zone-note" style="font-size:0.8rem; color:var(--text-muted, #94a3b8); margin-bottom:0.75rem; font-weight:500;">${timeNote}</div>${cardsHtml}`;
}

function renderResults(container, results, badgeClass) {
  if (!container) return;
  const lang = window.currentLang || 'th';
  if (results.length === 0) {
    const noMsg = lang === 'th' ? 'ยังไม่มีผลการแข่งขัน' : 'No results yet';
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">📊</span><p>${noMsg}</p></div>`;
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
      scorersHtml = `
        <div class="card-goalscorers" style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 0 20px 10px; margin-top: -15px; opacity: 0.8; font-family: var(--font-body);">
          <div class="home-scorers" style="text-align: left; flex: 1; padding-right: 10px; ${match.goals.filter(g => g.team === 'away').length > 0 ? 'border-right: 1px solid rgba(255,255,255,0.1);' : ''}">
            ${match.goals.filter(g => g.team === 'home').map(g => `<div>${g.player.replace(/\(OG\)/i, '(OG)').replace(/\(Pen\)/i, '(Pen)')} ${g.minute}'</div>`).join('')}
          </div>
          <div class="away-scorers" style="text-align: right; flex: 1; padding-left: 10px;">
            ${match.goals.filter(g => g.team === 'away').map(g => `<div>${g.player.replace(/\(OG\)/i, '(OG)').replace(/\(Pen\)/i, '(Pen)')} ${g.minute}'</div>`).join('')}
          </div>
        </div>`;
    }

    return `
    <a href="match-detail.html?id=${match.id}${teamParam}" class="card-link match-card" style="animation-delay: ${index * 0.05}s; text-decoration: none; display: block;">
      <div class="match-card-top">
        <div class="match-card-date">📅 ${formatDate(displayDate, lang)}</div>
        <div class="match-card-league">
          ${compLogo ? `<img src="${compLogo}" alt="">` : ''}
          <span>${compName} <span class="team-badge ${teamBadgeClass}">${badgeClass}</span></span>
        </div>
        <div class="match-card-venue">
          <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
          <span>${match.venue || 'Stadium'}</span>
        </div>
      </div>
      
      <div class="match-card-row">
        <div class="match-card-team home">
          <img src="${match.home_logo}" alt="${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${homeNameStyle}">${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.home_team) : match.home_team}</span>
        </div>
        
        <div class="match-card-timebox">
          <span style="color:var(--primary-color);">${match.home_score} - ${match.away_score}</span>
        </div>
        
        <div class="match-card-team away">
          <img src="${match.away_logo}" alt="${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${awayNameStyle}">${typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
        </div>
      </div>
      
      ${scorersHtml}
      
      <div class="match-card-footer team-page-footer">
        <span class="match-card-footer-text team-page-hide-text">FULL TIME</span>
        <div class="match-card-providers">
          ${channelsIcons}
        </div>
      </div>
    </a>`;
  }).join('');
}

function renderTable(container, table, highlightTeam, compLogo, compName) {
  if (!table || table.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
    return;
  }
  const isWomenPage = window.location.pathname.includes('women') || (compName && compName.toLowerCase().includes('women'));
  const logoHtml = compLogo ? `<div class="table-comp-header" style="display:flex; align-items:center; gap:12px; margin-bottom:1rem; padding:10px 14px; background:var(--surface, rgba(255,255,255,0.04)); border:1px solid var(--border-color, rgba(255,255,255,0.08)); border-radius:8px;"><img src="${compLogo}" alt="${compName || ''}" onerror="this.style.display='none'" style="height:60px; width:60px; object-fit:contain;"><span style="font-weight:700; font-size:1.05rem; color:var(--ink);">${compName || ''}</span></div>` : '';
  container.innerHTML = `
    ${logoHtml}
    <table class="league-table">
      <thead><tr><th title="Rank">#</th><th title="Logo">Logo</th><th title="Team">Team</th><th title="จำนวน Match ที่แข่ง">P</th><th title="ชนะ">W</th><th title="เสมอ">D</th><th title="แพ้">L</th><th title="Goal +">GF</th><th title="Goal -">GA</th><th title="Goal =">GD</th><th title="Point">PTS</th></tr></thead>
      <tbody>
        ${table.map((row, index) => {
          let teamHtml = typeof renderTeamNameHTML === 'function' ? renderTeamNameHTML(row.team) : row.team;
          let posNum = parseInt(row.pos, 10);
          let posClass = '';

          if (isWomenPage) {
            if (posNum >= 1 && posNum <= 2) posClass = 'pos-ucl';
            else if (posNum === 3) posClass = 'pos-uwcl-qual';
            else if (posNum === table.length - 1 && table.length > 3) posClass = 'pos-rel-po';
            else if (posNum === table.length && table.length > 2) posClass = 'pos-rel';
          } else {
            if (posNum >= 1 && posNum <= 4) posClass = 'pos-ucl';
            else if (posNum === 5) posClass = 'pos-uel';
            else if (posNum >= 18) posClass = 'pos-rel';
          }

          return `
          <tr class="${posClass} ${row.team === highlightTeam ? 'highlight' : ''}">
            <td>${row.pos}</td>
            <td class="logo-cell">${row.logo ? `<img src="${row.logo}" alt="${row.team}" class="table-team-logo" onerror="this.style.display='none'">` : ''}</td>
            <td class="team-cell">${teamHtml}</td>
            <td>${row.p}</td><td>${row.w}</td><td>${row.d}</td><td>${row.l}</td>
            <td>${row.gf}</td><td>${row.ga}</td><td>${row.gd}</td>
            <td><strong>${row.pts}</strong></td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>`;
}

function renderPlayers(container, players, teamType) {
  const isTh = (window.currentLang || 'th') === 'th';
  const goalsText = isTh ? 'ประตู' : 'goals';
  const assistsText = isTh ? 'แอสซิสต์' : 'assists';
  const appsText = isTh ? 'นัด' : 'apps';

  
  container.innerHTML = players.map(p => {
    let pos = p.position || '';
    pos = formatPlayerPosition(p.position, isTh);
    let pImage = p.image || 'assets/images/placeholder-player.svg';
    
    let statusBadge = '';
    let opacity = '1';
    
    if (p.status === 'sold') {
      statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#c0392b; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1;">${isTh ? 'ย้ายออก' : 'Sold'}</div>`;
      opacity = '0.6';
    } else if (p.status === 'loaned_out') {
      statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#f39c12; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1;">${isTh ? 'ยืมตัว' : 'Loaned Out'}</div>`;
    } else if (p.status === 'new_signing') {
      statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#27ae60; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1;">${isTh ? 'นักเตะใหม่' : 'New Signing'}</div>`;
    }

    return `
      <a href="player-profile.html?id=${p.id}&team=${teamType}" class="player-card" style="text-decoration: none; color: inherit; display: block; position:relative; opacity: ${opacity};">
        ${statusBadge}
        <img src="${pImage}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/placeholder-player.svg';">
        <div class="player-info">
          <h3>${p.name}</h3>
          <span class="player-number">#${p.number || '?'}</span>
          <span class="player-position">${pos}</span>
          <div class="player-stats">
          ${(() => {

            let tGoals = p.goals || 0, tAssists = p.assists || 0, tApps = p.appearances || 0;
            if (p.stats) {
                tGoals = 0; tAssists = 0; tApps = 0;
                for (let comp in p.stats) {
                    tGoals += p.stats[comp].goals || 0;
                    tAssists += p.stats[comp].assists || 0;
                    tApps += p.stats[comp].appearances || 0;
                }
            }
            return `<span>⚽ ${tGoals} ${goalsText}</span>
            <span>🎯 ${tAssists} ${assistsText}</span>
            <span>👕 ${tApps} ${appsText}</span>`;
          })()}
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// ---------- SAFE FETCH JSON ----------
async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('json') && !contentType.includes('javascript') && !contentType.includes('text/plain')) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn(`Safe fetch failed for ${url}:`, e);
    return null;
  }
}

// ---------- LOAD DATA ----------
async function loadMenFixtures() {
  const container = document.getElementById('menFixturesContainer');
  if (!container) return;
  try {
    let all = await safeFetchJson('data/fixtures.json');
    if (!all || !Array.isArray(all)) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
      return;
    }
    all = all.filter(m => m.team_type === 'M');
    const upcoming = all.filter(m => m.status === 'upcoming' || m.status === 'live').sort((a,b) => {
      let timeA = a.time || '00:00';
      if (timeA === 'TBC') timeA = '00:00';
      let timeB = b.time || '00:00';
      if (timeB === 'TBC') timeB = '00:00';
      return new Date(a.date+'T'+timeA) - new Date(b.date+'T'+timeB);
    });
    renderFixtures(container, upcoming, 'M');
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading fixtures</p></div>';
    console.error('Fixtures error:', e);
  }
}

async function loadMenResults() {
  const container = document.getElementById('menResultsContainer');
  if (!container) return;
  try {
    let all = await safeFetchJson('data/fixtures.json');
    if (!all || !Array.isArray(all)) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
      return;
    }
    all = all.filter(m => m.team_type === 'M');
    const results = all.filter(m => m.status === 'completed').sort((a,b) => new Date(b.date) - new Date(a.date));
    renderResults(container, results, 'M');
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading results</p></div>';
    console.error('Results error:', e);
  }
}


// ---------- SAFE GOOGLE SHEETS FETCH (Client-side) ----------
async function fetchGoogleSheetDirect(spreadsheetId, queryParams = 'gid=0') {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&${queryParams}&headers=1`;
    const res = await fetch(url);
    const text = await res.text();
    if (!text.includes('google.visualization.Query.setResponse')) {
      throw new Error('Failed to query spreadsheet. Ensure it is public.');
    }
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonStr);
    
    if (json.status === 'error') {
      throw new Error(json.errors?.[0]?.detailed_message || 'Error reading spreadsheet');
    }
    
    const table = json.table;
    const cols = table.cols.map((c, i) => (c && c.label && c.label.trim()) ? c.label.trim() : `col_${i}`);
    const rows = table.rows.map(row => {
      const obj = {};
      row.c.forEach((cell, idx) => {
        const val = cell ? (cell.f !== undefined ? cell.f : cell.v) : null;
        if (val !== null && val !== undefined) {
          const colName = cols[idx] || `col_${idx}`;
          obj[colName] = val;
        }
      });
      return obj;
    });
    
    return {
      success: true,
      data: rows
    };
  } catch (err) {
    console.error('Google Sheets Direct Fetch Error:', err);
    return { success: false, error: err.message };
  }
}

async function loadMenTable() {
  const container = document.getElementById('menTableContainer');
  if (!container) return;
  try {
    const SPREADSHEET_ID = '1mdFJwRXRB-xBYiDMJK0LoUD9n3Jf9iF1x6NH1V4W1gY';
    const sheetData = await fetchGoogleSheetDirect(SPREADSHEET_ID, 'gid=0');
    
    let table = [];
    let compLogo = "databases/logo/competitions/men/premier-league.png";
    let compName = "premier-league";

    if (sheetData && sheetData.success && Array.isArray(sheetData.data)) {
      // Use data from Google Sheet
      table = sheetData.data.filter(row => row.pos != null && row.pos !== '');
    } else {
      // Fallback to static file if API fails
      const data = await safeFetchJson('data/tables-men.json');
      table = Array.isArray(data) ? data : (data?.standings || data?.table || []);
      if (data && data.competition_logo) compLogo = data.competition_logo;
      if (data && data.competition) compName = data.competition;
    }

    if (!table || table.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }
    renderTable(container, table, 'Chelsea', compLogo, compName);
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading table</p></div>';
    console.error('Table error:', e);
  }
}

async function loadMenPlayers() {
  const container = document.getElementById('menPlayersContainer');
  if (!container) return;
  try {
    let players = await safeFetchJson('data/players-men.json');

    if (!Array.isArray(players) || players.length === 0) {
      players = await safeFetchJson(API_PLAYERS_MEN);
    }

    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">👕</span><p>No players found</p></div>';
      return;
    }
    renderPlayers(container, players, container.id.includes('women') ? 'women' : 'men');
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>';
    console.error('Players error:', e);
  }
}

// Women functions similar
async function loadWomenFixtures() {
  const container = document.getElementById('womenFixturesContainer');
  if (!container) return;
  try {
    let all = await safeFetchJson('data/fixtures.json');
    if (!all || !Array.isArray(all)) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
      return;
    }
    all = all.filter(m => m.team_type === 'W');
    renderFixtures(container, all.filter(m => m.status === 'upcoming' || m.status === 'live').sort((a,b) => {
      let timeA = a.time || '00:00';
      if (timeA === 'TBC') timeA = '00:00';
      let timeB = b.time || '00:00';
      if (timeB === 'TBC') timeB = '00:00';
      return new Date(a.date+'T'+timeA) - new Date(b.date+'T'+timeB);
    }), 'W');
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

async function loadWomenResults() {
  const container = document.getElementById('womenResultsContainer');
  if (!container) return;
  try {
    let all = await safeFetchJson('data/fixtures.json');
    if (!all || !Array.isArray(all)) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
      return;
    }
    all = all.filter(m => m.team_type === 'W');
    renderResults(container, all.filter(m => m.status === 'completed').sort((a,b) => new Date(b.date)-new Date(a.date)), 'W');
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

async function loadWomenTable() {
  const container = document.getElementById('womenTableContainer');
  if (!container) return;
  try {
    const data = await safeFetchJson('data/tables-women.json');
    if (!data) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }
    const table = Array.isArray(data) ? data : (data.standings || data.table || []);
    const compLogo = data?.competition_logo || '';
    const compName = data?.competition || '';
    renderTable(container, table, 'Chelsea Women', compLogo, compName);
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

async function loadWomenPlayers() {
  const container = document.getElementById('womenPlayersContainer');
  if (!container) return;
  try {
    let players = await safeFetchJson('data/players-women.json');

    if (!Array.isArray(players) || players.length === 0) {
      players = await safeFetchJson(API_PLAYERS_WOMEN);
    }

    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">👕</span><p>No players found</p></div>';
      return;
    }
    renderPlayers(container, players, container.id.includes('women') ? 'women' : 'men');
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>'; console.error('Women players error:', e); }
}

function initTeamPage() {
  const isWomenPage = window.location.pathname.includes('women');
  initTabButtons();
  if (isWomenPage) {
    loadWomenFixtures(); loadWomenResults(); loadWomenTable(); loadWomenPlayers();
  } else {
    loadMenFixtures(); loadMenResults(); loadMenTable(); loadMenPlayers();
  }
}

document.addEventListener('DOMContentLoaded', initTeamPage);
window.addEventListener('languageChanged', initTeamPage);

// ============================================
// PLAYER PROFILE JS
// ============================================



// Function to fetch and map players from Google Sheet
async function fetchPlayersFromSheet(isMen = true) {
  if (!isMen) {
    // Google Sheets currently only provides profile-men tab
    return [];
  }
  const SPREADSHEET_ID = '11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs';
  const sheetParam = 'gid=1721120655&sheet=profile-men';
  try {
    const data = await fetchGoogleSheetDirect(SPREADSHEET_ID, sheetParam);
    if (!data.success || !Array.isArray(data.data)) throw new Error(data.error || 'Failed to fetch sheet');

    // Try to load local JSON as fallback/merge for extra details if needed
    let localData = [];
    try {
      const localRes = await fetch(isMen ? 'data/players-men.json' : 'data/players-women.json');
      localData = await localRes.json();
    } catch(e) {
      console.warn('Could not load local JSON');
    }

    
    const sheetPlayers = data.data.map((row, index) => {
      const sheetName = row.name || row['ชื่อ'] || '--';
      if (sheetName === '--') return null;

      const localMatch = localData.find(p => p.name.toLowerCase() === sheetName.toLowerCase()) || {};

      // Calculate or format age/dob
      let age = row.age || localMatch.age || null;
      let dobIso = row.date_of_birth || localMatch.date_of_birth || null;
      if (!dobIso && row['วันเกิด']) {
        const parts = row['วันเกิด'].split('/');
        if (parts.length === 3) {
          dobIso = `${parts[2]}-${parts[1]}-${parts[0]}`;
          const dob = new Date(parts[2], parts[1] - 1, parts[0]);
          const diffMs = Date.now() - dob.getTime();
          age = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
        }
      }

      // Format image path
      let rawImg = row.image || row['link png'] || localMatch.image || 'placeholder-player.svg';
      rawImg = String(rawImg).trim().split(' ')[0]; // Handle "reece-james.png (หรือ James.jpg)"
      let imagePath = rawImg;
      if (!imagePath.startsWith('assets/') && !imagePath.startsWith('http')) {
        imagePath = (isMen ? 'assets/images/players/men/' : 'assets/images/players/women/') + imagePath;
      }

      // Format Market Value
      let mv = row.market_value || localMatch.market_value || null;
      if (mv && typeof mv === 'string') {
        mv = Number(mv.replace(/[^0-9.]/g, '')) || mv;
      }

      const idVal = row.id ? String(row.id) : (localMatch.id ? String(localMatch.id) : `sheet_${index}`);

      return {
        id: idVal,
        name: sheetName,
        number: row.number || (row['เบอร์เสื้อ'] && row['เบอร์เสื้อ'] !== '-' ? row['เบอร์เสื้อ'] : localMatch.number),
        position: row.position || localMatch.position || 'Unknown',
        nationality: row.nationality || row['สัญชาติ'] || localMatch.nationality || '--',
        image: imagePath,
        height: row.height || localMatch.height || null,
        foot: row.foot || localMatch.foot || null,
        date_of_birth: dobIso,
        age: age,
        current_club: row.current_club || localMatch.current_club || 'Chelsea FC',
        joined: row.joined || localMatch.joined || null,
        signed_from: row.signed_from || localMatch.signed_from || null,
        market_value: mv,
        appearances: row.appearances !== undefined ? Number(row.appearances) : (localMatch.appearances || 0),
        goals: row.goals !== undefined ? Number(row.goals) : (localMatch.goals || 0),
        assists: row.assists !== undefined ? Number(row.assists) : (localMatch.assists || 0),
        clean_sheets: row.clean_sheets !== undefined ? Number(row.clean_sheets) : (localMatch.clean_sheets || 0),
        biography_th: row.biography_th || localMatch.biography_th || (typeof row.biography === 'object' ? row.biography?.th : '') || (typeof localMatch.biography === 'object' ? localMatch.biography?.th : '') || (typeof row.biography === 'string' ? row.biography : '') || (typeof localMatch.biography === 'string' ? localMatch.biography : ''),
        biography_en: row.biography_en || localMatch.biography_en || (typeof row.biography === 'object' ? row.biography?.en : '') || (typeof localMatch.biography === 'object' ? localMatch.biography?.en : ''),
        bio: (row.biography_th || row.biography_en || localMatch.biography_th || localMatch.biography_en)
          ? { th: row.biography_th || localMatch.biography_th || '', en: row.biography_en || localMatch.biography_en || '' } 
          : (row.biography || row.bio || localMatch.biography || localMatch.bio || ''),
        biography: (row.biography_th || row.biography_en || localMatch.biography_th || localMatch.biography_en)
          ? { th: row.biography_th || localMatch.biography_th || '', en: row.biography_en || localMatch.biography_en || '' } 
          : (row.biography || row.bio || localMatch.biography || localMatch.bio || ''),
        stats: row.stats || localMatch.stats || null,
        instagram: row.instagram || localMatch.instagram || '',
        twitter: row.twitter || localMatch.twitter || ''
      };
    }).filter(Boolean);
    
    // Add local players that are NOT in the sheet
    const sheetNames = sheetPlayers.map(p => p.name.toLowerCase());
    const missingPlayers = localData.filter(p => !sheetNames.includes(p.name.toLowerCase()));
    
    return [...sheetPlayers, ...missingPlayers];

  } catch (err) {
    console.error('Error fetching players from sheet:', err);
    return null;
  }
}

function formatPlayerPosition(pos, isTh) {
  if (!pos) return '--';
  if (!isTh) return pos;
  const p = pos.toLowerCase();
  if (p.includes('goalkeeper') || p.includes('gk')) return 'ผู้รักษาประตู';
  if (p.includes('defender') || p.includes('cb') || p.includes('lb') || p.includes('rb') || p.includes('wb')) return 'กองหลัง';
  if (p.includes('midfielder') || p.includes('cm') || p.includes('dm') || p.includes('am')) return 'กองกลาง';
  if (p.includes('forward') || p.includes('striker') || p.includes('winger') || p.includes('st') || p.includes('rw') || p.includes('lw') || p.includes('cf')) return 'กองหน้า';
  return pos;
}

async function initPlayerProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get('id');
  const requestedTeam = urlParams.get('team');
  let teamType = requestedTeam || 'men';
  let isMen = teamType === 'men';
  
  if (!playerId) {
    if (document.getElementById('playerName')) {
      document.getElementById('playerName').textContent = 'Player Not Found';
    }
    return;
  }
  
  try {
    const normalizeName = (str) => {
      if (!str) return '';
      return str.toLowerCase()
        .replace(/-/g, ' ')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/g, '')
        .trim();
    };

    let playersMen = [];
    let playersWomen = [];

    if (isMen) {
      playersMen = await safeFetchJson('data/players-men.json') || [];
      if (!playersMen.length) {
        try {
          playersMen = await fetchPlayersFromSheet(true) || [];
        } catch (e) {
          console.warn('Failed to fetch men players from API', e);
        }
      }
    } else {
      playersWomen = await safeFetchJson('data/players-women.json') || [];
    }
    
    let primaryList = isMen ? playersMen : playersWomen;
    let secondaryList = isMen ? playersWomen : playersMen;
    
    const targetId = decodeURIComponent(playerId).trim();
    const targetNorm = normalizeName(targetId);
    
    const findInList = (list) => {
      if (!Array.isArray(list)) return null;
      return list.find(p => {
        if (!p) return false;
        if (String(p.id) === String(targetId)) return true;
        if (p.name) {
          const pNorm = normalizeName(p.name);
          if (pNorm === targetNorm) return true;
          if (pNorm && targetNorm && (pNorm.includes(targetNorm) || targetNorm.includes(pNorm))) return true;
        }
        return false;
      });
    };
    
    let player = findInList(primaryList);
    if (!player && !requestedTeam) {
      player = findInList(secondaryList);
      if (player) {
        isMen = !isMen;
      }
    }
    
    if (!player) {
      if (document.getElementById('playerName')) {
        document.getElementById('playerName').textContent = 'Player Not Found';
      }
      return;
    }
    
    // Render Player Info
    const isTh = (window.currentLang || 'th') === 'th';
    document.getElementById('playerName').textContent = player.name;
    document.getElementById('playerNumber').textContent = '#' + (player.number || '?');
    const pImg = player.image || 'assets/images/placeholder-player.svg';
    const playerImgEl = document.getElementById('playerImage');
    if (playerImgEl) {
      playerImgEl.src = pImg;
      playerImgEl.alt = player.name;
      playerImgEl.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/placeholder-player.svg';
      };
    }
    document.getElementById('playerTeamBadge').textContent = isMen ? (isTh ? 'ทีมชาย' : "MEN'S TEAM") : (isTh ? 'ทีมหญิง' : "WOMEN'S TEAM");

    // Update active nav link & back link & document title based on team (men / women)
    const menNavLink = document.querySelector('.nav-links a[href="men-team.html"]');
    const womenNavLink = document.querySelector('.nav-links a[href="women-team.html"]');
    const backLink = document.getElementById('playerBackLink');

    if (isMen) {
      if (menNavLink) menNavLink.classList.add('active');
      if (womenNavLink) womenNavLink.classList.remove('active');
      if (backLink) {
        backLink.href = 'men-team.html';
        backLink.innerHTML = isTh ? '← กลับหน้าทีมชาย' : '← Back to Men\'s Team';
      }
    } else {
      if (womenNavLink) womenNavLink.classList.add('active');
      if (menNavLink) menNavLink.classList.remove('active');
      if (backLink) {
        backLink.href = 'women-team.html';
        backLink.innerHTML = isTh ? '← กลับหน้าทีมหญิง' : '← Back to Women\'s Team';
      }
    }

    const teamTitleText = isMen ? (isTh ? 'ทีมชาย' : "Men's Team") : (isTh ? 'ทีมหญิง' : "Women's Team");
    document.title = `${player.name} - ${teamTitleText} - KARNLAKHRANGNAN Official`;
    
    let pos = formatPlayerPosition(player.position, isTh);
    document.getElementById('playerPosition').textContent = pos;
    const natEl = document.getElementById('playerNationality');
    if (natEl) {
      const nat = player.nationality || '';
      const flagHtml = window.getFlagSpriteHTML ? window.getFlagSpriteHTML(nat) : '';
      const natName = window.getCountryName ? window.getCountryName(nat, isTh ? 'th' : 'en') : nat;
      natEl.innerHTML = `${flagHtml} <span>${natName || '--'}</span>`;
    }
    
    // Personal Details
    document.getElementById('playerDob').textContent = player.date_of_birth ? formatDate(player.date_of_birth, isTh ? 'th' : 'en') : '--';
    document.getElementById('playerAge').textContent = player.age ? `(${player.age} ${isTh?'ปี':'yo'})` : '';
    document.getElementById('playerHeight').textContent = player.height ? `${player.height} cm` : '--';
    document.getElementById('playerFoot').textContent = player.foot || '--';
    document.getElementById('playerJoined').textContent = player.joined ? formatDate(player.joined, isTh ? 'th' : 'en') : '--';
    document.getElementById('playerSignedFrom').textContent = player.signed_from || '--';
    
    let mvText = '--';
    if (player.market_value) {
      if (player.market_value >= 1000000) {
        mvText = '€' + (player.market_value / 1000000).toFixed(1) + 'M';
      } else {
        mvText = '€' + player.market_value.toLocaleString();
      }
    }
    document.getElementById('playerMarketValue').textContent = mvText;
    
    // Stats
    
    // Stats
    let totalApps = 0, totalGoals = 0, totalAssists = 0, totalCleanSheets = 0, totalYellows = 0, totalReds = 0;
    const isGK = player.position === 'GK' || player.position === 'Goalkeeper';
    
    // Check if clean sheets box exists
    const cleanSheetsBox = document.getElementById('statCleanSheetsBox');
    if (cleanSheetsBox) {
        cleanSheetsBox.style.display = isGK ? 'block' : 'none';
    }

    const tbody = document.querySelector('#competitionStatsTable tbody');
    const thead = document.querySelector('#competitionStatsTable thead');
    
    if (tbody && thead) {
        // Setup table headers based on position
        if (isGK) {
            thead.innerHTML = '<tr><th style="text-align: left;">Competition</th><th>Apps</th><th>Goals</th><th>Assists</th><th>Clean Sheets</th><th><span style="color:#ecc94b;">YC</span></th><th><span style="color:#f56565;">RC</span></th></tr>';
        } else {
            thead.innerHTML = '<tr><th style="text-align: left;">Competition</th><th>Apps</th><th>Goals</th><th>Assists</th><th><span style="color:#ecc94b;">YC</span></th><th><span style="color:#f56565;">RC</span></th></tr>';
        }
        
        tbody.innerHTML = '';
        
        if (!player.stats) {
            if (isMen) {
                player.stats = {
                    "Premier League": { appearances: player.appearances || 0, goals: player.goals || 0, assists: player.assists || 0, clean_sheets: player.clean_sheets || 0, yellow_cards: 0, red_cards: 0 },
                    "Carabao Cup": { appearances: 0, goals: 0, assists: 0, clean_sheets: 0, yellow_cards: 0, red_cards: 0 },
                    "FA Cup": { appearances: 0, goals: 0, assists: 0, clean_sheets: 0, yellow_cards: 0, red_cards: 0 }
                };
            } else {
                player.stats = {
                    "Barclays Women's Super League": { appearances: player.appearances || 0, goals: player.goals || 0, assists: player.assists || 0, clean_sheets: player.clean_sheets || 0, yellow_cards: 0, red_cards: 0 },
                    "UEFA Women's Champions League": { appearances: 0, goals: 0, assists: 0, clean_sheets: 0, yellow_cards: 0, red_cards: 0 },
                    "Women's League Cup": { appearances: 0, goals: 0, assists: 0, clean_sheets: 0, yellow_cards: 0, red_cards: 0 },
                    "Women's FA Cup": { appearances: 0, goals: 0, assists: 0, clean_sheets: 0, yellow_cards: 0, red_cards: 0 }
                };
            }
        }
        
        if (player.stats) {
            for (const [compName, compStats] of Object.entries(player.stats)) {
                totalApps += compStats.appearances || 0;
                totalGoals += compStats.goals || 0;
                totalAssists += compStats.assists || 0;
                totalYellows += compStats.yellow_cards || 0;
                totalReds += compStats.red_cards || 0;
                if (isGK) totalCleanSheets += compStats.clean_sheets || 0;
                
                const tr = document.createElement('tr');
                if (isGK) {
                    tr.innerHTML = `<td style="text-align: left;">${compName}</td><td>${compStats.appearances || 0}</td><td>${compStats.goals || 0}</td><td>${compStats.assists || 0}</td><td>${compStats.clean_sheets || 0}</td><td>${compStats.yellow_cards || 0}</td><td>${compStats.red_cards || 0}</td>`;
                } else {
                    tr.innerHTML = `<td style="text-align: left;">${compName}</td><td>${compStats.appearances || 0}</td><td>${compStats.goals || 0}</td><td>${compStats.assists || 0}</td><td>${compStats.yellow_cards || 0}</td><td>${compStats.red_cards || 0}</td>`;
                }
                tbody.appendChild(tr);
            }
        }
    } else {
        totalApps = player.appearances || 0;
        totalGoals = player.goals || 0;
        totalAssists = player.assists || 0;
    }

    document.getElementById('statApps').textContent = totalApps;
    document.getElementById('statGoals').textContent = totalGoals;
    document.getElementById('statAssists').textContent = totalAssists;
    
    if (document.getElementById('statCleanSheets')) document.getElementById('statCleanSheets').textContent = totalCleanSheets;
    if (document.getElementById('statYellowCards')) document.getElementById('statYellowCards').textContent = totalYellows;
    if (document.getElementById('statRedCards')) document.getElementById('statRedCards').textContent = totalReds;

    
    // Bio
    let bioText = '';
    if (player.biography_th || player.biography_en) {
      bioText = isTh ? (player.biography_th || player.biography_en || '') : (player.biography_en || player.biography_th || '');
    } else {
      const rawBio = player.biography || player.bio;
      if (rawBio) {
        if (typeof rawBio === 'object' && rawBio !== null) {
          bioText = isTh ? (rawBio.th || rawBio.en || '') : (rawBio.en || rawBio.th || '');
        } else if (typeof rawBio === 'string') {
          bioText = rawBio;
        }
      }
    }

    if (bioText) {
      // Clean escape characters (\", \', \n\, \n, \t, etc.)
      const normalizedBio = bioText
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\n\\/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\t/g, ' ')
        .replace(/\\/g, '');

      const paragraphs = normalizedBio.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      if (paragraphs.length > 0) {
        document.getElementById('playerBio').innerHTML = paragraphs
          .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
          .join('');
      } else {
        document.getElementById('playerBio').innerHTML = `<p>${normalizedBio.replace(/\n/g, '<br>')}</p>`;
      }
    } else {
      document.getElementById('playerBio').innerHTML = `<p>${isTh ? 'ไม่มีข้อมูลชีวประวัติ' : 'No biography available.'}</p>`;
    }
    
    // Social
    if (player.instagram || player.twitter) {
      document.getElementById('socialSection').style.display = 'block';
      if (player.instagram) {
        const igLink = document.getElementById('socialInstagram');
        igLink.href = player.instagram.startsWith('http') ? player.instagram : `https://instagram.com/${player.instagram}`;
        igLink.style.display = 'inline-block';
      }
      if (player.twitter) {
        const twLink = document.getElementById('socialTwitter');
        twLink.href = player.twitter.startsWith('http') ? player.twitter : `https://twitter.com/${player.twitter}`;
        twLink.style.display = 'inline-block';
      }
    }
    
  } catch (e) {
    console.error(e);
    document.getElementById('playerName').textContent = 'Error Loading Player';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('player-profile')) {
    initPlayerProfile();
  }
});

window.addEventListener('languageChanged', () => {
  if (window.location.pathname.includes('player-profile')) {
    initPlayerProfile();
  }
});
