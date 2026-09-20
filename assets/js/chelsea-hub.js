/**
 * ============================================================================
 * CHELSEA FC HUB - JavaScript Core Engine
 * 1. Live Match Results Automatic Table (football-data.org API)
 * 2. Manager Timeline & Performance Statistics Filter & Summary Report
 * 3. Chelsea Performance Dashboard (Standings, Next Fixtures, Current Squad)
 * 4. Head-to-Head (H2H) Rival Analytics Component
 * ============================================================================
 */

(function () {
  'use strict';

  // API Configuration
  const FOOTBALL_DATA_TOKEN = 'fb73ad1df2194fdab3fe56614d1a953e';
  const CHELSEA_TEAM_ID = 61;
  const PREMIER_LEAGUE_CODE = 'PL';

  // Shared Data Cache
  const HubState = {
    matches: [],
    localFixtures: [],
    standings: [],
    squad: [],
    coach: null,
    activeTab: 'dashboard',
    matchesFilter: {
      status: 'all',
      competition: 'all',
      search: ''
    },
    managerFilter: {
      startDate: '2024-07-01',
      endDate: new Date().toISOString().split('T')[0],
      managerName: 'Enzo Maresca'
    },
    h2hSelectedOpponent: 57, // Default Arsenal FC
    countdownInterval: null,
    livePollingInterval: null,
    liveSyncCountdown: 12, // 10-15 seconds delay (12s default)
    lastLiveScoreKey: null,
    isLivePollingActive: false
  };

  // Safe API Fetch with Direct Token & Proxy Fallback
  async function fetchFootballData(endpoint, isLive = false) {
    const cacheBuster = isLive ? (endpoint.includes('?') ? `&_t=${Date.now()}&live=true` : `?_t=${Date.now()}&live=true`) : '';
    const fullEndpoint = `${endpoint}${cacheBuster}`;

    // Try proxy first to bypass browser CORS if on web server
    try {
      const proxyUrl = `/api/football-data/${fullEndpoint}`;
      const res = await fetch(proxyUrl, {
        headers: isLive ? { 'Cache-Control': 'no-cache' } : {}
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fall through to direct fetch
    }

    // Direct fetch with X-Auth-Token
    const directUrl = fullEndpoint.startsWith('http') ? fullEndpoint : `https://api.football-data.org/v4/${fullEndpoint}`;
    const directRes = await fetch(directUrl, {
      headers: {
        'X-Auth-Token': FOOTBALL_DATA_TOKEN
      }
    });

    if (!directRes.ok) {
      throw new Error(`API Error: ${directRes.status} ${directRes.statusText}`);
    }
    return await directRes.json();
  }

  // Format Date Helper
  function formatMatchDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const isTh = (window.currentLang || 'th') === 'th';
    if (isTh) {
      const monthsTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${d.getDate()} ${monthsTh[d.getMonth()]} ${d.getFullYear() + 543} • ${timeStr} น.`;
    }

    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Helper to determine Chelsea outcome (W, D, L)
  function getChelseaOutcome(match) {
    if (match.status !== 'FINISHED' || !match.score || match.score.fullTime?.home == null) {
      return null;
    }
    const isHome = match.homeTeam.id === CHELSEA_TEAM_ID;
    const chelseaScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
    const oppScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;

    if (chelseaScore > oppScore) return 'W';
    if (chelseaScore === oppScore) return 'D';
    return 'L';
  }

  // Helper to find corresponding fixture ID in local fixtures.json
  function findMatchingFixtureId(m) {
    if (!m) return 'm9';
    if (m.id && typeof m.id === 'string' && (m.id.startsWith('m') || m.id.startsWith('w'))) {
      return m.id;
    }
    if (HubState.localFixtures && HubState.localFixtures.length > 0) {
      const matchDateStr = m.utcDate ? m.utcDate.split('T')[0] : (m.date || '');
      const homeName = (m.homeTeam?.name || m.homeTeam?.shortName || m.home_team || '').toLowerCase();
      const awayName = (m.awayTeam?.name || m.awayTeam?.shortName || m.away_team || '').toLowerCase();

      // 1. Exact date match with home or away opponent
      const foundByDate = HubState.localFixtures.find(fix => {
        if (fix.date !== matchDateStr) return false;
        const fHome = (fix.home_team || '').toLowerCase();
        const fAway = (fix.away_team || '').toLowerCase();
        return (fHome.includes(homeName.substring(0, 4)) || homeName.includes(fHome.substring(0, 4))) ||
               (fAway.includes(awayName.substring(0, 4)) || awayName.includes(fAway.substring(0, 4)));
      });
      if (foundByDate) return foundByDate.id;

      // 2. Opponent match (home or away)
      const foundByOpponent = HubState.localFixtures.find(fix => {
        const fHome = (fix.home_team || '').toLowerCase();
        const fAway = (fix.away_team || '').toLowerCase();
        const isChelseaMatch = fHome.includes('chelsea') || fAway.includes('chelsea');
        if (!isChelseaMatch) return false;
        return (fHome.includes(homeName.substring(0, 4)) || homeName.includes(fHome.substring(0, 4))) &&
               (fAway.includes(awayName.substring(0, 4)) || awayName.includes(fAway.substring(0, 4)));
      });
      if (foundByOpponent) return foundByOpponent.id;

      // 3. Fallback to latest completed match
      const completedList = HubState.localFixtures.filter(fix => fix.status === 'completed');
      if (completedList.length > 0) {
        return completedList[0].id;
      }
    }
    return m.id || 'm9';
  }

  // ==========================================================================
  // 1. LIVE MATCH RESULTS AUTOMATIC HTML TABLE
  // ==========================================================================
  async function loadChelseaMatches() {
    const tableBody = document.getElementById('chelseaMatchesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="hub-state-box">
          <div class="hub-spinner"></div>
          <p>กำลังดึงผลการแข่งขันจาก football-data.org...</p>
        </td>
      </tr>
    `;

    try {
      // Pre-load local fixtures for rich match detail links
      try {
        const fRes = await fetch('data/fixtures.json');
        if (fRes.ok) {
          HubState.localFixtures = await fRes.json();
        }
      } catch (e) {
        console.warn('Could not load local fixtures.json:', e);
      }

      const data = await fetchFootballData(`teams/${CHELSEA_TEAM_ID}/matches`);
      HubState.matches = data.matches || [];
      renderMatchesTable();
      populateCompetitionFilter();
      updateDashboardFixtures();
      renderManagerTimeline();
      renderH2HAnalysis();
    } catch (err) {
      console.error('Failed to load matches:', err);
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="hub-state-box" style="color: #f87171;">
            <p>⚠️ ไม่สามารถโหลดข้อมูลแมตช์ได้: ${err.message}</p>
            <button id="btnRetryMatches" class="hub-btn" style="margin-top: 0.5rem;">ลองใหม่อีกครั้ง</button>
          </td>
        </tr>
      `;
      const retryBtn = document.getElementById('btnRetryMatches');
      if (retryBtn) retryBtn.addEventListener('click', loadChelseaMatches);
    }
  }

  function populateCompetitionFilter() {
    const select = document.getElementById('matchesCompFilter');
    if (!select || !HubState.matches.length) return;

    const comps = new Map();
    HubState.matches.forEach(m => {
      if (m.competition?.code) {
        comps.set(m.competition.code, m.competition.name);
      }
    });

    const isTh = (window.currentLang || 'th') === 'th';
    let options = `<option value="all">${isTh ? '🏆 ทุกรายการแข่งขัน' : '🏆 All Competitions'}</option>`;
    comps.forEach((name, code) => {
      options += `<option value="${code}">${name}</option>`;
    });
    select.innerHTML = options;
  }

  function renderMatchesTable() {
    const tableBody = document.getElementById('chelseaMatchesTableBody');
    const countBadge = document.getElementById('matchesTableCount');
    if (!tableBody) return;

    const { status, competition, search } = HubState.matchesFilter;

    let filtered = HubState.matches.filter(match => {
      // Status Filter
      if (status === 'FINISHED' && match.status !== 'FINISHED') return false;
      if (status === 'SCHEDULED' && match.status === 'FINISHED') return false;
      if (status === 'LIVE' && match.status !== 'IN_PLAY' && match.status !== 'PAUSED') return false;

      // Competition Filter
      if (competition !== 'all' && match.competition?.code !== competition) return false;

      // Search Filter
      if (search) {
        const q = search.toLowerCase();
        const home = (match.homeTeam?.name || '').toLowerCase();
        const away = (match.awayTeam?.name || '').toLowerCase();
        const comp = (match.competition?.name || '').toLowerCase();
        if (!home.includes(q) && !away.includes(q) && !comp.includes(q)) return false;
      }
      return true;
    });

    if (countBadge) countBadge.textContent = `${filtered.length} แมตช์`;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="hub-state-box">
            <p>ไม่พบรายการแข่งขันตามเงื่อนไขที่เลือก</p>
          </td>
        </tr>
      `;
      return;
    }

    const rowsHtml = filtered.map(m => {
      const isChelseaHome = m.homeTeam.id === CHELSEA_TEAM_ID;
      const isChelseaAway = m.awayTeam.id === CHELSEA_TEAM_ID;
      const outcome = getChelseaOutcome(m);
      const isFinished = m.status === 'FINISHED';

      let scoreBadgeHtml = '';
      if (isFinished) {
        const homeScore = m.score?.fullTime?.home ?? '-';
        const awayScore = m.score?.fullTime?.away ?? '-';
        const badgeClass = outcome === 'W' ? 'win' : outcome === 'D' ? 'draw' : outcome === 'L' ? 'loss' : '';
        scoreBadgeHtml = `
          <span class="hub-score-badge ${badgeClass}" title="Outcome: ${outcome || 'N/A'}">
            ${homeScore} - ${awayScore}
          </span>
        `;
      } else {
        const timeStr = new Date(m.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        scoreBadgeHtml = `<span class="hub-score-badge" style="color: #93c5fd; font-size: 0.82rem;">${timeStr}</span>`;
      }

      let statusClass = 'hub-status-scheduled';
      let statusLabel = m.status;
      let rowAttrs = '';

      if (isFinished) {
        const targetFixtureId = findMatchingFixtureId(m);
        const detailHref = `match-detail.html?id=${targetFixtureId}`;
        const matchTitle = `${m.homeTeam.shortName || m.homeTeam.name} vs ${m.awayTeam.shortName || m.awayTeam.name}`;

        statusClass = 'hub-status-finished is-clickable';
        statusLabel = `จบการแข่งขัน <span class="hub-status-view-cta">↗</span>`;
        rowAttrs = `
          class="hub-match-row-clickable ${outcome === 'W' ? 'row-highlight' : ''}" 
          data-href="${detailHref}" 
          tabindex="0" 
          role="link" 
          title="คลิกเพื่อดูรายละเอียดแมตช์เต็ม (${matchTitle})" 
          aria-label="ดูรายละเอียดแมตช์ ${matchTitle}"
        `;
      } else if (m.status === 'IN_PLAY' || m.status === 'PAUSED') {
        statusClass = 'hub-status-live';
        statusLabel = 'กำลังแข่งขัน';
        rowAttrs = `class="${outcome === 'W' ? 'row-highlight' : ''}"`;
      } else {
        statusLabel = 'ยังไม่เริ่ม';
        rowAttrs = `class="${outcome === 'W' ? 'row-highlight' : ''}"`;
      }

      const compEmblem = m.competition?.emblem ? `<img src="${m.competition.emblem}" class="hub-comp-emblem" alt="" />` : '';

      return `
        <tr ${rowAttrs}>
          <td style="white-space: nowrap; font-size: 0.85rem; color: #93c5fd;">
            ${formatMatchDate(m.utcDate)}
            ${m.matchday ? `<div style="font-size: 0.75rem; color: rgba(255,255,255,0.45);">Matchday ${m.matchday}</div>` : ''}
          </td>
          <td>
            <div class="hub-comp-badge">
              ${compEmblem}
              <span>${m.competition?.name || 'Tournament'}</span>
            </div>
          </td>
          <td>
            <div class="hub-team-cell">
              <img src="${m.homeTeam.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" loading="lazy" />
              <span class="${isChelseaHome ? 'hub-team-chelsea' : ''}">${m.homeTeam.shortName || m.homeTeam.name}</span>
            </div>
          </td>
          <td style="text-align: center;">
            ${scoreBadgeHtml}
          </td>
          <td>
            <div class="hub-team-cell">
              <img src="${m.awayTeam.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" loading="lazy" />
              <span class="${isChelseaAway ? 'hub-team-chelsea' : ''}">${m.awayTeam.shortName || m.awayTeam.name}</span>
            </div>
          </td>
          <td>
            <span class="hub-status-pill ${statusClass}">${statusLabel}</span>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rowsHtml;

    // Attach click and keyboard listeners for clickable match rows
    tableBody.onclick = (e) => {
      const row = e.target.closest('tr.hub-match-row-clickable');
      if (row && row.dataset.href) {
        window.location.href = row.dataset.href;
      }
    };

    tableBody.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const row = e.target.closest('tr.hub-match-row-clickable');
        if (row && row.dataset.href) {
          e.preventDefault();
          window.location.href = row.dataset.href;
        }
      }
    };
  }

  // ==========================================================================
  // 2. MANAGER TIMELINE & PERFORMANCE FILTER & SUMMARY REPORT
  // ==========================================================================
  const MANAGER_PRESETS = [
    { name: 'Enzo Maresca', start: '2024-07-01', end: new Date().toISOString().split('T')[0], label: 'Enzo Maresca (2024 - ปัจจุบัน)' },
    { name: 'Mauricio Pochettino', start: '2023-07-01', end: '2024-05-31', label: 'M. Pochettino (2023 - 2024)' },
    { name: 'Frank Lampard (Interim)', start: '2023-04-06', end: '2023-05-28', label: 'Frank Lampard (2023)' },
    { name: 'Graham Potter', start: '2022-09-08', end: '2023-04-02', label: 'Graham Potter (2022 - 2023)' },
    { name: 'Thomas Tuchel', start: '2021-01-26', end: '2022-09-07', label: 'Thomas Tuchel (2021 - 2022)' },
    { name: 'All Matches', start: '2020-01-01', end: '2030-12-31', label: 'แมตช์ทั้งหมด' }
  ];

  function calculateManagerStats(matches, startDate, endDate) {
    const start = startDate ? new Date(startDate) : new Date('2000-01-01');
    const end = endDate ? new Date(endDate + 'T23:59:59Z') : new Date('2099-12-31');

    const filtered = matches.filter(m => {
      const d = new Date(m.utcDate);
      return d >= start && d <= end;
    });

    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let gf = 0;
    let ga = 0;
    let cleanSheets = 0;

    filtered.forEach(m => {
      if (m.status !== 'FINISHED' || !m.score?.fullTime) return;
      played++;
      const isHome = m.homeTeam.id === CHELSEA_TEAM_ID;
      const cGoals = isHome ? m.score.fullTime.home : m.score.fullTime.away;
      const oGoals = isHome ? m.score.fullTime.away : m.score.fullTime.home;

      if (cGoals != null && oGoals != null) {
        gf += cGoals;
        ga += oGoals;
        if (oGoals === 0) cleanSheets++;
        if (cGoals > oGoals) won++;
        else if (cGoals === oGoals) drawn++;
        else lost++;
      }
    });

    const winRate = played > 0 ? ((won / played) * 100).toFixed(1) : 0;
    const points = (won * 3) + (drawn * 1);
    const ppm = played > 0 ? (points / played).toFixed(2) : '0.00';
    const gd = gf - ga;

    return {
      total: filtered.length,
      played,
      won,
      drawn,
      lost,
      gf,
      ga,
      gd,
      winRate,
      points,
      ppm,
      cleanSheets,
      matches: filtered
    };
  }

  function renderManagerTimeline() {
    const container = document.getElementById('managerSummaryReportContainer');
    const matchesTable = document.getElementById('managerFilteredMatchesBody');
    if (!container) return;

    const { startDate, endDate, managerName } = HubState.managerFilter;
    const stats = calculateManagerStats(HubState.matches, startDate, endDate);

    // Render KPI Cards
    container.innerHTML = `
      <div class="hub-kpi-grid">
        <div class="hub-kpi-card">
          <div class="hub-kpi-label">คุมทีมทั้งหมด</div>
          <div class="hub-kpi-value">${stats.played}</div>
          <div class="hub-kpi-sub">นัด (จาก ${stats.total})</div>
        </div>
        <div class="hub-kpi-card kpi-win">
          <div class="hub-kpi-label">ชนะ (W)</div>
          <div class="hub-kpi-value" style="color: #34d399;">${stats.won}</div>
          <div class="hub-kpi-sub">อัตราชนะ ${stats.winRate}%</div>
        </div>
        <div class="hub-kpi-card kpi-draw">
          <div class="hub-kpi-label">เสมอ (D)</div>
          <div class="hub-kpi-value" style="color: #fbbf24;">${stats.drawn}</div>
          <div class="hub-kpi-sub">แต้มรวม ${stats.points}</div>
        </div>
        <div class="hub-kpi-card kpi-loss">
          <div class="hub-kpi-label">แพ้ (L)</div>
          <div class="hub-kpi-value" style="color: #f87171;">${stats.lost}</div>
          <div class="hub-kpi-sub">PPM ${stats.ppm}</div>
        </div>
        <div class="hub-kpi-card">
          <div class="hub-kpi-label">ประตูได้ / เสีย</div>
          <div class="hub-kpi-value" style="font-size: 1.4rem;">${stats.gf} : ${stats.ga}</div>
          <div class="hub-kpi-sub">ผลต่าง ${stats.gd > 0 ? '+' + stats.gd : stats.gd}</div>
        </div>
        <div class="hub-kpi-card">
          <div class="hub-kpi-label">คลีนชีต</div>
          <div class="hub-kpi-value" style="color: #38bdf8;">${stats.cleanSheets}</div>
          <div class="hub-kpi-sub">นัดที่ไม่เสียประตู</div>
        </div>
      </div>
    `;

    // Render Filtered Matches Table for this Manager
    if (matchesTable) {
      if (stats.matches.length === 0) {
        matchesTable.innerHTML = `
          <tr>
            <td colspan="5" class="hub-state-box">
              <p>ไม่มีข้อมูลแมตช์ในช่วงเวลา ${startDate} ถึง ${endDate}</p>
            </td>
          </tr>
        `;
        return;
      }

      matchesTable.innerHTML = stats.matches.map(m => {
        const isChelseaHome = m.homeTeam.id === CHELSEA_TEAM_ID;
        const isChelseaAway = m.awayTeam.id === CHELSEA_TEAM_ID;
        const outcome = getChelseaOutcome(m);
        const isFinished = m.status === 'FINISHED';

        let badgeClass = outcome === 'W' ? 'win' : outcome === 'D' ? 'draw' : outcome === 'L' ? 'loss' : '';
        const homeScore = m.score?.fullTime?.home ?? '-';
        const awayScore = m.score?.fullTime?.away ?? '-';
        const targetFixtureId = isFinished ? findMatchingFixtureId(m) : null;
        const detailHref = isFinished ? `match-detail.html?id=${targetFixtureId}` : '';
        const matchTitle = `${m.homeTeam.shortName || m.homeTeam.name} vs ${m.awayTeam.shortName || m.awayTeam.name}`;

        const rowAttrs = isFinished ? `
          class="hub-match-row-clickable ${outcome === 'W' ? 'row-highlight' : ''}" 
          data-href="${detailHref}" 
          tabindex="0" 
          role="link" 
          title="คลิกเพื่อดูรายละเอียดแมตช์ (${matchTitle})"
          aria-label="ดูรายละเอียดแมตช์ ${matchTitle}"
        ` : '';

        return `
          <tr ${rowAttrs}>
            <td style="font-size: 0.85rem; color: #93c5fd;">${formatMatchDate(m.utcDate)}</td>
            <td style="font-size: 0.82rem;">${m.competition?.name || 'Tournament'}</td>
            <td>
              <div class="hub-team-cell">
                <img src="${m.homeTeam.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" />
                <span class="${isChelseaHome ? 'hub-team-chelsea' : ''}">${m.homeTeam.shortName || m.homeTeam.name}</span>
              </div>
            </td>
            <td style="text-align: center;">
              <span class="hub-score-badge ${badgeClass}">${homeScore} - ${awayScore}</span>
            </td>
            <td>
              <div class="hub-team-cell">
                <img src="${m.awayTeam.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" />
                <span class="${isChelseaAway ? 'hub-team-chelsea' : ''}">${m.awayTeam.shortName || m.awayTeam.name}</span>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Attach click and keyboard listeners for manager matches table
      matchesTable.onclick = (e) => {
        const row = e.target.closest('tr.hub-match-row-clickable');
        if (row && row.dataset.href) {
          window.location.href = row.dataset.href;
        }
      };

      matchesTable.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const row = e.target.closest('tr.hub-match-row-clickable');
          if (row && row.dataset.href) {
            e.preventDefault();
            window.location.href = row.dataset.href;
          }
        }
      };
    }
  }

  // ==========================================================================
  // 3. DASHBOARD (STANDINGS, NEXT FIXTURES, CURRENT SQUAD)
  // ==========================================================================
  async function loadDashboardData() {
    loadStandings();
    loadSquad();
  }

  async function loadStandings() {
    const tableBody = document.getElementById('dashboardStandingsBody');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="hub-state-box">
          <div class="hub-spinner"></div>
          <p>กำลังดึงตารางคะแนนล่าสุด...</p>
        </td>
      </tr>
    `;

    try {
      const data = await fetchFootballData(`competitions/${PREMIER_LEAGUE_CODE}/standings`);
      const standingsTable = data.standings?.[0]?.table || [];
      HubState.standings = standingsTable;

      if (standingsTable.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" class="hub-state-box">ไม่มีข้อมูลตารางคะแนน</td></tr>`;
        return;
      }

      tableBody.innerHTML = standingsTable.map(row => {
        const isChelsea = row.team.id === CHELSEA_TEAM_ID;

        return `
          <tr class="${isChelsea ? 'row-highlight' : ''}">
            <td style="font-weight: 700; width: 40px; text-align: center;">${row.position}</td>
            <td>
              <div class="hub-team-cell">
                <img src="${row.team.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" loading="lazy" />
                <span class="${isChelsea ? 'hub-team-chelsea' : ''}">${row.team.shortName || row.team.name}</span>
              </div>
            </td>
            <td style="text-align: center;">${row.playedGames}</td>
            <td style="text-align: center; color: #34d399;">${row.won}</td>
            <td style="text-align: center; color: #fbbf24;">${row.draw}</td>
            <td style="text-align: center; color: #f87171;">${row.lost}</td>
            <td style="text-align: center;">${row.goalsFor}</td>
            <td style="text-align: center;">${row.goalsAgainst}</td>
            <td style="text-align: center; font-weight: 600;">${row.goalDifference > 0 ? '+' + row.goalDifference : row.goalDifference}</td>
            <td style="text-align: center; font-weight: 800; color: #38bdf8; font-size: 1rem;">${row.points}</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      console.error('Failed to load standings:', err);
      tableBody.innerHTML = `<tr><td colspan="10" class="hub-state-box" style="color: #f87171;">เกิดข้อผิดพลาดในการโหลดตารางคะแนน</td></tr>`;
    }
  }

  // ==========================================================================
  // REAL-TIME LIVE MATCH & SPOTLIGHT LOGIC (10-15s DELAY AUTO-POLLING)
  // ==========================================================================
  function isMatchLive(match) {
    if (!match) return false;
    const status = (match.status || '').toUpperCase();
    if (['IN_PLAY', 'PAUSED', 'LIVE', 'HALFTIME'].includes(status)) {
      return true;
    }
    if (status === 'FINISHED') return false;

    // Check if match kickoff time has arrived and within ~140 minutes window
    const matchTime = new Date(match.utcDate).getTime();
    const now = Date.now();
    const maxMatchDuration = 140 * 60 * 1000; // 140 mins
    return (now >= matchTime && now <= (matchTime + maxMatchDuration));
  }

  function updateDashboardFixtures() {
    const spotlightContainer = document.getElementById('nextFixtureSpotlight');
    const upcomingListContainer = document.getElementById('upcomingFixturesList');
    if (!HubState.matches.length) return;

    // 1. Check if there is an active LIVE match currently in progress
    const liveMatch = HubState.matches.find(m => isMatchLive(m));

    if (liveMatch) {
      renderLiveSpotlight(liveMatch);
      startLiveScorePolling(liveMatch);
    } else {
      // Stop live polling if running
      stopLiveScorePolling();

      // Find upcoming matches (TIMED or SCHEDULED)
      const upcoming = HubState.matches.filter(m => m.status !== 'FINISHED').sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

      if (upcoming.length === 0) {
        if (spotlightContainer) {
          spotlightContainer.innerHTML = `<div class="hub-state-box">ไม่มีโปรแกรมแข่งขันถัดไปในขณะนี้</div>`;
        }
        return;
      }

      const nextMatch = upcoming[0];

      // Check if kickoff time is now or passed
      if (isMatchLive(nextMatch)) {
        renderLiveSpotlight(nextMatch);
        startLiveScorePolling(nextMatch);
        return;
      }

      // Render Spotlight Pre-Match Card with countdown timer
      if (spotlightContainer) {
        const isHome = nextMatch.homeTeam.id === CHELSEA_TEAM_ID;
        const venue = isHome ? 'Stamford Bridge (Home)' : 'Away Match';

        spotlightContainer.innerHTML = `
          <div class="spotlight-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="hub-status-pill hub-status-scheduled">🔥 นัดถัดไป / NEXT MATCH</span>
              <span style="font-size: 0.8rem; color: #93c5fd;">${nextMatch.competition?.name || 'Premier League'}</span>
            </div>

            <div class="spotlight-match-teams">
              <div class="spotlight-team">
                <img src="${nextMatch.homeTeam.crest || 'assets/images/placeholder-team.svg'}" class="spotlight-crest" alt="" />
                <div class="spotlight-team-name ${nextMatch.homeTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">
                  ${nextMatch.homeTeam.shortName || nextMatch.homeTeam.name}
                </div>
              </div>

              <div class="spotlight-vs">VS</div>

              <div class="spotlight-team">
                <img src="${nextMatch.awayTeam.crest || 'assets/images/placeholder-team.svg'}" class="spotlight-crest" alt="" />
                <div class="spotlight-team-name ${nextMatch.awayTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">
                  ${nextMatch.awayTeam.shortName || nextMatch.awayTeam.name}
                </div>
              </div>
            </div>

            <div style="text-align: center; font-size: 0.88rem; color: #ffffff; font-weight: 600;">
              📅 ${formatMatchDate(nextMatch.utcDate)}
              <div style="font-size: 0.78rem; color: #93c5fd; margin-top: 0.2rem;">🏟️ ${venue}</div>
            </div>

            <div class="spotlight-countdown" id="spotlightCountdown">
              <div class="countdown-box"><div class="countdown-val" id="cdDays">00</div><div class="countdown-unit">Days</div></div>
              <div class="countdown-box"><div class="countdown-val" id="cdHours">00</div><div class="countdown-unit">Hours</div></div>
              <div class="countdown-box"><div class="countdown-val" id="cdMins">00</div><div class="countdown-unit">Mins</div></div>
              <div class="countdown-box"><div class="countdown-val" id="cdSecs">00</div><div class="countdown-unit">Secs</div></div>
            </div>
          </div>
        `;

        // Start Countdown Timer
        startCountdown(new Date(nextMatch.utcDate).getTime(), nextMatch);
      }
    }

    // Render list of other upcoming fixtures
    if (upcomingListContainer) {
      const restUpcoming = HubState.matches
        .filter(m => m.status !== 'FINISHED' && (!liveMatch || m.id !== liveMatch.id))
        .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
        .slice(0, 5);

      if (restUpcoming.length === 0) {
        upcomingListContainer.innerHTML = '';
        return;
      }

      upcomingListContainer.innerHTML = `
        <div style="margin-top: 1rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #93c5fd;">🗓️ โปรแกรมแข่งขันล่วงหน้า (5 นัดถัดไป)</h4>
          <div class="hub-table-wrapper">
            <table class="hub-table">
              <tbody>
                ${restUpcoming.map(m => {
                  return `
                    <tr>
                      <td style="font-size: 0.82rem; color: #93c5fd; width: 140px;">${formatMatchDate(m.utcDate)}</td>
                      <td>
                        <div class="hub-team-cell">
                          <img src="${m.homeTeam.crest || 'assets/images/placeholder-team.svg'}" style="width: 20px; height: 20px;" alt="" />
                          <span class="${m.homeTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">${m.homeTeam.shortName || m.homeTeam.name}</span>
                          <span style="color: #93c5fd; margin: 0 4px;">vs</span>
                          <img src="${m.awayTeam.crest || 'assets/images/placeholder-team.svg'}" style="width: 20px; height: 20px;" alt="" />
                          <span class="${m.awayTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">${m.awayTeam.shortName || m.awayTeam.name}</span>
                        </div>
                      </td>
                      <td style="font-size: 0.8rem; color: rgba(255,255,255,0.6); text-align: right;">${m.competition?.name || ''}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  }

  function renderLiveSpotlight(match, scoreChanged = false) {
    const spotlightContainer = document.getElementById('nextFixtureSpotlight');
    if (!spotlightContainer || !match) return;

    const isHome = match.homeTeam.id === CHELSEA_TEAM_ID;
    const venue = isHome ? 'Stamford Bridge (Home)' : 'Away Match';

    // Get real-time scores
    const homeScore = match.score?.fullTime?.home ?? (match.score?.current?.home ?? 0);
    const awayScore = match.score?.fullTime?.away ?? (match.score?.current?.away ?? 0);
    const htHome = match.score?.halfTime?.home;
    const htAway = match.score?.halfTime?.away;
    const htText = (htHome != null && htAway != null) ? `(ครึ่งแรก: ${htHome} - ${htAway})` : '';

    let liveStatusText = 'กำลังแข่งขัน (1st Half / 2nd Half)';
    if (match.status === 'PAUSED' || match.status === 'HALFTIME') {
      liveStatusText = '⏸️ พักครึ่งเวลา (Half Time)';
    } else if (match.status === 'IN_PLAY') {
      liveStatusText = match.minute ? `⏱️ นาทีที่ ${match.minute}'` : '⚽ กำลังแข่งขันสด (In Play)';
    }

    spotlightContainer.innerHTML = `
      <div class="spotlight-card spotlight-live-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="hub-status-pill hub-status-live">
            <span class="live-pulse-dot"></span>🔴 กำลังแข่งขันสด / LIVE NOW
          </span>
          <span style="font-size: 0.82rem; color: #38bdf8; font-weight: 700;">${match.competition?.name || 'Premier League'}</span>
        </div>

        <div class="spotlight-match-teams">
          <div class="spotlight-team">
            <img src="${match.homeTeam.crest || 'assets/images/placeholder-team.svg'}" class="spotlight-crest" alt="${match.homeTeam.name}" />
            <div class="spotlight-team-name ${match.homeTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">
              ${match.homeTeam.shortName || match.homeTeam.name}
            </div>
          </div>

          <div class="spotlight-live-scorebox">
            <div class="spotlight-live-score ${scoreChanged ? 'score-changed' : ''}" id="spotlightLiveScoreNum">
              <span>${homeScore}</span>
              <span style="color: #ef4444; font-size: 1.8rem; margin: 0 4px;">-</span>
              <span>${awayScore}</span>
            </div>
            ${htText ? `<div class="spotlight-live-ht">${htText}</div>` : ''}
            <div style="font-size: 0.76rem; color: #fca5a5; font-weight: 700; margin-top: 5px;">${liveStatusText}</div>
          </div>

          <div class="spotlight-team">
            <img src="${match.awayTeam.crest || 'assets/images/placeholder-team.svg'}" class="spotlight-crest" alt="${match.awayTeam.name}" />
            <div class="spotlight-team-name ${match.awayTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">
              ${match.awayTeam.shortName || match.awayTeam.name}
            </div>
          </div>
        </div>

        <div style="text-align: center; font-size: 0.85rem; color: #ffffff; font-weight: 600;">
          📅 ${formatMatchDate(match.utcDate)} • 🏟️ ${venue}
        </div>

        <div class="spotlight-live-status-bar">
          <div class="live-sync-progress">
            <span class="live-pulse-dot"></span>
            <span>ดีเลย์ 10-15s (Real-Time API)</span>
            <span>• อัปเดตใน <strong id="liveSyncCountdownSecs" style="color: #38bdf8;">${HubState.liveSyncCountdown}s</strong></span>
          </div>
          <button type="button" class="live-refresh-mini-btn" id="btnLiveManualRefresh" title="ดึงสกอร์ล่าสุดทันที">
            ⚡ รีเฟรชทันที
          </button>
        </div>
      </div>
    `;

    // Bind manual refresh button
    const btnRefresh = document.getElementById('btnLiveManualRefresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        btnRefresh.textContent = '⏳ กำลังดึง...';
        btnRefresh.disabled = true;
        await refreshLiveScoreData(match);
        btnRefresh.textContent = '⚡ รีเฟรชทันที';
        btnRefresh.disabled = false;
      });
    }
  }

  function startLiveScorePolling(match) {
    if (HubState.isLivePollingActive) return;
    HubState.isLivePollingActive = true;
    HubState.liveSyncCountdown = 12; // 12 seconds polling interval (within 10-15s requirement)

    if (HubState.livePollingInterval) {
      clearInterval(HubState.livePollingInterval);
    }

    HubState.livePollingInterval = setInterval(async () => {
      HubState.liveSyncCountdown--;
      const cdEl = document.getElementById('liveSyncCountdownSecs');
      if (cdEl) {
        cdEl.textContent = `${HubState.liveSyncCountdown}s`;
      }

      if (HubState.liveSyncCountdown <= 0) {
        HubState.liveSyncCountdown = 12; // Reset countdown
        await refreshLiveScoreData(match);
      }
    }, 1000);
  }

  function stopLiveScorePolling() {
    HubState.isLivePollingActive = false;
    if (HubState.livePollingInterval) {
      clearInterval(HubState.livePollingInterval);
      HubState.livePollingInterval = null;
    }
  }

  async function refreshLiveScoreData(currentMatch) {
    try {
      const data = await fetchFootballData(`teams/${CHELSEA_TEAM_ID}/matches`, true);
      if (data && data.matches) {
        HubState.matches = data.matches;

        // Find updated match
        const updatedMatch = HubState.matches.find(m => m.id === currentMatch.id) || currentMatch;

        // Check if score changed
        const newScoreKey = `${updatedMatch.score?.fullTime?.home ?? updatedMatch.score?.current?.home ?? 0}-${updatedMatch.score?.fullTime?.away ?? updatedMatch.score?.current?.away ?? 0}`;
        const scoreChanged = HubState.lastLiveScoreKey !== null && HubState.lastLiveScoreKey !== newScoreKey;
        HubState.lastLiveScoreKey = newScoreKey;

        // If match finished, reload full view
        if (updatedMatch.status === 'FINISHED') {
          stopLiveScorePolling();
          updateDashboardFixtures();
          renderMatchesTable();
          return;
        }

        // Re-render live spotlight and table
        renderLiveSpotlight(updatedMatch, scoreChanged);
        renderMatchesTable();
      }
    } catch (err) {
      console.warn('Real-time live score sync warning:', err);
    }
  }

  function startCountdown(targetTime, nextMatch) {
    if (HubState.countdownInterval) clearInterval(HubState.countdownInterval);

    function update() {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(HubState.countdownInterval);
        HubState.countdownInterval = null;
        // Kickoff reached! Immediately transition to real-time live score
        updateDashboardFixtures();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('cdDays');
      const hEl = document.getElementById('cdHours');
      const mEl = document.getElementById('cdMins');
      const sEl = document.getElementById('cdSecs');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    HubState.countdownInterval = setInterval(update, 1000);
  }

  async function loadSquad() {
    const container = document.getElementById('squadGridContainer');
    const coachContainer = document.getElementById('coachProfileContainer');
    if (!container) return;

    container.innerHTML = `<div class="hub-state-box"><div class="hub-spinner"></div><p>กำลังซิงค์ข้อมูลโปรไฟล์นักเตะทีมชาย (data/players-men.json)...</p></div>`;

    try {
      // 1. Load official rich players data from data/players-men.json
      let players = [];
      try {
        const res = await fetch('data/players-men.json');
        if (res.ok) {
          players = await res.json();
        }
      } catch (e) {
        console.warn('Could not fetch local players-men.json, fallback to API:', e);
      }

      // If local data exists, use it
      if (players && players.length > 0) {
        HubState.squad = players.filter(p => p.status !== 'sold' && p.status !== 'retired');
      } else {
        // Fallback to Football-Data API
        const data = await fetchFootballData(`teams/${CHELSEA_TEAM_ID}`);
        HubState.squad = data.squad || [];
      }

      // 2. Render Coach Profile (Enzo Maresca)
      if (coachContainer) {
        coachContainer.innerHTML = `
          <div style="background: rgba(0, 51, 160, 0.25); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 12px; padding: 1.1rem 1.35rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.9rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #0033a0, #1e40af); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; border: 2px solid #38bdf8; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">👔</div>
              <div>
                <div style="font-size: 0.75rem; color: #38bdf8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Head Coach / หัวหน้าผู้ฝึกสอน</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">Enzo Maresca</div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; font-size: 0.85rem; color: #93c5fd;">
              <div>🌍 <strong>สัญชาติ:</strong> อิตาลี (Italy)</div>
              <div>📅 <strong>เริ่มคุมทีม:</strong> ก.ค. 2024 (สัญญาถึง 2029)</div>
              <div style="background: rgba(56, 189, 248, 0.15); padding: 4px 10px; border-radius: 6px; color: #38bdf8; font-weight: 600;">
                👔 ผู้จัดการทีมชุดใหญ่
              </div>
            </div>
          </div>
        `;
      }

      renderSquadCards('ALL');
    } catch (err) {
      console.error('Failed to load squad:', err);
      container.innerHTML = `<div class="hub-state-box" style="color: #f87171;">เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์นักเตะ</div>`;
    }
  }

  function getPlayerCategory(pos) {
    if (!pos) return 'MF';
    const p = String(pos).toLowerCase();
    if (p.includes('goal') || p === 'gk') return 'GK';
    if (p.includes('back') || p.includes('defence') || p.includes('defender') || p.includes('cb') || p.includes('lb') || p.includes('rb') || p === 'df') return 'DF';
    if (p.includes('midfield') || p.includes('mf') || p.includes('cm') || p.includes('cam') || p.includes('cdm')) return 'MF';
    if (p.includes('forward') || p.includes('winger') || p.includes('striker') || p.includes('offence') || p.includes('fw') || p.includes('st') || p.includes('cf') || p.includes('rw') || p.includes('lw')) return 'FW';
    return 'MF';
  }

  function formatPlayerHubValue(val) {
    if (!val) return '';
    if (typeof val === 'number') {
      if (val >= 1000000) return '€' + (val / 1000000).toFixed(1) + 'M';
      if (val >= 1000) return '€' + (val / 1000).toFixed(0) + 'K';
      return '€' + val.toLocaleString();
    }
    return String(val);
  }

  function renderSquadCards(positionFilter) {
    const container = document.getElementById('squadGridContainer');
    if (!container) return;

    let filtered = HubState.squad || [];
    if (positionFilter && positionFilter !== 'ALL') {
      filtered = filtered.filter(p => {
        const cat = getPlayerCategory(p.position);
        return cat === positionFilter;
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="hub-state-box">ไม่พบนักเตะในตำแหน่งที่เลือก</div>`;
      return;
    }

    container.innerHTML = `
      <div class="squad-cards-grid">
        ${filtered.map(p => {
          const category = getPlayerCategory(p.position);
          const posClass = `pos-${category.toLowerCase()}`;
          const pImage = p.image || 'assets/images/placeholder-player.svg';
          const pNum = (p.number || p.shirtNumber || '-');
          const mvFormatted = formatPlayerHubValue(p.market_value);
          const flagHtml = (window.getFlagSpriteHTML && p.nationality) ? window.getFlagSpriteHTML(p.nationality) : '';

          // Calculate total stats
          let totalApps = p.appearances || 0;
          let totalGoals = p.goals || 0;
          let totalAssists = p.assists || 0;
          if (p.stats) {
            totalApps = 0; totalGoals = 0; totalAssists = 0;
            for (const c in p.stats) {
              totalApps += (p.stats[c].appearances || 0);
              totalGoals += (p.stats[c].goals || 0);
              totalAssists += (p.stats[c].assists || 0);
            }
          }

          let loanBadge = '';
          if (p.status === 'loaned_out') {
            loanBadge = `<span style="font-size:0.7rem; background:#f39c12; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700;">ยืมตัว</span>`;
          } else if (p.status === 'new_signing') {
            loanBadge = `<span style="font-size:0.7rem; background:#27ae60; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700;">นักเตะใหม่</span>`;
          }

          return `
            <div class="player-hub-card" data-player-id="${p.id}" role="button" tabindex="0" title="คลิกเพื่อดูสถิติและฟอร์มล่าสุดของ ${p.name}" style="cursor: pointer;">
              <div class="player-hub-img-box">
                <img src="${pImage}" class="player-hub-img" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/placeholder-player.svg';" />
                <span class="player-hub-number-overlay">#${pNum}</span>
                <span class="player-hub-pos-overlay ${posClass}">${category}</span>
              </div>
              <div class="player-hub-body">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                    <div class="player-hub-name">${p.name}</div>
                    ${loanBadge}
                  </div>
                  <div class="player-hub-details">
                    <span style="display: inline-flex; align-items: center; gap: 4px;">
                      ${flagHtml} <span>${p.nationality || ''}</span>
                    </span>
                    ${p.age ? `<span>• อายุ ${p.age} ปี</span>` : ''}
                    ${p.height ? `<span>• ${p.height} cm</span>` : ''}
                  </div>
                </div>

                <div class="player-hub-stats-row">
                  <div style="display: flex; gap: 8px; font-size: 0.78rem;">
                    <span title="ลงเล่น">👕 ${totalApps} นัด</span>
                    <span title="ทำประตู">⚽ ${totalGoals}</span>
                    <span title="แอสซิสต์">🎯 ${totalAssists}</span>
                  </div>
                  ${mvFormatted ? `<div class="player-hub-mv">${mvFormatted}</div>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach click and keydown listeners to open modal
    container.querySelectorAll('.player-hub-card').forEach(card => {
      card.addEventListener('click', () => {
        const pid = card.getAttribute('data-player-id');
        openPlayerStatsModal(pid);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const pid = card.getAttribute('data-player-id');
          openPlayerStatsModal(pid);
        }
      });
    });
  }

  // ==========================================================================
  // PLAYER STATS & RECENT FORM MODAL LOGIC
  // ==========================================================================
  function openPlayerStatsModal(playerId) {
    const modalBackdrop = document.getElementById('playerStatsModal');
    const modalContent = document.getElementById('playerStatsModalContent');
    if (!modalBackdrop || !modalContent) return;

    const player = (HubState.squad || []).find(p => String(p.id) === String(playerId));
    if (!player) return;

    const isTh = (window.currentLang === 'th');
    const category = getPlayerCategory(player.position);
    const isGK = category === 'GK';
    const posClass = `pos-${category.toLowerCase()}`;
    const pImage = player.image || 'assets/images/placeholder-player.svg';
    const pNum = (player.number || player.shirtNumber || '-');
    const mvFormatted = formatPlayerHubValue(player.market_value);
    const flagHtml = (window.getFlagSpriteHTML && player.nationality) ? window.getFlagSpriteHTML(player.nationality) : '';
    const natName = (window.getCountryName && player.nationality) ? window.getCountryName(player.nationality, isTh ? 'th' : 'en') : player.nationality;

    // Calculate aggregated statistics
    let totalApps = player.appearances || 0;
    let totalGoals = player.goals || 0;
    let totalAssists = player.assists || 0;
    let totalCleanSheets = player.clean_sheets || 0;
    let totalYellows = 0;
    let totalReds = 0;

    const competitionRows = [];
    if (player.stats) {
      totalApps = 0; totalGoals = 0; totalAssists = 0; totalCleanSheets = 0;
      for (const compName in player.stats) {
        const st = player.stats[compName];
        totalApps += (st.appearances || 0);
        totalGoals += (st.goals || 0);
        totalAssists += (st.assists || 0);
        totalCleanSheets += (st.clean_sheets || 0);
        totalYellows += (st.yellow_cards || 0);
        totalReds += (st.red_cards || 0);

        competitionRows.push({
          competition: compName,
          appearances: st.appearances || 0,
          goals: st.goals || 0,
          assists: st.assists || 0,
          clean_sheets: st.clean_sheets || 0,
          yellow_cards: st.yellow_cards || 0,
          red_cards: st.red_cards || 0
        });
      }
    } else {
      competitionRows.push({
        competition: 'Premier League',
        appearances: totalApps,
        goals: totalGoals,
        assists: totalAssists,
        clean_sheets: totalCleanSheets,
        yellow_cards: 0,
        red_cards: 0
      });
    }

    // Recent Form Analysis & Form Rating
    const goalInvolvement = totalGoals + totalAssists;
    let formTag = '⚡ ผู้เล่นตัวหลักประจำทีม (Regular Squad)';
    let formTagColor = '#38bdf8';
    let formTrendText = 'ความพร้อมลงสนาม 100% พร้อมทำผลงานต่อเนื่อง';

    if (totalGoals >= 5 || goalInvolvement >= 7) {
      formTag = '🔥 ฟอร์มร้อนแรงระดับท็อป (Top Performer)';
      formTagColor = '#f59e0b';
      formTrendText = `มีส่วนร่วมกับประตูรวมถึง ${goalInvolvement} ประตูในฤดูกาลนี้`;
    } else if (player.age && player.age <= 21) {
      formTag = '💎 ดาวรุ่งพรสวรรค์สูง (Rising Star)';
      formTagColor = '#10b981';
      formTrendText = 'พัฒนาการยอดเยี่ยมและได้รับโอกาสลงสนามต่อเนื่อง';
    } else if (player.status === 'loaned_out') {
      formTag = '📦 ยืมตัวเพื่อเก็บเกี่ยวประสบการณ์ (On Loan)';
      formTagColor = '#eab308';
      formTrendText = `ปัจจุบันเล่นให้กับ ${player.current_club || 'สโมสรอื่น'}`;
    }

    const goalPerGame = totalApps > 0 ? (totalGoals / totalApps).toFixed(2) : '0.00';
    const involvementPerGame = totalApps > 0 ? (goalInvolvement / totalApps).toFixed(2) : '0.00';

    // Biography text
    let bioText = '';
    if (isTh && player.biography_th) {
      bioText = player.biography_th;
    } else if (player.biography_en) {
      bioText = player.biography_en;
    } else if (player.biography_th) {
      bioText = player.biography_th;
    } else {
      bioText = `${player.name} นักเตะตำแหน่ง ${player.position} ทีมชาติ ${natName || player.nationality} ปัจจุบันค้าแข้งกับสโมสรฟุตบอลเชลซี`;
    }

    modalContent.innerHTML = `
      <!-- Modal Hero Section -->
      <div class="player-modal-hero">
        <div class="player-modal-portrait-box">
          <img src="${pImage}" class="player-modal-portrait" alt="${player.name}" onerror="this.onerror=null; this.src='assets/images/placeholder-player.svg';" />
        </div>
        <div class="player-modal-bio-header">
          <div class="player-modal-badges">
            <span class="player-modal-num-badge">#${pNum}</span>
            <span class="player-hub-pos-overlay ${posClass}" style="position: static;">${player.position || category}</span>
            ${mvFormatted ? `<span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; border: 1px solid rgba(56, 189, 248, 0.3);">💰 ${mvFormatted}</span>` : ''}
          </div>
          <h2 id="modalPlayerName" class="player-modal-name">${player.name}</h2>
          
          <div class="player-modal-meta-grid">
            <div class="player-modal-meta-item">
              <span>สัญชาติ:</span> <strong>${flagHtml} ${natName || player.nationality || '--'}</strong>
            </div>
            <div class="player-modal-meta-item">
              <span>อายุ:</span> <strong>${player.age ? player.age + ' ปี' : '--'} ${player.date_of_birth ? `(${player.date_of_birth})` : ''}</strong>
            </div>
            <div class="player-modal-meta-item">
              <span>ส่วนสูง:</span> <strong>${player.height ? player.height + ' cm' : '--'}</strong>
            </div>
            <div class="player-modal-meta-item">
              <span>เท้าข้างถนัด:</span> <strong>${player.foot || '--'}</strong>
            </div>
            <div class="player-modal-meta-item">
              <span>ย้ายมาร่วมทีม:</span> <strong>${player.joined || '--'}</strong>
            </div>
            <div class="player-modal-meta-item">
              <span>สโมสรเดิม:</span> <strong>${player.signed_from || '--'}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Body Section -->
      <div class="player-modal-body">
        
        <!-- Key Performance Statistics Grid -->
        <div>
          <div class="player-section-title">
            <span>📊 สถิติการลงเล่นและผลงานสะสม (Career & Season Stats)</span>
          </div>
          <div class="player-modal-stats-grid">
            <div class="player-stat-card">
              <div class="player-stat-val">${totalApps}</div>
              <div class="player-stat-lbl">👕 ลงเล่นทั้งหมด</div>
            </div>
            <div class="player-stat-card">
              <div class="player-stat-val" style="color: #22c55e;">${totalGoals}</div>
              <div class="player-stat-lbl">⚽ ประตู (Goals)</div>
            </div>
            <div class="player-stat-card">
              <div class="player-stat-val" style="color: #38bdf8;">${totalAssists}</div>
              <div class="player-stat-lbl">🎯 แอสซิสต์ (Assists)</div>
            </div>
            ${isGK ? `
              <div class="player-stat-card">
                <div class="player-stat-val" style="color: #f59e0b;">${totalCleanSheets}</div>
                <div class="player-stat-lbl">🧤 คลีนชีต (Clean Sheets)</div>
              </div>
            ` : `
              <div class="player-stat-card">
                <div class="player-stat-val" style="color: #a855f7;">${goalInvolvement}</div>
                <div class="player-stat-lbl">⚡ G+A รวม</div>
              </div>
            `}
            <div class="player-stat-card">
              <div class="player-stat-val" style="color: #eab308; font-size: 1.25rem;">
                🟨 ${totalYellows} <span style="color: #ef4444; margin-left: 4px;">🟥 ${totalReds}</span>
              </div>
              <div class="player-stat-lbl">ใบเหลือง / แดง</div>
            </div>
          </div>
        </div>

        <!-- Recent Form & Performance Indicators -->
        <div class="player-form-box">
          <div class="player-section-title" style="margin-bottom: 0.6rem;">
            <span>📈 ฟอร์มการเล่นและการมีส่วนร่วม (Recent Form & Impact)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
            <span style="background: ${formTagColor}22; color: ${formTagColor}; border: 1px solid ${formTagColor}55; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.82rem;">
              ${formTag}
            </span>
            <span style="font-size: 0.82rem; color: #cbd5e1;">${formTrendText}</span>
          </div>

          <div class="form-metric-chips">
            <div class="form-chip">
              <span>อัตราเฉลี่ยประตู/นัด:</span> <strong>${goalPerGame}</strong>
            </div>
            <div class="form-chip">
              <span>อัตรามีส่วนร่วม (G+A/นัด):</span> <strong>${involvementPerGame}</strong>
            </div>
            <div class="form-chip">
              <span>สถานะสัญญา/ทีม:</span> <strong>${player.current_club || 'Chelsea FC'}</strong>
            </div>
          </div>
        </div>

        <!-- Competition Breakdown Table -->
        <div>
          <div class="player-section-title">
            <span>🏆 สถิติแยกตามรายการแข่งขัน (Competition Breakdown)</span>
          </div>
          <div class="player-modal-table-wrap">
            <table class="player-modal-table">
              <thead>
                <tr>
                  <th>รายการแข่งขัน</th>
                  <th style="text-align: center;">ลงเล่น (Apps)</th>
                  <th style="text-align: center;">ประตู (Goals)</th>
                  <th style="text-align: center;">แอสซิสต์</th>
                  ${isGK ? `<th style="text-align: center;">คลีนชีต</th>` : ''}
                  <th style="text-align: center;">ใบเหลือง</th>
                  <th style="text-align: center;">ใบแดง</th>
                </tr>
              </thead>
              <tbody>
                ${competitionRows.map(row => `
                  <tr>
                    <td style="font-weight: 600; color: #38bdf8;">${row.competition}</td>
                    <td style="text-align: center;">${row.appearances}</td>
                    <td style="text-align: center; color: #22c55e; font-weight: 700;">${row.goals}</td>
                    <td style="text-align: center;">${row.assists}</td>
                    ${isGK ? `<td style="text-align: center; color: #f59e0b; font-weight: 700;">${row.clean_sheets}</td>` : ''}
                    <td style="text-align: center; color: #eab308;">${row.yellow_cards}</td>
                    <td style="text-align: center; color: #ef4444;">${row.red_cards}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Biography Summary -->
        <div>
          <div class="player-section-title">
            <span>📝 ข้อมูลชีวประวัติ (Biography)</span>
          </div>
          <div class="player-modal-bio-text">
            ${bioText}
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="player-modal-actions">
          <a href="player-profile.html?id=${player.id}&team=men" class="hub-btn hub-btn-primary" style="text-decoration: none; font-size: 0.85rem; padding: 0.5rem 1.1rem;">
            <span>ดูโปรไฟล์ฉบับเต็ม →</span>
          </a>
          <button type="button" class="hub-btn" id="btnModalCloseAction" style="font-size: 0.85rem; padding: 0.5rem 1.1rem; background: rgba(147, 197, 253, 0.12); color: #ffffff; border: 1px solid rgba(147, 197, 253, 0.2);">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    `;

    // Show modal
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Hook internal close action button
    const btnInnerClose = document.getElementById('btnModalCloseAction');
    if (btnInnerClose) {
      btnInnerClose.addEventListener('click', closePlayerStatsModal);
    }
  }

  function closePlayerStatsModal() {
    const modalBackdrop = document.getElementById('playerStatsModal');
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 4. HEAD-TO-HEAD (H2H) RIVAL STATS COMPONENT
  // ==========================================================================
  const TOP_RIVALS = [
    { id: 57, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
    { id: 65, name: 'Manchester City FC', shortName: 'Man City', crest: 'https://crests.football-data.org/65.png' },
    { id: 64, name: 'Liverpool FC', shortName: 'Liverpool', crest: 'https://crests.football-data.org/64.png' },
    { id: 66, name: 'Manchester United FC', shortName: 'Man United', crest: 'https://crests.football-data.org/66.png' },
    { id: 73, name: 'Tottenham Hotspur FC', shortName: 'Tottenham', crest: 'https://crests.football-data.org/73.png' },
    { id: 67, name: 'Newcastle United FC', shortName: 'Newcastle', crest: 'https://crests.football-data.org/67.png' },
    { id: 58, name: 'Aston Villa FC', shortName: 'Aston Villa', crest: 'https://crests.football-data.org/58.png' },
    { id: 62, name: 'Everton FC', shortName: 'Everton', crest: 'https://crests.football-data.org/62.png' },
    { id: 63, name: 'Fulham FC', shortName: 'Fulham', crest: 'https://crests.football-data.org/63.png' }
  ];

  async function renderH2HAnalysis() {
    const container = document.getElementById('h2hComponentContainer');
    if (!container) return;

    const opponentId = parseInt(HubState.h2hSelectedOpponent, 10);
    const opponent = TOP_RIVALS.find(r => r.id === opponentId) || TOP_RIVALS[0];

    // Filter matches against this opponent
    const h2hMatches = HubState.matches.filter(m => {
      return (m.homeTeam?.id === opponent.id && m.awayTeam?.id === CHELSEA_TEAM_ID) ||
             (m.awayTeam?.id === opponent.id && m.homeTeam?.id === CHELSEA_TEAM_ID);
    });

    let played = 0, chelseaWins = 0, draws = 0, oppWins = 0;
    let chelseaGoals = 0, oppGoals = 0;

    h2hMatches.forEach(m => {
      if (m.status !== 'FINISHED' || !m.score?.fullTime) return;
      played++;
      const isChelseaHome = m.homeTeam.id === CHELSEA_TEAM_ID;
      const cG = isChelseaHome ? m.score.fullTime.home : m.score.fullTime.away;
      const oG = isChelseaHome ? m.score.fullTime.away : m.score.fullTime.home;

      if (cG != null && oG != null) {
        chelseaGoals += cG;
        oppGoals += oG;
        if (cG > oG) chelseaWins++;
        else if (cG === oG) draws++;
        else oppWins++;
      }
    });

    const cWinPct = played > 0 ? ((chelseaWins / played) * 100).toFixed(1) : 0;
    const drawPct = played > 0 ? ((draws / played) * 100).toFixed(1) : 0;
    const oppWinPct = played > 0 ? ((oppWins / played) * 100).toFixed(1) : 0;

    container.innerHTML = `
      <div class="h2h-comparison-card">
        <div class="h2h-teams-header">
          <div class="h2h-team-block">
            <img src="https://crests.football-data.org/61.png" class="h2h-team-crest" alt="Chelsea FC" />
            <div>
              <div class="h2h-team-title" style="color: #38bdf8;">Chelsea FC</div>
              <div style="font-size: 0.8rem; color: #93c5fd;">The Blues</div>
            </div>
          </div>

          <div class="h2h-vs-badge">VS</div>

          <div class="h2h-team-block opponent">
            <img src="${opponent.crest}" class="h2h-team-crest" alt="${opponent.name}" />
            <div>
              <div class="h2h-team-title">${opponent.name}</div>
              <div style="font-size: 0.8rem; color: #93c5fd;">Rival Team</div>
            </div>
          </div>
        </div>

        <!-- Ratio Bar -->
        <div class="h2h-ratio-bar-container">
          <div class="h2h-ratio-labels">
            <span style="color: #38bdf8;">Chelsea ชนะ ${chelseaWins} นัด (${cWinPct}%)</span>
            <span style="color: #fbbf24;">เสมอ ${draws} นัด (${drawPct}%)</span>
            <span style="color: #f87171;">${opponent.shortName} ชนะ ${oppWins} นัด (${oppWinPct}%)</span>
          </div>
          <div class="h2h-bar-track">
            <div class="h2h-bar-win" style="width: ${cWinPct}%;" title="Chelsea Wins: ${cWinPct}%"></div>
            <div class="h2h-bar-draw" style="width: ${drawPct}%;" title="Draws: ${drawPct}%"></div>
            <div class="h2h-bar-loss" style="width: ${oppWinPct}%;" title="Opponent Wins: ${oppWinPct}%"></div>
          </div>
        </div>

        <!-- Head to Head KPI Cards -->
        <div class="hub-kpi-grid" style="margin-top: 1.5rem;">
          <div class="hub-kpi-card">
            <div class="hub-kpi-label">พบกันทั้งหมด</div>
            <div class="hub-kpi-value">${played || h2hMatches.length}</div>
            <div class="hub-kpi-sub">ในฤดูกาลนี้</div>
          </div>
          <div class="hub-kpi-card kpi-win">
            <div class="hub-kpi-label">Chelsea ชนะ</div>
            <div class="hub-kpi-value" style="color: #34d399;">${chelseaWins}</div>
            <div class="hub-kpi-sub">${cWinPct}% Win Rate</div>
          </div>
          <div class="hub-kpi-card kpi-draw">
            <div class="hub-kpi-label">เสมอกัน</div>
            <div class="hub-kpi-value" style="color: #fbbf24;">${draws}</div>
            <div class="hub-kpi-sub">${drawPct}% Draw Rate</div>
          </div>
          <div class="hub-kpi-card kpi-loss">
            <div class="hub-kpi-label">${opponent.shortName} ชนะ</div>
            <div class="hub-kpi-value" style="color: #f87171;">${oppWins}</div>
            <div class="hub-kpi-sub">${oppWinPct}% Opponent Win</div>
          </div>
          <div class="hub-kpi-card">
            <div class="hub-kpi-label">ประตูรวม เชลซี : คู่แข่ง</div>
            <div class="hub-kpi-value" style="font-size: 1.4rem;">${chelseaGoals} : ${oppGoals}</div>
            <div class="hub-kpi-sub">ผลต่าง ${chelseaGoals - oppGoals} ประตู</div>
          </div>
        </div>

        <!-- Historical Matches List Table -->
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #ffffff;">📜 ประวัติและผลการพบกัน (Matches Record)</h4>
          <div class="hub-table-wrapper">
            <table class="hub-table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>รายการ</th>
                  <th>ทีมเหย้า</th>
                  <th style="text-align: center;">สกอร์</th>
                  <th>ทีมเยือน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                ${h2hMatches.length === 0 ? `
                  <tr><td colspan="6" class="hub-state-box">ยังไม่มีประวัติการแข่งขันในรายการปัจจุบัน</td></tr>
                ` : h2hMatches.map(m => {
                  const outcome = getChelseaOutcome(m);
                  const badgeClass = outcome === 'W' ? 'win' : outcome === 'D' ? 'draw' : outcome === 'L' ? 'loss' : '';
                  const homeScore = m.score?.fullTime?.home ?? '-';
                  const awayScore = m.score?.fullTime?.away ?? '-';
                  const isFinished = m.status === 'FINISHED';
                  const targetFixtureId = isFinished ? findMatchingFixtureId(m) : null;
                  const detailHref = isFinished ? `match-detail.html?id=${targetFixtureId}` : '';
                  const matchTitle = `${m.homeTeam.shortName || m.homeTeam.name} vs ${m.awayTeam.shortName || m.awayTeam.name}`;

                  const rowAttrs = isFinished ? `
                    class="hub-match-row-clickable ${outcome === 'W' ? 'row-highlight' : ''}" 
                    data-href="${detailHref}" 
                    tabindex="0" 
                    role="link" 
                    title="คลิกเพื่อดูรายละเอียดแมตช์ (${matchTitle})"
                    aria-label="ดูรายละเอียดแมตช์ ${matchTitle}"
                  ` : '';

                  return `
                    <tr ${rowAttrs}>
                      <td style="font-size: 0.85rem; color: #93c5fd;">${formatMatchDate(m.utcDate)}</td>
                      <td style="font-size: 0.82rem;">${m.competition?.name || 'Tournament'}</td>
                      <td>
                        <div class="hub-team-cell">
                          <img src="${m.homeTeam.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" />
                          <span class="${m.homeTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">${m.homeTeam.shortName || m.homeTeam.name}</span>
                        </div>
                      </td>
                      <td style="text-align: center;">
                        <span class="hub-score-badge ${badgeClass}">${homeScore} - ${awayScore}</span>
                      </td>
                      <td>
                        <div class="hub-team-cell">
                          <img src="${m.awayTeam.crest || 'assets/images/placeholder-team.svg'}" class="hub-team-crest" alt="" />
                          <span class="${m.awayTeam.id === CHELSEA_TEAM_ID ? 'hub-team-chelsea' : ''}">${m.awayTeam.shortName || m.awayTeam.name}</span>
                        </div>
                      </td>
                      <td>
                        <span class="hub-status-pill ${isFinished ? 'hub-status-finished is-clickable' : 'hub-status-scheduled'}">
                          ${isFinished ? 'จบการแข่งขัน <span class="hub-status-view-cta">↗</span>' : 'โปรแกรมแข่งขัน'}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Attach click and keyboard listeners for H2H table
    const h2hTableBody = container.querySelector('tbody');
    if (h2hTableBody) {
      h2hTableBody.onclick = (e) => {
        const row = e.target.closest('tr.hub-match-row-clickable');
        if (row && row.dataset.href) {
          window.location.href = row.dataset.href;
        }
      };

      h2hTableBody.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const row = e.target.closest('tr.hub-match-row-clickable');
          if (row && row.dataset.href) {
            e.preventDefault();
            window.location.href = row.dataset.href;
          }
        }
      };
    }
  }

  // ==========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // ==========================================================================
  function initChelseaHub() {
    // 1. Tab Navigation Switches
    const tabBtns = document.querySelectorAll('.hub-tab-btn');
    const panels = document.querySelectorAll('.hub-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(`panel-${target}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // 2. Matches Table Filter Listeners
    const statusFilter = document.getElementById('matchesStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        HubState.matchesFilter.status = e.target.value;
        renderMatchesTable();
      });
    }

    const compFilter = document.getElementById('matchesCompFilter');
    if (compFilter) {
      compFilter.addEventListener('change', (e) => {
        HubState.matchesFilter.competition = e.target.value;
        renderMatchesTable();
      });
    }

    const searchInput = document.getElementById('matchesSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        HubState.matchesFilter.search = e.target.value;
        renderMatchesTable();
      });
    }

    const refreshMatchesBtn = document.getElementById('btnRefreshMatches');
    if (refreshMatchesBtn) {
      refreshMatchesBtn.addEventListener('click', () => {
        loadChelseaMatches();
      });
    }

    // 3. Manager Timeline Preset Buttons & Date Pickers
    const presetContainer = document.getElementById('managerPresetsContainer');
    if (presetContainer) {
      presetContainer.innerHTML = MANAGER_PRESETS.map((p, idx) => `
        <button type="button" class="manager-preset-btn ${idx === 0 ? 'active' : ''}" data-start="${p.start}" data-end="${p.end}" data-name="${p.name}">
          ${p.label}
        </button>
      `).join('');

      presetContainer.querySelectorAll('.manager-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          presetContainer.querySelectorAll('.manager-preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const start = btn.getAttribute('data-start');
          const end = btn.getAttribute('data-end');
          const name = btn.getAttribute('data-name');

          HubState.managerFilter.startDate = start;
          HubState.managerFilter.endDate = end;
          HubState.managerFilter.managerName = name;

          const startInput = document.getElementById('managerStartDateInput');
          const endInput = document.getElementById('managerEndDateInput');
          if (startInput) startInput.value = start;
          if (endInput) endInput.value = end;

          renderManagerTimeline();
        });
      });
    }

    const startInput = document.getElementById('managerStartDateInput');
    const endInput = document.getElementById('managerEndDateInput');
    if (startInput) {
      startInput.value = HubState.managerFilter.startDate;
      startInput.addEventListener('change', (e) => {
        HubState.managerFilter.startDate = e.target.value;
        renderManagerTimeline();
      });
    }
    if (endInput) {
      endInput.value = HubState.managerFilter.endDate;
      endInput.addEventListener('change', (e) => {
        HubState.managerFilter.endDate = e.target.value;
        renderManagerTimeline();
      });
    }

    // 4. Squad Position Filter Buttons
    const squadFilterBtns = document.querySelectorAll('.squad-filter-btn');
    squadFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        squadFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSquadCards(btn.getAttribute('data-pos'));
      });
    });

    // 5. Head-to-Head Opponent Selector
    const h2hSelect = document.getElementById('h2hOpponentSelect');
    if (h2hSelect) {
      h2hSelect.innerHTML = TOP_RIVALS.map(r => `
        <option value="${r.id}" ${r.id === HubState.h2hSelectedOpponent ? 'selected' : ''}>
          ${r.name}
        </option>
      `).join('');

      h2hSelect.addEventListener('change', (e) => {
        HubState.h2hSelectedOpponent = e.target.value;
        renderH2HAnalysis();
      });
    }

    // 6. Player Stats Modal Close Listeners
    const modalBackdrop = document.getElementById('playerStatsModal');
    const btnCloseModal = document.getElementById('btnClosePlayerModal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closePlayerStatsModal);
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closePlayerStatsModal();
        }
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePlayerStatsModal();
      }
    });

    // Initial Load Calls
    loadChelseaMatches();
    loadDashboardData();
  }

  // Run on DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChelseaHub);
  } else {
    initChelseaHub();
  }

  // Expose to window for external integration
  window.ChelseaHub = {
    loadChelseaMatches,
    loadDashboardData,
    renderManagerTimeline,
    renderH2HAnalysis,
    calculateManagerStats,
    HubState
  };

})();
