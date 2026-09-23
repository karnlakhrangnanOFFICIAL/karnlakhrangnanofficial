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

  // ========================================================
  // ฟังก์ชันดึงข้อมูลเฉพาะทีมชาย (Chelsea FC Men - Team ID: 61)
  // ========================================================

  const CHELSEA_MEN_CONFIG = {
    teamId: 61,
    apiKey: 'fb73ad1df2194fdab3fe56614d1a953e',
    // ใช้ผ่าน Proxy ของเซิร์ฟเวอร์ในโปรเจกต์เพื่อเลี่ยงปัญหา CORS
    proxyBase: '/api/football-data'
  };

  const FOOTBALL_DATA_TOKEN = CHELSEA_MEN_CONFIG.apiKey;
  const CHELSEA_TEAM_ID = CHELSEA_MEN_CONFIG.teamId;
  const PREMIER_LEAGUE_CODE = 'PL';

  // Helper: ตรวจสอบและดึงโลโก้ท้องถิ่นจาก databases/logo/teams/
  function resolveLocalTeamLogo(teamName, fallbackLogo) {
    if (!teamName) return fallbackLogo || "databases/logo/teams/england_chelsea.svg";
    const name = typeof teamName === 'string' ? teamName.toLowerCase() : (teamName?.name || '').toLowerCase();
    if (name.includes("city lionesses") || name.includes("london city")) return "databases/logo/teams/London_City_Lionesses.svg";
    if (name.includes("manchester city") || name.includes("man city")) return "databases/logo/teams/england_manchester-city.svg";
    if (name.includes("manchester united") || name.includes("man utd")) return "databases/logo/teams/england_manchester-united.svg";
    if (name.includes("chelsea") || name === "kanlakhrangnan") return "databases/logo/teams/england_chelsea.svg";
    if (name.includes("tottenham") || name.includes("spurs")) return "databases/logo/teams/england_tottenham--2006-2013.svg";
    if (name.includes("arsenal")) return "databases/logo/teams/england_arsenal.svg";
    if (name.includes("aston villa")) return "databases/logo/teams/england_aston-villa.svg";
    if (name.includes("birmingham")) return "databases/logo/teams/england_birmingham.svg";
    if (name.includes("bournemouth")) return "databases/logo/teams/england_bournemouth.svg";
    if (name.includes("brentford")) return "databases/logo/teams/england_brentford.svg";
    if (name.includes("brighton")) return "databases/logo/teams/england_brighton.svg";
    if (name.includes("charlton")) return "databases/logo/teams/england_charlton.svg";
    if (name.includes("coventry")) return "databases/logo/teams/england_coventry-city.svg";
    if (name.includes("crystal palace")) return "databases/logo/teams/england_crystal-palace.svg";
    if (name.includes("everton")) return "databases/logo/teams/england_everton.svg";
    if (name.includes("fulham")) return "databases/logo/teams/england_fulham.svg";
    if (name.includes("hull")) return "databases/logo/teams/england_hull-city.svg";
    if (name.includes("ipswich")) return "databases/logo/teams/england_ipswich.svg";
    if (name.includes("leeds")) return "databases/logo/teams/england_leeds-united.svg";
    if (name.includes("liverpool")) return "databases/logo/teams/england_liverpool.svg";
    if (name.includes("luton")) return "databases/logo/teams/england_luton.svg";
    if (name.includes("newcastle")) return "databases/logo/teams/england_newcastle.svg";
    if (name.includes("nottingham")) return "databases/logo/teams/england_nottingham-forest.svg";
    if (name.includes("sunderland")) return "databases/logo/teams/england_sunderland.svg";
    if (name.includes("west ham")) return "databases/logo/teams/england_west-ham.svg";
    if (name.includes("juventus")) return "databases/logo/teams/italy_juventus--white.svg";
    if (name.includes("milan")) return "databases/logo/teams/italy_milan.svg";
    if (name.includes("sociedad")) return "databases/logo/teams/spain_real-sociedad.svg";
    if (name.includes("auckland")) return "databases/logo/teams/new-zealand_auckland-fc.svg";
    if (name.includes("wanderers")) return "databases/logo/teams/australia_western-sydney-wanderers.svg";
    if (name.includes("johor") || name.includes("tazim")) return "databases/logo/teams/malaysia_johor-darul-tazim.svg";
    if (name.includes("all stars") || name.includes("all-stars")) return "databases/logo/teams/a-league-women-all-stars.svg";
    
    if (fallbackLogo && fallbackLogo.startsWith("databases/logo/teams/")) return fallbackLogo;
    return fallbackLogo || "databases/logo/teams/england_chelsea.svg";
  }

  // Helper: ตรวจสอบว่าเป็นทีมเชลซี (ทั้งทีมชายและทีมหญิง)
  function isChelseaTeam(team) {
    if (!team) return false;
    if (team.id === CHELSEA_TEAM_ID) return true;
    const name = (team.name || team.shortName || '').toLowerCase();
    return name.includes('chelsea');
  }

  // Helper: แปลง fixtures ใน data/fixtures.json เป็นรูปแบบ Football-Data API Matches (รองรับทั้งทีมชายและทีมหญิง)
  function convertLocalFixturesToMatches(fixtures, includeWomen = true) {
    if (!Array.isArray(fixtures)) return [];
    const chelseaFixtures = fixtures.filter(f => {
      const isWomen = f.team_type === 'W' || (f.home_team || '').toLowerCase().includes('women') || (f.away_team || '').toLowerCase().includes('women');
      if (!includeWomen && isWomen) return false;
      const hasChe = (f.home_team || '').toLowerCase().includes('chelsea') ||
                     (f.away_team || '').toLowerCase().includes('chelsea');
      return hasChe;
    });

    return chelseaFixtures.map(f => {
      const isWomen = f.team_type === 'W' || (f.home_team || '').toLowerCase().includes('women') || (f.away_team || '').toLowerCase().includes('women');
      const isHome = (f.home_team || '').toLowerCase().includes('chelsea');
      const isCompleted = f.status === 'completed' || f.status === 'FINISHED';
      const isLive = f.status === 'live' || f.status === 'IN_PLAY';
      const status = isCompleted ? 'FINISHED' : (isLive ? 'IN_PLAY' : 'SCHEDULED');
      const timeStr = (f.time && f.time !== 'TBC') ? f.time : '19:00';
      const utcDate = (f.date && f.date !== 'TBC') ? `${f.date}T${timeStr}:00Z` : '2027-05-31T19:00:00Z';

      let compCode = 'PL';
      let compName = 'Premier League';
      const compLower = (f.competition || '').toLowerCase();
      if (compLower.includes('women') || compLower.includes('wsl') || isWomen) {
        compCode = 'WSL';
        compName = f.competition_name || f.competition || "Women's Super League";
      } else if (compLower.includes('league-cup') || compLower.includes('carabao')) {
        compCode = 'FLC';
        compName = 'Carabao Cup';
      } else if (compLower.includes('fa-cup')) {
        compCode = 'FAC';
        compName = 'FA Cup';
      } else if (compLower.includes('friendly')) {
        compCode = 'FRIENDLY';
        compName = 'Club Friendly';
      }

      return {
        id: f.id || ('m_' + Math.random().toString(36).substring(2, 8)),
        utcDate: utcDate,
        status: status,
        teamType: isWomen ? 'W' : 'M',
        matchday: f.matchday || f.round || null,
        competition: {
          id: isWomen ? 2022 : 2021,
          name: f.competition_name || f.competition || compName,
          code: compCode,
          emblem: f.competition_logo || null
        },
        homeTeam: {
          id: isHome ? CHELSEA_MEN_CONFIG.teamId : (f.home_id || 9999),
          name: f.home_team,
          shortName: f.home_team,
          crest: f.home_logo || 'assets/images/placeholder-team.svg'
        },
        awayTeam: {
          id: !isHome ? CHELSEA_MEN_CONFIG.teamId : (f.away_id || 9999),
          name: f.away_team,
          shortName: f.away_team,
          crest: f.away_logo || 'assets/images/placeholder-team.svg'
        },
        score: {
          winner: isCompleted ? (f.home_score > f.away_score ? 'HOME_TEAM' : (f.home_score < f.away_score ? 'AWAY_TEAM' : 'DRAW')) : null,
          duration: 'REGULAR',
          fullTime: {
            home: f.home_score ?? null,
            away: f.away_score ?? null
          },
          halfTime: {
            home: f.home_half_score ?? null,
            away: f.away_half_score ?? null
          }
        }
      };
    });
  }

  // 1. ดึงผลการแข่งขันและโปรแกรมแข่งทั้งหมดของทีมชาย (พร้อม Fallback สำหรับ Vercel)
  async function getChelseaMenMatches(status = 'SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED') {
    try {
      const statusQuery = status ? `?status=${status}` : '';
      let res;
      try {
        res = await fetch(`${CHELSEA_MEN_CONFIG.proxyBase}/teams/${CHELSEA_MEN_CONFIG.teamId}/matches${statusQuery}`);
      } catch (e) {
        // Proxy unavailable (e.g. on Vercel static)
      }
      if (!res || !res.ok) {
        res = await fetch(`https://api.football-data.org/v4/teams/${CHELSEA_MEN_CONFIG.teamId}/matches${statusQuery}`, {
          headers: { 'X-Auth-Token': CHELSEA_MEN_CONFIG.apiKey }
        });
      }
      if (res && res.ok) {
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          return data.matches;
        }
      }
    } catch (error) {
      console.warn("API matches fetch unavailable, falling back to data/fixtures.json:", error);
    }

    // Fallback: ดึงจาก data/fixtures.json สำหรับกรณี Vercel หรือออฟไลน์
    try {
      const localRes = await fetch('data/fixtures.json');
      if (localRes.ok) {
        const fixtures = await localRes.json();
        const converted = convertLocalFixturesToMatches(fixtures);
        if (converted.length > 0) return converted;
      }
    } catch (err) {
      console.error("Local fixtures fallback error:", err);
    }

    return [];
  }

  // 2. ดึงรายชื่อนักเตะและทีมงานสต๊าฟโค้ชทีมชาย (Chelsea FC Men Squad) (พร้อม Fallback สำหรับ Vercel)
  async function getChelseaMenSquad() {
    try {
      let res;
      try {
        res = await fetch(`${CHELSEA_MEN_CONFIG.proxyBase}/teams/${CHELSEA_MEN_CONFIG.teamId}`);
      } catch (e) {
        // Fallback
      }
      if (!res || !res.ok) {
        res = await fetch(`https://api.football-data.org/v4/teams/${CHELSEA_MEN_CONFIG.teamId}`, {
          headers: { 'X-Auth-Token': CHELSEA_MEN_CONFIG.apiKey }
        });
      }
      if (res && res.ok) {
        const data = await res.json();
        return {
          squad: data.squad || [],
          coach: data.coach || null,
          team: data
        };
      }
    } catch (error) {
      console.warn("API squad fetch unavailable, falling back to data/players-men.json:", error);
    }

    // Fallback: ดึงจาก data/players-men.json
    try {
      const pRes = await fetch('data/players-men.json');
      if (pRes.ok) {
        const players = await pRes.json();
        return {
          squad: Array.isArray(players) ? players : [],
          coach: { name: 'Xabi Alonso', nationality: 'Spanish', role: 'Manager' },
          team: { id: 61, name: 'Chelsea FC', shortName: 'Chelsea', tla: 'CHE' }
        };
      }
    } catch (err) {
      console.error("Local squad fallback error:", err);
    }

    return { squad: [], coach: { name: 'Xabi Alonso', nationality: 'Spanish', role: 'Manager' } };
  }

  // 3. ดึงตารางคะแนนพรีเมียร์ลีก (Premier League Standings) พร้อม Fallback อัตโนมัติไปยัง data/tables-men.json
  async function getPremierLeagueTable() {
    // 1. ลองดึงผ่าน Proxy ของเซิร์ฟเวอร์ก่อน
    try {
      let res = await fetch(`${CHELSEA_MEN_CONFIG.proxyBase}/competitions/PL/standings`);
      if (!res.ok) {
        res = await fetch('/api/epl-standings');
      }
      if (res && res.ok) {
        const data = await res.json();
        const table = data.standings?.[0]?.table || data.data;
        if (Array.isArray(table) && table.length > 0) {
          return table;
        }
      }
    } catch (e) {
      // Proxy unavailable (เช่น โฮสต์บน Vercel.app)
    }

    // 2. ลองดึงตรงจาก Football-Data.org API
    try {
      const res = await fetch(`https://api.football-data.org/v4/competitions/PL/standings`, {
        headers: { 'X-Auth-Token': CHELSEA_MEN_CONFIG.apiKey }
      });
      if (res && res.ok) {
        const data = await res.json();
        const table = data.standings?.[0]?.table;
        if (Array.isArray(table) && table.length > 0) {
          return table;
        }
      }
    } catch (e) {
      // Direct API fetch blocked by CORS on browser
    }

    // 3. Fallback อัตโนมัติ: โหลดจาก data/tables-men.json (แก้ปัญหา Vercel.app และกรณีออฟไลน์)
    try {
      console.warn("Football-data API unavailable, falling back to data/tables-men.json");
      const localRes = await fetch('data/tables-men.json');
      if (localRes.ok) {
        const localData = await localRes.json();
        const rawStandings = localData.standings || (Array.isArray(localData) ? localData : []);
        if (rawStandings.length > 0) {
          return rawStandings.map((row, idx) => {
            const teamName = typeof row.team === 'string' ? row.team : (row.team?.name || 'Unknown');
            const isChe = teamName.toLowerCase().includes('chelsea');
            return {
              position: row.pos ?? (idx + 1),
              team: {
                id: isChe ? CHELSEA_MEN_CONFIG.teamId : (row.id || (idx + 100)),
                name: teamName,
                shortName: teamName,
                crest: row.logo || 'assets/images/placeholder-team.svg'
              },
              playedGames: row.p ?? 0,
              won: row.w ?? 0,
              draw: row.d ?? 0,
              lost: row.l ?? 0,
              goalsFor: row.gf ?? 0,
              goalsAgainst: row.ga ?? 0,
              goalDifference: row.gd ?? ((row.gf || 0) - (row.ga || 0)),
              points: row.pts ?? 0
            };
          });
        }
      }
    } catch (err) {
      console.error("Local standings fallback error:", err);
    }

    return [];
  }

  // Fetch Women's Super League Standings
  async function getWomenLeagueTable() {
    try {
      const localRes = await fetch('data/tables-women.json');
      if (localRes.ok) {
        const localData = await localRes.json();
        const rawStandings = localData.standings || (Array.isArray(localData) ? localData : []);
        if (rawStandings.length > 0) {
          return rawStandings.map((row, idx) => {
            const teamName = typeof row.team === 'string' ? row.team : (row.team?.name || 'Unknown');
            const isChe = teamName.toLowerCase().includes('chelsea');
            return {
              position: row.pos ?? (idx + 1),
              team: {
                id: isChe ? CHELSEA_MEN_CONFIG.teamId : (row.id || (idx + 200)),
                name: teamName,
                shortName: teamName,
                crest: row.logo || 'assets/images/placeholder-team.svg'
              },
              playedGames: row.p ?? 0,
              won: row.w ?? 0,
              draw: row.d ?? 0,
              lost: row.l ?? 0,
              goalsFor: row.gf ?? 0,
              goalsAgainst: row.ga ?? 0,
              goalDifference: row.gd ?? ((row.gf || 0) - (row.ga || 0)),
              points: row.pts ?? 0
            };
          });
        }
      }
    } catch (err) {
      console.error("Local women standings fallback error:", err);
    }

    return [];
  }

  // Expose on window object for global project scripts and console access
  if (typeof window !== 'undefined') {
    window.CHELSEA_MEN_CONFIG = CHELSEA_MEN_CONFIG;
    window.getChelseaMenMatches = getChelseaMenMatches;
    window.getChelseaMenSquad = getChelseaMenSquad;
    window.getPremierLeagueTable = getPremierLeagueTable;
    window.getWomenLeagueTable = getWomenLeagueTable;
  }

  // Shared Data Cache
  const HubState = {
    matches: [],
    localFixtures: [],
    standings: [],
    standingsGender: 'men', // 'men' or 'women'
    menStandings: [],
    womenStandings: [],
    squad: [],
    coach: null,
    activeTab: 'dashboard',
    matchesFilter: {
      status: 'all',
      competition: 'all',
      search: '',
      sortOrder: 'asc' // Timeline order: 'asc' = chronological (oldest to newest)
    },
    managerFilter: {
      startDate: '2026-07-01',
      endDate: new Date().toISOString().split('T')[0],
      managerName: 'Xabi Alonso'
    },
    h2hSelectedOpponent: 57, // Default Arsenal FC
    countdownInterval: null,
    livePollingInterval: null,
    liveSyncCountdown: 12, // 10-15 seconds delay (12s default)
    lastLiveScoreKey: null,
    isLivePollingActive: false,
    isLiveSimulation: false,
    simulatedLiveMatch: null
  };

  // Safe API Fetch with Direct Token & Proxy Fallback
  async function fetchFootballData(endpoint, isLive = false) {
    const cacheBuster = isLive ? (endpoint.includes('?') ? `&_t=${Date.now()}&live=true` : `?_t=${Date.now()}&live=true`) : '';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const fullEndpoint = `${cleanEndpoint}${cacheBuster}`;

    // Try proxy first to bypass browser CORS if on web server
    try {
      const proxyUrl = `${CHELSEA_MEN_CONFIG.proxyBase}/${fullEndpoint}`;
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
        'X-Auth-Token': CHELSEA_MEN_CONFIG.apiKey
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
    const isHome = isChelseaTeam(match.homeTeam);
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
      // Pre-load local fixtures for rich match detail links and women fixtures
      let localConverted = [];
      try {
        const fRes = await fetch('data/fixtures.json');
        if (fRes.ok) {
          HubState.localFixtures = await fRes.json();
          localConverted = convertLocalFixturesToMatches(HubState.localFixtures, true);
        }
      } catch (e) {
        console.warn('Could not load local fixtures.json:', e);
      }

      const matches = await getChelseaMenMatches();
      let allMatches = matches && matches.length ? [...matches] : [];

      // รวมโปรแกรมและผลการแข่งขันของทีมหญิงเข้าไปด้วย (ไม่ให้มี ID ซ้ำ)
      if (localConverted && localConverted.length > 0) {
        const existingIds = new Set(allMatches.map(m => m.id));
        const womenMatches = localConverted.filter(m => m.teamType === 'W' || (m.homeTeam.name || '').toLowerCase().includes('women') || (m.awayTeam.name || '').toLowerCase().includes('women'));
        womenMatches.forEach(wm => {
          if (!existingIds.has(wm.id)) {
            allMatches.push(wm);
            existingIds.add(wm.id);
          }
        });
      }

      HubState.matches = allMatches;
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

    // If live simulation is running and matches status filter, prepend simulated match
    if (HubState.isLiveSimulation && HubState.simulatedLiveMatch) {
      if (status === 'all' || status === 'LIVE') {
        const simMatch = HubState.simulatedLiveMatch;
        const matchesComp = (competition === 'all' || simMatch.competition?.code === competition);
        if (matchesComp) {
          filtered = [simMatch, ...filtered.filter(m => m.id !== simMatch.id)];
        }
      }
    }

    // เรียงลำดับตามไทม์ไลน์ (Timeline chronological sort)
    filtered.sort((a, b) => {
      const timeA = new Date(a.utcDate).getTime() || 0;
      const timeB = new Date(b.utcDate).getTime() || 0;
      return (HubState.matchesFilter.sortOrder === 'desc') ? (timeB - timeA) : (timeA - timeB);
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
      const isChelseaHome = isChelseaTeam(m.homeTeam);
      const isChelseaAway = isChelseaTeam(m.awayTeam);
      const outcome = getChelseaOutcome(m);
      const isFinished = m.status === 'FINISHED';

      let scoreBadgeHtml = '';
      let goalscorersSnippet = '';

      if (isFinished) {
        const homeScore = m.score?.fullTime?.home ?? '-';
        const awayScore = m.score?.fullTime?.away ?? '-';
        const badgeClass = outcome === 'W' ? 'win' : outcome === 'D' ? 'draw' : outcome === 'L' ? 'loss' : '';
        scoreBadgeHtml = `
          <span class="hub-score-badge ${badgeClass}" title="Outcome: ${outcome || 'N/A'}">
            ${homeScore} - ${awayScore}
          </span>
        `;
      } else if (m.status === 'IN_PLAY' || m.status === 'PAUSED') {
        const homeScore = m.score?.fullTime?.home ?? (m.score?.current?.home ?? 0);
        const awayScore = m.score?.fullTime?.away ?? (m.score?.current?.away ?? 0);
        scoreBadgeHtml = `
          <span class="hub-score-badge" style="font-weight: 800; font-size: 0.95rem; border: 1px solid #ef4444; color: #ffffff; background: rgba(239, 68, 68, 0.28); display: inline-flex; align-items: center; gap: 5px;">
            <span class="live-pulse-dot" style="width: 7px; height: 7px; margin: 0;"></span>${homeScore} - ${awayScore}
          </span>
        `;
        if (m.goals && m.goals.length > 0) {
          const scorersText = m.goals.map(g => `${g.player} ${g.minute}'`).join(', ');
          goalscorersSnippet = `<div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 4px; white-space: normal; line-height: 1.3;" title="${scorersText}">⚽ ${scorersText}</div>`;
        }
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
        statusLabel = m.status === 'PAUSED' ? '⏸️ พักครึ่ง' : `🔴 กำลังแข่ง ${m.minute ? '(' + m.minute + "')" : ''}`;
        rowAttrs = `class="row-highlight"`;
      } else {
        statusLabel = 'ยังไม่เริ่ม';
        rowAttrs = `class="${outcome === 'W' ? 'row-highlight' : ''}"`;
      }

      const compEmblem = m.competition?.emblem ? `<img src="${m.competition.emblem}" class="hub-comp-emblem" alt="" />` : '';

      const homeName = m.homeTeam.shortName || m.homeTeam.name || 'Chelsea';
      const awayName = m.awayTeam.shortName || m.awayTeam.name || 'Opponent';
      const homeLogo = resolveLocalTeamLogo(homeName, m.homeTeam.crest);
      const awayLogo = resolveLocalTeamLogo(awayName, m.awayTeam.crest);

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
          <td style="text-align: center;">
            <div class="hub-team-cell-tooltip-only" style="display: flex; justify-content: center; align-items: center;">
              <div class="hub-logo-tooltip-wrap ${isChelseaHome ? 'is-chelsea' : ''}" data-tooltip="${homeName}">
                <img src="${homeLogo}" class="hub-fixture-logo-only" alt="${homeName}" title="${homeName}" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
                <span class="hub-logo-tooltip">${homeName}</span>
              </div>
            </div>
          </td>
          <td style="text-align: center;">
            ${scoreBadgeHtml}
            ${goalscorersSnippet}
          </td>
          <td style="text-align: center;">
            <div class="hub-team-cell-tooltip-only" style="display: flex; justify-content: center; align-items: center;">
              <div class="hub-logo-tooltip-wrap ${isChelseaAway ? 'is-chelsea' : ''}" data-tooltip="${awayName}">
                <img src="${awayLogo}" class="hub-fixture-logo-only" alt="${awayName}" title="${awayName}" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
                <span class="hub-logo-tooltip">${awayName}</span>
              </div>
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
    { name: 'Xabi Alonso', start: '2026-07-01', end: new Date().toISOString().split('T')[0], label: 'Xabi Alonso (2026 - ปัจจุบัน)' },
    { name: 'Enzo Maresca', start: '2024-07-01', end: '2026-06-30', label: 'Enzo Maresca (2024 - 2026)' },
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

        const homeName = m.homeTeam.shortName || m.homeTeam.name || 'Chelsea';
        const awayName = m.awayTeam.shortName || m.awayTeam.name || 'Opponent';
        const homeLogo = resolveLocalTeamLogo(homeName, m.homeTeam.crest);
        const awayLogo = resolveLocalTeamLogo(awayName, m.awayTeam.crest);

        return `
          <tr ${rowAttrs}>
            <td style="font-size: 0.85rem; color: #93c5fd;">${formatMatchDate(m.utcDate)}</td>
            <td style="font-size: 0.82rem;">${m.competition?.name || 'Tournament'}</td>
            <td style="text-align: center;">
              <div class="hub-team-cell-tooltip-only" style="display: flex; justify-content: center; align-items: center;">
                <div class="hub-logo-tooltip-wrap ${isChelseaHome ? 'is-chelsea' : ''}" data-tooltip="${homeName}">
                  <img src="${homeLogo}" class="hub-fixture-logo-only" alt="${homeName}" title="${homeName}" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
                  <span class="hub-logo-tooltip">${homeName}</span>
                </div>
              </div>
            </td>
            <td style="text-align: center;">
              <span class="hub-score-badge ${badgeClass}">${homeScore} - ${awayScore}</span>
            </td>
            <td style="text-align: center;">
              <div class="hub-team-cell-tooltip-only" style="display: flex; justify-content: center; align-items: center;">
                <div class="hub-logo-tooltip-wrap ${isChelseaAway ? 'is-chelsea' : ''}" data-tooltip="${awayName}">
                  <img src="${awayLogo}" class="hub-fixture-logo-only" alt="${awayName}" title="${awayName}" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
                  <span class="hub-logo-tooltip">${awayName}</span>
                </div>
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

  async function loadStandings(targetGender) {
    if (targetGender && (targetGender === 'men' || targetGender === 'women')) {
      HubState.standingsGender = targetGender;
    }
    const currentGender = HubState.standingsGender || 'men';

    // Update Header Text & Button Active states
    const titleText = document.getElementById('standingsTitleText');
    if (titleText) {
      titleText.textContent = currentGender === 'men' 
        ? 'ตารางคะแนน Premier League (ทีมชาย)' 
        : "ตารางคะแนน Women's Super League (ทีมหญิง)";
    }

    const menBtn = document.getElementById('standingsMenBtn');
    const womenBtn = document.getElementById('standingsWomenBtn');
    if (menBtn && womenBtn) {
      if (currentGender === 'men') {
        menBtn.classList.add('active');
        womenBtn.classList.remove('active');
      } else {
        womenBtn.classList.add('active');
        menBtn.classList.remove('active');
      }
    }

    const tableBody = document.getElementById('dashboardStandingsBody');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="hub-state-box">
          <div class="hub-spinner"></div>
          <p>กำลังดึงตารางคะแนน${currentGender === 'men' ? 'ทีมชาย' : 'ทีมหญิง'}ล่าสุด...</p>
        </td>
      </tr>
    `;

    try {
      let standingsTable = [];
      if (currentGender === 'men') {
        if (HubState.menStandings && HubState.menStandings.length > 0) {
          standingsTable = HubState.menStandings;
        } else {
          standingsTable = await getPremierLeagueTable();
          HubState.menStandings = standingsTable || [];
        }
      } else {
        if (HubState.womenStandings && HubState.womenStandings.length > 0) {
          standingsTable = HubState.womenStandings;
        } else {
          standingsTable = await getWomenLeagueTable();
          HubState.womenStandings = standingsTable || [];
        }
      }

      HubState.standings = standingsTable || [];

      if (standingsTable.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" class="hub-state-box">ไม่มีข้อมูลตารางคะแนน</td></tr>`;
        return;
      }

      tableBody.innerHTML = standingsTable.map(row => {
        const isChelsea = isChelseaTeam(row.team);
        const teamCrest = resolveLocalTeamLogo(row.team?.name || row.team?.shortName, row.team?.crest);

        return `
          <tr class="${isChelsea ? 'row-highlight' : ''}">
            <td style="font-weight: 700; width: 28px; text-align: center;">${row.position}</td>
            <td>
              <div class="hub-team-cell">
                <img src="${teamCrest}" class="hub-team-crest" alt="" loading="lazy" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
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
            <td style="text-align: center; font-weight: 800; color: #38bdf8; font-size: 0.95rem;">${row.points}</td>
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

    // 0. Check if Live Simulation is active
    if (HubState.isLiveSimulation && HubState.simulatedLiveMatch) {
      if (HubState.countdownInterval) {
        clearInterval(HubState.countdownInterval);
        HubState.countdownInterval = null;
      }
      renderLiveSpotlight(HubState.simulatedLiveMatch);
      startLiveScorePolling(HubState.simulatedLiveMatch);
      if (upcomingListContainer) {
        const restUpcoming = HubState.matches.filter(m => m.status !== 'FINISHED');
        renderUpcomingList(upcomingListContainer, restUpcoming);
      }
      return;
    }

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
        const isHome = isChelseaTeam(nextMatch.homeTeam);
        const venue = isHome ? 'Stamford Bridge (Home)' : 'Away Match';

        spotlightContainer.innerHTML = `
          <div class="spotlight-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="hub-status-pill hub-status-scheduled">🔥 นัดถัดไป / NEXT MATCH</span>
              <span style="font-size: 0.8rem; color: #93c5fd;">${nextMatch.competition?.name || 'Premier League'}</span>
            </div>

            <div class="spotlight-match-teams">
              <div class="spotlight-team">
                <img src="${nextMatch.homeTeam.crest || 'assets/images/placeholder-team.svg'}" class="spotlight-crest" alt="" onerror="this.onerror=null; this.src='assets/images/placeholder-team.svg';" />
                <div class="spotlight-team-name ${isChelseaTeam(nextMatch.homeTeam) ? 'hub-team-chelsea' : ''}">
                  ${nextMatch.homeTeam.shortName || nextMatch.homeTeam.name}
                </div>
              </div>

              <div class="spotlight-vs">VS</div>

              <div class="spotlight-team">
                <img src="${nextMatch.awayTeam.crest || 'assets/images/placeholder-team.svg'}" class="spotlight-crest" alt="" onerror="this.onerror=null; this.src='assets/images/placeholder-team.svg';" />
                <div class="spotlight-team-name ${isChelseaTeam(nextMatch.awayTeam) ? 'hub-team-chelsea' : ''}">
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
                  const isHomeChe = isChelseaTeam(m.homeTeam);
                  const isAwayChe = isChelseaTeam(m.awayTeam);
                  const homeName = m.homeTeam.shortName || m.homeTeam.name || 'Chelsea';
                  const awayName = m.awayTeam.shortName || m.awayTeam.name || 'Opponent';
                  const homeLogo = resolveLocalTeamLogo(homeName, m.homeTeam.crest);
                  const awayLogo = resolveLocalTeamLogo(awayName, m.awayTeam.crest);

                  return `
                    <tr>
                      <td style="font-size: 0.82rem; color: #93c5fd; width: 140px;">${formatMatchDate(m.utcDate)}</td>
                      <td>
                        <div class="hub-fixture-logos-cell">
                          <div class="hub-logo-tooltip-wrap ${isHomeChe ? 'is-chelsea' : ''}" data-tooltip="${homeName}">
                            <img src="${homeLogo}" class="hub-fixture-logo-only" alt="${homeName}" title="${homeName}" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
                            <span class="hub-logo-tooltip">${homeName}</span>
                          </div>
                          <span class="hub-fixture-vs-badge">VS</span>
                          <div class="hub-logo-tooltip-wrap ${isAwayChe ? 'is-chelsea' : ''}" data-tooltip="${awayName}">
                            <img src="${awayLogo}" class="hub-fixture-logo-only" alt="${awayName}" title="${awayName}" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';" />
                            <span class="hub-logo-tooltip">${awayName}</span>
                          </div>
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

  function initSimulatedLiveMatch() {
    return {
      id: 999999,
      status: 'IN_PLAY',
      minute: 68,
      utcDate: new Date().toISOString(),
      competition: { name: 'Premier League', emblem: 'databases/logo/leagues/premier_league.svg', code: 'PL' },
      homeTeam: { id: CHELSEA_TEAM_ID, name: 'Chelsea FC', shortName: 'Chelsea', crest: 'databases/logo/teams/england_chelsea.svg' },
      awayTeam: { id: 57, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'databases/logo/teams/england_arsenal.svg' },
      score: {
        fullTime: { home: 2, away: 1 },
        halfTime: { home: 1, away: 0 }
      },
      goals: [
        { team: 'home', player: 'Cole Palmer', minute: 24, type: 'regular' },
        { team: 'away', player: 'B. Saka', minute: 41, type: 'regular' },
        { team: 'home', player: 'N. Jackson', minute: 58, type: 'regular' }
      ]
    };
  }

  function toggleLiveDemo() {
    HubState.isLiveSimulation = !HubState.isLiveSimulation;
    const btn = document.getElementById('btnToggleLiveDemo');
    const btnText = document.getElementById('btnToggleLiveDemoText');

    if (HubState.isLiveSimulation) {
      HubState.simulatedLiveMatch = initSimulatedLiveMatch();
      if (btn) btn.classList.add('is-active');
      if (btnText) btnText.textContent = '⏹️ สิ้นสุดการทดสอบ Live';
      if (HubState.countdownInterval) {
        clearInterval(HubState.countdownInterval);
        HubState.countdownInterval = null;
      }
      renderLiveSpotlight(HubState.simulatedLiveMatch, true);
      startLiveScorePolling(HubState.simulatedLiveMatch);
    } else {
      HubState.simulatedLiveMatch = null;
      if (btn) btn.classList.remove('is-active');
      if (btnText) btnText.textContent = 'ทดสอบระบบ Live Score 🔴';
      stopLiveScorePolling();
      updateDashboardFixtures();
    }
    renderMatchesTable();
  }

  function renderLiveSpotlight(match, scoreChanged = false) {
    const spotlightContainer = document.getElementById('nextFixtureSpotlight');
    if (!spotlightContainer || !match) return;

    const isHome = isChelseaTeam(match.homeTeam);
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

    // Parse Goalscorers
    const goalsList = match.goals || match.events?.filter(e => e.type === 'Goal' || e.type === 'goal') || [];
    const homeGoals = [];
    const awayGoals = [];

    goalsList.forEach(g => {
      const isHomeGoal = g.team === 'home' || g.team?.id === match.homeTeam.id || g.teamId === match.homeTeam.id;
      const scorerObj = {
        name: g.player?.name || g.player || g.scorer?.name || 'ผู้เล่น',
        minute: g.minute || g.time || 0,
        type: g.type || ''
      };
      if (isHomeGoal) {
        homeGoals.push(scorerObj);
      } else {
        awayGoals.push(scorerObj);
      }
    });

    const homeGoalsHtml = homeGoals.length > 0 
      ? homeGoals.map(g => `<div class="scorer-item"><span>⚽ ${g.name}</span><span class="scorer-minute">${g.minute}'</span></div>`).join('')
      : `<span class="scorer-empty">ยังไม่มีผู้ทำประตู</span>`;

    const awayGoalsHtml = awayGoals.length > 0
      ? awayGoals.map(g => `<div class="scorer-item"><span>⚽ ${g.name}</span><span class="scorer-minute">${g.minute}'</span></div>`).join('')
      : `<span class="scorer-empty">ยังไม่มีผู้ทำประตู</span>`;

    const goalscorersHtml = `
      <div class="spotlight-goalscorers-box">
        <div class="spotlight-goalscorers-title">
          <span>⚽ ผู้ทำประตู (Goalscorers)</span>
        </div>
        <div class="spotlight-goalscorers-grid">
          <div class="scorers-col home">
            <div class="scorers-col-header">${match.homeTeam.shortName || match.homeTeam.name}</div>
            ${homeGoalsHtml}
          </div>
          <div class="scorers-col away">
            <div class="scorers-col-header">${match.awayTeam.shortName || match.awayTeam.name}</div>
            ${awayGoalsHtml}
          </div>
        </div>
      </div>
    `;

    const simControlsHtml = HubState.isLiveSimulation ? `
      <div class="spotlight-sim-controls">
        <div class="sim-controls-header">
          <span>🎮 แผงควบคุมทดสอบระบบ Live Score (Simulation Active)</span>
          <span style="font-size: 0.72rem; color: #93c5fd;">ทดสอบอัปเดตสกอร์และรายชื่อคนทำประตู</span>
        </div>
        <div class="sim-controls-buttons">
          <button type="button" class="sim-btn sim-btn-goal-chelsea" id="simGoalChelseaBtn" title="เพิ่มสกอร์และผู้ทำประตูเชลซี">
            ⚽ เชลซียิงเข้า (+1)
          </button>
          <button type="button" class="sim-btn sim-btn-goal-opp" id="simGoalOpponentBtn" title="เพิ่มสกอร์และผู้ทำประตูอาร์เซน่อล">
            ⚽ อาร์เซน่อลยิง (+1)
          </button>
          <button type="button" class="sim-btn" id="simPlusMinuteBtn" title="เลื่อนนาทีการแข่งขัน">
            ⏱️ +5 นาที
          </button>
          <button type="button" class="sim-btn" id="simToggleHtBtn" title="สลับพักครึ่ง/แข่งต่อ">
            ⏸️ สลับสถานะ (พักครึ่ง / แข่งต่อ)
          </button>
          <button type="button" class="sim-btn sim-btn-close" id="simStopTestBtn" title="ออกจากโหมดจำลอง">
            ⏹️ สิ้นสุดการทดสอบ
          </button>
        </div>
      </div>
    ` : '';

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

        ${goalscorersHtml}

        <div style="text-align: center; font-size: 0.82rem; color: #cbd5e1; margin-top: 0.6rem;">
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

        ${simControlsHtml}
      </div>
    `;

    // Bind simulation controls if simulation active
    if (HubState.isLiveSimulation) {
      const btnGoalChe = document.getElementById('simGoalChelseaBtn');
      if (btnGoalChe) {
        btnGoalChe.onclick = () => {
          if (!HubState.simulatedLiveMatch) return;
          const chelseaPool = ['Cole Palmer', 'N. Jackson', 'C. Nkunku', 'Enzo Fernández', 'Pedro Neto', 'N. Madueke', 'Jadon Sancho', 'Malo Gusto'];
          const scorer = chelseaPool[Math.floor(Math.random() * chelseaPool.length)];
          const curMin = Math.min(90, (HubState.simulatedLiveMatch.minute || 68) + 2);
          HubState.simulatedLiveMatch.minute = curMin;
          HubState.simulatedLiveMatch.score.fullTime.home = (HubState.simulatedLiveMatch.score.fullTime.home || 0) + 1;
          if (!HubState.simulatedLiveMatch.goals) HubState.simulatedLiveMatch.goals = [];
          HubState.simulatedLiveMatch.goals.push({ team: 'home', player: scorer, minute: curMin, type: 'regular' });
          renderLiveSpotlight(HubState.simulatedLiveMatch, true);
          renderMatchesTable();
        };
      }

      const btnGoalOpp = document.getElementById('simGoalOpponentBtn');
      if (btnGoalOpp) {
        btnGoalOpp.onclick = () => {
          if (!HubState.simulatedLiveMatch) return;
          const arsenalPool = ['B. Saka', 'Kai Havertz', 'G. Martinelli', 'Declan Rice', 'L. Trossard', 'M. Ødegaard'];
          const scorer = arsenalPool[Math.floor(Math.random() * arsenalPool.length)];
          const curMin = Math.min(90, (HubState.simulatedLiveMatch.minute || 68) + 2);
          HubState.simulatedLiveMatch.minute = curMin;
          HubState.simulatedLiveMatch.score.fullTime.away = (HubState.simulatedLiveMatch.score.fullTime.away || 0) + 1;
          if (!HubState.simulatedLiveMatch.goals) HubState.simulatedLiveMatch.goals = [];
          HubState.simulatedLiveMatch.goals.push({ team: 'away', player: scorer, minute: curMin, type: 'regular' });
          renderLiveSpotlight(HubState.simulatedLiveMatch, true);
          renderMatchesTable();
        };
      }

      const btnPlusMin = document.getElementById('simPlusMinuteBtn');
      if (btnPlusMin) {
        btnPlusMin.onclick = () => {
          if (!HubState.simulatedLiveMatch) return;
          HubState.simulatedLiveMatch.minute = Math.min(90, (HubState.simulatedLiveMatch.minute || 68) + 5);
          renderLiveSpotlight(HubState.simulatedLiveMatch, false);
          renderMatchesTable();
        };
      }

      const btnToggleHt = document.getElementById('simToggleHtBtn');
      if (btnToggleHt) {
        btnToggleHt.onclick = () => {
          if (!HubState.simulatedLiveMatch) return;
          HubState.simulatedLiveMatch.status = (HubState.simulatedLiveMatch.status === 'IN_PLAY') ? 'PAUSED' : 'IN_PLAY';
          renderLiveSpotlight(HubState.simulatedLiveMatch, false);
          renderMatchesTable();
        };
      }

      const btnStopTest = document.getElementById('simStopTestBtn');
      if (btnStopTest) {
        btnStopTest.onclick = toggleLiveDemo;
      }
    }

    // Bind manual refresh button
    const btnRefresh = document.getElementById('btnLiveManualRefresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        btnRefresh.textContent = '⏳ กำลังดึง...';
        btnRefresh.disabled = true;
        if (HubState.isLiveSimulation) {
          await new Promise(r => setTimeout(r, 400));
          HubState.liveSyncCountdown = 12;
          renderLiveSpotlight(HubState.simulatedLiveMatch, false);
        } else {
          await refreshLiveScoreData(match);
        }
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
        if (HubState.isLiveSimulation) {
          // In simulation mode, advance clock and trigger pulse
          if (HubState.simulatedLiveMatch && HubState.simulatedLiveMatch.status === 'IN_PLAY') {
            HubState.simulatedLiveMatch.minute = Math.min(90, (HubState.simulatedLiveMatch.minute || 68) + 1);
            renderLiveSpotlight(HubState.simulatedLiveMatch, false);
          }
        } else {
          await refreshLiveScoreData(match);
        }
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
        const squadData = await getChelseaMenSquad();
        HubState.squad = squadData.squad || [];
        if (squadData.coach) {
          HubState.coach = squadData.coach;
        }
      }

      // 2. Render Coach Profile (Xabi Alonso)
      if (coachContainer) {
        coachContainer.innerHTML = `
          <div class="coach-profile-card">
            <div class="coach-header-row">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="coach-avatar-badge" title="Xabi Alonso">
                  <img src="https://img.chelseafc.com/image/upload/f_auto,h_860,q_50/editorial/people/management/2026-27/Xabi_Alonso_2026-27_profile_avatar-removebg.png" alt="Xabi Alonso" class="coach-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                  <span class="coach-avatar-fallback" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%;">XA</span>
                </div>
                <div>
                  <div style="font-size: 0.78rem; color: #38bdf8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; display: flex; align-items: center; gap: 0.4rem;">
                    <span>👔</span>
                    <span>Manager / ผู้จัดการทีมชุดใหญ่</span>
                  </div>
                  <div style="font-size: 1.45rem; font-weight: 900; color: #ffffff; letter-spacing: 0.3px; line-height: 1.2; margin-top: 2px;">
                    Xabi Alonso
                  </div>
                </div>
              </div>

              <div class="coach-meta-badges">
                <div class="coach-meta-chip">
                  <span>🇪🇸</span>
                  <span><strong>สัญชาติ:</strong> ESP 'Spanish'</span>
                </div>
                <div class="coach-meta-chip">
                  <span>👔</span>
                  <span><strong>ตำแหน่ง:</strong> Manager</span>
                </div>
                <div class="coach-meta-chip">
                  <span>📅</span>
                  <span><strong>เริ่มคุมทีม:</strong> 1 July 2026 (4-year contract)</span>
                </div>
              </div>
            </div>

            <!-- Key Honours & Milestones -->
            <div class="coach-highlights-row">
              <span class="coach-trophy-tag">🏆 ไร้พ่ายประวัติศาสตร์ บุนเดสลีกา (2023/24)</span>
              <span class="coach-trophy-tag">🛡️ สถิติยุโรป ไม่แพ้ติดต่อกัน 51 นัด</span>
              <span class="coach-trophy-tag">🏆 DFB-Pokal & German Super Cup</span>
              <span class="coach-trophy-tag">🌍 แชมป์ฟุตบอลโลก 2010 & ยูโร 2008, 2012</span>
              <span class="coach-trophy-tag">⭐ แชมป์ยูฟ่า แชมเปียนส์ ลีก 2 สมัย</span>
            </div>

            <!-- Detailed Biography Box -->
            <div class="coach-bio-box">
              <div class="coach-bio-header" id="coachBioToggle">
                <div class="coach-bio-title">
                  <span>📖</span>
                  <span>ประวัติและบทสัมภาษณ์เปิดตัว (Official Biography)</span>
                </div>
                <button type="button" class="coach-bio-toggle-btn" id="coachBioToggleBtn">
                  ย่อ/ขยายเนื้อหา ▼
                </button>
              </div>
              <div class="coach-bio-content" id="coachBioContent">
                <p>
                  "One of the most respected figures in the modern game, Alonso arrived at Chelsea on a four‑year contract having already experienced coaching at the highest level of European football with Real Madrid and Bayer Leverkusen. He led the German club to the first league title in their history."
                </p>
                <p>
                  "His appointment at Chelsea reflects the club’s belief in his broad set of experiences, coaching quality and game model, leadership attributes, character and integrity, which were key to the decision to ask him to help lead the next phase of Chelsea’s journey."
                </p>
                <p>
                  "He is regarded not only as an outstanding football coach, but also as a proven leader and partner across a number of areas essential to the demands of driving the team."
                </p>
                <p>
                  "At Bayer Leverkusen during the historic 2023/24 Bundesliga title-winning season, Alonso’s team were unbeaten throughout that campaign, contributing to setting a new European record for any club of 51 competitive matches without defeat in all competitions."
                </p>
                <p>
                  "In the same season they won the DFB-Pokal, the main knockout cup competition in Germany, and that was followed up by the German Super Cup. Leverkusen were also runners-up in the UEFA Europa League. Naturally, Alonso won a host of individual manager honours that year."
                </p>
                <p>
                  "As a player, Alonso was part of Spain’s golden generation that won the 2010 World Cup and two European Championships, in 2008 and 2012."
                </p>
                <p>
                  "At club level, he won the Champions League with Liverpool and Real Madrid and domestic league titles with Real and Bayern Munich, as well as cup competitions with all three clubs."
                </p>
              </div>
            </div>
          </div>
        `;

        // Bind collapsible toggle listener
        const toggleBtn = document.getElementById('coachBioToggleBtn');
        const toggleHeader = document.getElementById('coachBioToggle');
        const bioContent = document.getElementById('coachBioContent');
        if (toggleBtn && bioContent) {
          const handleToggle = () => {
            if (bioContent.style.display === 'none') {
              bioContent.style.display = 'flex';
              toggleBtn.textContent = 'ย่อเนื้อหา ▲';
            } else {
              bioContent.style.display = 'none';
              toggleBtn.textContent = 'ขยายอ่านทั้งหมด ▼';
            }
          };
          toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); handleToggle(); });
          if (toggleHeader) toggleHeader.addEventListener('click', handleToggle);
        }
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

    // 6. Standings Gender Toggle Buttons & Arrows
    const toggleStandingsGender = () => {
      const next = (HubState.standingsGender === 'men') ? 'women' : 'men';
      loadStandings(next);
    };

    const prevBtn = document.getElementById('standingsPrevBtn');
    if (prevBtn) prevBtn.addEventListener('click', toggleStandingsGender);

    const nextBtn = document.getElementById('standingsNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', toggleStandingsGender);

    const menBtn = document.getElementById('standingsMenBtn');
    if (menBtn) menBtn.addEventListener('click', () => loadStandings('men'));

    const womenBtn = document.getElementById('standingsWomenBtn');
    if (womenBtn) womenBtn.addEventListener('click', () => loadStandings('women'));

    const refreshDashboardBtn = document.getElementById('btnRefreshDashboard');
    if (refreshDashboardBtn) {
      refreshDashboardBtn.addEventListener('click', () => {
        loadDashboardData();
      });
    }

    // Timeline Sort Header Toggle
    const thMatchDate = document.getElementById('thMatchDate');
    if (thMatchDate) {
      thMatchDate.addEventListener('click', () => {
        HubState.matchesFilter.sortOrder = (HubState.matchesFilter.sortOrder === 'asc') ? 'desc' : 'asc';
        const badge = document.getElementById('timelineSortBadge');
        if (badge) {
          badge.textContent = HubState.matchesFilter.sortOrder === 'asc' ? 'ไทม์ไลน์ (เก่า→ใหม่) ⬆' : 'ไทม์ไลน์ (ใหม่→เก่า) ⬇';
        }
        renderMatchesTable();
      });
    }

    // 7. Player Stats Modal Close Listeners
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

    // Live Demo Simulation Toggle
    const btnToggleLiveDemo = document.getElementById('btnToggleLiveDemo');
    if (btnToggleLiveDemo) {
      btnToggleLiveDemo.addEventListener('click', toggleLiveDemo);
    }

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
    loadStandings,
    renderManagerTimeline,
    renderH2HAnalysis,
    calculateManagerStats,
    HubState
  };

})();
