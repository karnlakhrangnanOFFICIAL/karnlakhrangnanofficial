import fs from 'fs';
import path from 'path';

const FIXTURES_PATH = path.join(process.cwd(), 'data', 'fixtures.json');
const WOMEN_FIXTURES_PATH = path.join(process.cwd(), 'data', 'fixtures-women.json');

function readJsonArray(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`[api/matches] Failed to read ${filePath}:`, err.message);
    return [];
  }
}

function writeJsonArray(filePath, data, pretty = false) {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  fs.writeFileSync(filePath, content, 'utf8');
}

function getSeasonFromDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.split('-');
  if (parts.length < 2) return '';
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month)) return '';
  const startYear = month >= 7 ? year : year - 1;
  const endShort = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}/${endShort}`;
}

function normalizeTeamType(match) {
  if (!match) return 'M';
  if (match.team_type === 'W' || match.team_type === 'women') return 'W';
  if (match.team_type === 'M' || match.team_type === 'men') return 'M';
  const idStr = String(match.id || '').toLowerCase();
  const home = String(match.home_team || '').toLowerCase();
  const away = String(match.away_team || '').toLowerCase();
  const comp = String(match.competition || '').toLowerCase();
  if (idStr.startsWith('w') || home.includes('women') || away.includes('women') || comp.includes('women') || comp.includes('wsl')) {
    return 'W';
  }
  return 'M';
}

function normalizeCompSlug(comp) {
  const c = String(comp || '').toLowerCase();
  if (!c) return 'other';
  if (c.includes('premier-league') || c.includes('premier league')) return 'premier-league';
  if (c.includes('wsl') || c.includes("women's super league")) return 'wsl';
  if (c.includes('uwcl') || (c.includes('champions league') && c.includes('women'))) return 'uwcl';
  if (c.includes('champions league') || c === 'ucl' || c === 'cl') return 'champions-league';
  if (c.includes('fa cup') || c.includes('fa-cup')) return 'fa-cup';
  if (c.includes('carabao') || c.includes('efl') || c.includes('league cup') || c.includes('league-cup')) return 'league-cup';
  if (c.includes('friendly')) return 'friendly';
  if (c.includes('club-world-cup') || c.includes('club world cup')) return 'club-world-cup';
  return c.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getMergedMatches() {
  const mainList = readJsonArray(FIXTURES_PATH);
  const womenList = readJsonArray(WOMEN_FIXTURES_PATH);

  const byId = new Map();
  mainList.forEach((m) => {
    if (!m || m.id == null) return;
    byId.set(String(m.id), { ...m, team_type: normalizeTeamType(m) });
  });

  womenList.forEach((wm) => {
    if (!wm || wm.id == null) return;
    const key = String(wm.id);
    const existing = byId.get(key) || {};
    byId.set(key, { ...existing, ...wm, team_type: 'W' });
  });

  return Array.from(byId.values()).sort((a, b) => {
    const da = String(a.date || '');
    const db = String(b.date || '');
    if (db !== da) return db.localeCompare(da);
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
}

function generateNextId(allMatches, teamType) {
  const prefix = teamType === 'W' ? 'w' : 'm';
  let maxNum = 0;
  allMatches.forEach((m) => {
    const idStr = String(m.id || '');
    if (idStr.startsWith(prefix)) {
      const n = parseInt(idStr.slice(1), 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
  });
  return `${prefix}${maxNum + 1}`;
}

function sanitizeMatchPayload(body, existingId) {
  const teamType = body.team_type === 'W' ? 'W' : 'M';
  const status = ['upcoming', 'live', 'halftime', 'completed'].includes(body.status)
    ? body.status
    : 'upcoming';

  const isCompletedOrLive = status === 'completed' || status === 'live' || status === 'halftime';
  const homeScore =
    isCompletedOrLive && body.home_score !== null && body.home_score !== undefined && body.home_score !== ''
      ? Number(body.home_score)
      : null;
  const awayScore =
    isCompletedOrLive && body.away_score !== null && body.away_score !== undefined && body.away_score !== ''
      ? Number(body.away_score)
      : null;

  const goals = Array.isArray(body.goals)
    ? body.goals
        .filter((g) => g && g.player && String(g.player).trim())
        .map((g) => ({
          team: g.team === 'away' ? 'away' : 'home',
          player: String(g.player).trim(),
          minute: g.minute !== undefined && g.minute !== null && String(g.minute).trim() !== '' ? (isNaN(Number(g.minute)) ? String(g.minute).trim() : Number(g.minute)) : '',
          ...(g.penalty ? { penalty: true, detail: 'Penalty' } : {}),
          ...(g.own_goal ? { own_goal: true, detail: 'Own Goal' } : {}),
        }))
    : [];

  const events = Array.isArray(body.events) && body.events.length > 0
    ? body.events
    : goals.map((g) => ({
        type: 'goal',
        player: g.player,
        minute: g.minute,
        team: g.team,
        ...(g.penalty ? { detail: 'Penalty' } : {}),
        ...(g.own_goal ? { detail: 'Own Goal' } : {}),
      }));

  const channels = Array.isArray(body.channels)
    ? body.channels
        .filter((c) => c && (typeof c === 'string' ? c.trim() : c.name && String(c.name).trim()))
        .map((c) =>
          typeof c === 'string'
            ? { platform: c.trim(), name: c.trim(), logo: '' }
            : {
                platform: String(c.platform || c.name || '').trim(),
                name: String(c.name || c.platform || '').trim(),
                logo: String(c.logo || '').trim(),
              }
        )
    : [];

  const homeTeam = String(body.home_team || '').trim();
  const awayTeam = String(body.away_team || '').trim();
  const isChelseaHome = homeTeam.toLowerCase().includes('chelsea');
  const isChelseaAway = awayTeam.toLowerCase().includes('chelsea');

  const matchObj = {
    id: existingId || String(body.id || '').trim(),
    date: String(body.date || '').trim(),
    time: String(body.time || body.time_th || 'TBC').trim() || 'TBC',
    time_th: String(body.time_th || body.time || 'TBC').trim() || 'TBC',
    ...(body.time_uk ? { time_uk: String(body.time_uk).trim() } : {}),
    competition: String(body.competition || '').trim(),
    competition_name: String(body.competition_name || body.competition || '').trim(),
    competition_logo: String(body.competition_logo || '').trim(),
    home_team: homeTeam,
    home_logo: String(body.home_logo || 'assets/images/placeholder-team.svg').trim(),
    away_team: awayTeam,
    away_logo: String(body.away_logo || 'assets/images/placeholder-team.svg').trim(),
    venue: String(body.venue || '').trim(),
    ha: body.ha === 'H' || body.ha === 'A' ? body.ha : isChelseaHome ? 'H' : isChelseaAway ? 'A' : '',
    channels,
    status,
    home_score: homeScore,
    away_score: awayScore,
    goals,
    events,
    team_type: teamType,
  };

  if (body.round) matchObj.round = String(body.round).trim();
  if (body.referee) matchObj.referee = String(body.referee).trim();
  if (body.attendance !== undefined && body.attendance !== null && body.attendance !== '') {
    matchObj.attendance = Number(body.attendance);
  }
  if (body.formation) matchObj.formation = String(body.formation).trim();
  if (body.captain) matchObj.captain = String(body.captain).trim();
  if (body.poss !== undefined && body.poss !== null && body.poss !== '') {
    matchObj.poss = Number(body.poss);
  }
  if (body.xg !== undefined && body.xg !== null && body.xg !== '') {
    matchObj.xg = Number(body.xg);
  }
  if (body.xga !== undefined && body.xga !== null && body.xga !== '') {
    matchObj.xga = Number(body.xga);
  }
  if (body.notes) matchObj.notes = String(body.notes).trim();
  if (Array.isArray(body.stats) && body.stats.length > 0) matchObj.stats = body.stats;
  if (body.officials && typeof body.officials === 'object') matchObj.officials = body.officials;
  if (body.lineups && typeof body.lineups === 'object') {
    matchObj.lineups = body.lineups;
  } else if (body.lineups === null) {
    matchObj.lineups = null;
  }

  return matchObj;
}

function getChelseaOutcome(match) {
  if (match.status !== 'completed' || match.home_score === null || match.away_score === null) return '';
  const hs = Number(match.home_score);
  const as = Number(match.away_score);
  if (isNaN(hs) || isNaN(as)) return '';
  const homeChelsea = String(match.home_team || '').toLowerCase().includes('chelsea');
  const awayChelsea = String(match.away_team || '').toLowerCase().includes('chelsea');
  if (!homeChelsea && !awayChelsea) return '';
  const chelseaScore = homeChelsea ? hs : as;
  const oppScore = homeChelsea ? as : hs;
  if (chelseaScore > oppScore) return 'W';
  if (chelseaScore < oppScore) return 'L';
  return 'D';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const allMatches = getMergedMatches();
      const {
        team = 'all',
        status = 'all',
        competition = 'all',
        season = '2026/27',
        ha = 'all',
        outcome = 'all',
        month = 'all',
        dateFrom = '',
        dateTo = '',
        search = '',
        sort = 'date_desc',
        limit = '250',
      } = req.query || {};

      const seasonsSet = new Set();
      const competitionsMap = new Map();

      allMatches.forEach((m) => {
        const s = getSeasonFromDate(m.date);
        if (s) seasonsSet.add(s);
        const slug = normalizeCompSlug(m.competition_name || m.competition);
        if (slug && !competitionsMap.has(slug)) {
          competitionsMap.set(slug, {
            slug,
            label: m.competition || slug,
            logo: m.competition_logo || '',
          });
        }
      });

      const filtered = allMatches.filter((m) => {
        if (team !== 'all' && m.team_type !== team) return false;
        if (status !== 'all') {
          if (status === 'live') {
            if (m.status !== 'live' && m.status !== 'halftime') return false;
          } else if (m.status !== status) {
            return false;
          }
        }
        if (season !== 'all') {
          const mSeason = getSeasonFromDate(m.date);
          if (mSeason !== season) return false;
        }
        if (competition !== 'all') {
          const slug = normalizeCompSlug(m.competition_name || m.competition);
          if (slug !== competition && m.competition !== competition) return false;
        }
        if (ha !== 'all') {
          const isHome = String(m.home_team || '').toLowerCase().includes('chelsea');
          const mHa = m.ha || (isHome ? 'H' : 'A');
          if (mHa !== ha) return false;
        }
        if (outcome !== 'all') {
          if (getChelseaOutcome(m) !== outcome) return false;
        }
        if (month !== 'all' && m.date) {
          const mMonth = m.date.slice(5, 7);
          if (mMonth !== month) return false;
        }
        if (dateFrom && m.date && m.date < dateFrom) return false;
        if (dateTo && m.date && m.date > dateTo) return false;
        if (search && String(search).trim()) {
          const q = String(search).trim().toLowerCase();
          const goalPlayers = (m.goals || []).map((g) => g.player).join(' ');
          const haystack = [
            m.id,
            m.home_team,
            m.away_team,
            m.competition,
            m.venue,
            m.round,
            m.referee,
            goalPlayers,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });

      if (sort === 'date_asc') {
        filtered.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
      } else {
        filtered.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      }

      const maxLimit = Math.min(Math.max(parseInt(limit, 10) || 250, 1), 1500);
      const items = filtered.slice(0, maxLimit);

      const summary = {
        total: filtered.length,
        upcoming: filtered.filter((m) => m.status === 'upcoming').length,
        completed: filtered.filter((m) => m.status === 'completed').length,
        live: filtered.filter((m) => m.status === 'live' || m.status === 'halftime').length,
        men: filtered.filter((m) => m.team_type === 'M').length,
        women: filtered.filter((m) => m.team_type === 'W').length,
      };

      const seasons = Array.from(seasonsSet).sort((a, b) => b.localeCompare(a));
      const competitions = Array.from(competitionsMap.values());

      return res.status(200).json({
        ok: true,
        matches: items,
        summary,
        meta: {
          totalDatabaseCount: allMatches.length,
          seasons,
          competitions,
        },
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    if (req.method === 'POST') {
      if (!body.date || !body.home_team || !body.away_team || !body.competition) {
        return res.status(400).json({
          ok: false,
          error: 'Missing required fields: date, home_team, away_team, competition',
        });
      }

      const mainList = readJsonArray(FIXTURES_PATH);
      const womenList = readJsonArray(WOMEN_FIXTURES_PATH);
      const merged = getMergedMatches();

      let targetId = String(body.id || '').trim();
      if (!targetId) {
        targetId = generateNextId(merged, body.team_type === 'W' ? 'W' : 'M');
      }

      const newMatch = sanitizeMatchPayload(body, targetId);

      // Avoid duplicate ID by replacing if same ID exists, or prepending/inserting sorted
      const mainIdx = mainList.findIndex((m) => String(m.id) === targetId);
      if (mainIdx >= 0) {
        mainList[mainIdx] = { ...mainList[mainIdx], ...newMatch };
      } else {
        mainList.push(newMatch);
        mainList.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      }

      try {
        writeJsonArray(FIXTURES_PATH, mainList, false);
        if (newMatch.team_type === 'W') {
          const wIdx = womenList.findIndex((m) => String(m.id) === targetId);
          if (wIdx >= 0) {
            womenList[wIdx] = { ...womenList[wIdx], ...newMatch };
          } else {
            womenList.push(newMatch);
            womenList.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
          }
          writeJsonArray(WOMEN_FIXTURES_PATH, womenList, true);
        }
        return res.status(201).json({ ok: true, match: newMatch, persisted: 'disk' });
      } catch (writeErr) {
        if (writeErr.code === 'EROFS' || writeErr.code === 'EACCES') {
          return res.status(200).json({
            ok: false,
            readOnly: true,
            match: newMatch,
            error: 'Server filesystem is read-only; saved in browser draft mode.',
          });
        }
        throw writeErr;
      }
    }

    if (req.method === 'PUT') {
      const paramId = req.params?.id || req.query?.id || body.id;
      if (!paramId) {
        return res.status(400).json({ ok: false, error: 'Missing match ID' });
      }

      const targetId = String(paramId);
      const mainList = readJsonArray(FIXTURES_PATH);
      const womenList = readJsonArray(WOMEN_FIXTURES_PATH);

      const mainIdx = mainList.findIndex((m) => String(m.id) === targetId);
      const womenIdx = womenList.findIndex((m) => String(m.id) === targetId);
      const existing = (mainIdx >= 0 ? mainList[mainIdx] : null) || (womenIdx >= 0 ? womenList[womenIdx] : null) || {};

      const updatedMatch = {
        ...existing,
        ...sanitizeMatchPayload({ ...existing, ...body }, targetId),
      };
      if (body.lineups === null) {
        delete updatedMatch.lineups;
      }

      if (mainIdx >= 0) {
        mainList[mainIdx] = updatedMatch;
      } else {
        mainList.push(updatedMatch);
        mainList.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      }

      try {
        writeJsonArray(FIXTURES_PATH, mainList, false);
        if (updatedMatch.team_type === 'W' || womenIdx >= 0) {
          if (womenIdx >= 0) {
            womenList[womenIdx] = updatedMatch;
          } else {
            womenList.push(updatedMatch);
            womenList.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
          }
          writeJsonArray(WOMEN_FIXTURES_PATH, womenList, true);
        }
        return res.status(200).json({ ok: true, match: updatedMatch, persisted: 'disk' });
      } catch (writeErr) {
        if (writeErr.code === 'EROFS' || writeErr.code === 'EACCES') {
          return res.status(200).json({
            ok: false,
            readOnly: true,
            match: updatedMatch,
            error: 'Server filesystem is read-only; saved in browser draft mode.',
          });
        }
        throw writeErr;
      }
    }

    if (req.method === 'DELETE') {
      const paramId = req.params?.id || req.query?.id || body.id;
      if (!paramId) {
        return res.status(400).json({ ok: false, error: 'Missing match ID' });
      }
      const targetId = String(paramId);
      const mainList = readJsonArray(FIXTURES_PATH).filter((m) => String(m.id) !== targetId);
      const womenList = readJsonArray(WOMEN_FIXTURES_PATH);
      const nextWomenList = womenList.filter((m) => String(m.id) !== targetId);

      try {
        writeJsonArray(FIXTURES_PATH, mainList, false);
        if (nextWomenList.length !== womenList.length) {
          writeJsonArray(WOMEN_FIXTURES_PATH, nextWomenList, true);
        }
        return res.status(200).json({ ok: true, deletedId: targetId, persisted: 'disk' });
      } catch (writeErr) {
        if (writeErr.code === 'EROFS' || writeErr.code === 'EACCES') {
          return res.status(200).json({
            ok: false,
            readOnly: true,
            deletedId: targetId,
            error: 'Server filesystem is read-only.',
          });
        }
        throw writeErr;
      }
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/matches] Error:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Internal Server Error' });
  }
}
