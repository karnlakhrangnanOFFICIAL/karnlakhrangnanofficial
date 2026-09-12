import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PL_HEADERS = {
  'Origin': 'https://www.premierleague.com',
  'Referer': 'https://www.premierleague.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

export default async function handler(req, res) {
  try {
    const rawId = req.query?.matchId || req.query?.id || '2645227';
    // If id is m10, map to 2645227
    const plMatchId = (rawId === 'm10') ? '2645227' : rawId;

    // 1. Fetch match overview
    const matchUrl = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v1/matches/${plMatchId}`;
    const statsUrl = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v1/matches/${plMatchId}/stats`;
    const commBaseUrl = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v1/matches/${plMatchId}/commentary`;

    const [matchRes, statsRes] = await Promise.all([
      fetch(matchUrl, { headers: PL_HEADERS }),
      fetch(statsUrl, { headers: PL_HEADERS }).catch(() => null)
    ]);

    if (!matchRes.ok) {
      return res.status(502).json({ success: false, error: `Premier League API returned status ${matchRes.status}` });
    }

    const matchData = await matchRes.json();
    let statsData = null;
    if (statsRes && statsRes.ok) {
      try {
        statsData = await statsRes.json();
      } catch (e) {}
    }

    // 2. Fetch commentary with cursor pagination (up to 10 pages)
    let rawComments = [];
    let nextUrl = commBaseUrl;
    let page = 0;
    while (nextUrl && page < 10) {
      page++;
      try {
        const commRes = await fetch(nextUrl, { headers: PL_HEADERS });
        if (!commRes.ok) break;
        const commJson = await commRes.json();
        if (Array.isArray(commJson.data) && commJson.data.length > 0) {
          rawComments.push(...commJson.data);
        }
        if (commJson.pagination?._next) {
          nextUrl = `${commBaseUrl}?_next=${encodeURIComponent(commJson.pagination._next)}`;
        } else {
          nextUrl = null;
        }
      } catch (err) {
        break;
      }
    }

    // Filter English comments (exclude Arabic & Spanish)
    const englishComments = [];
    const seenComments = new Set();

    for (const c of rawComments) {
      if (!c.comment || c.type === 'lineup') continue;
      // Skip Arabic script
      if (/[\u0600-\u06FF]/.test(c.comment)) continue;
      // Skip obvious Spanish starters & phrases
      if (
        c.comment.startsWith('Falta ') ||
        c.comment.startsWith('Remate ') ||
        c.comment.includes('cometido por') ||
        c.comment.includes('cometida por') ||
        c.comment.startsWith('¡Gooooool') ||
        c.comment.startsWith('Alineaciones') ||
        c.comment.startsWith('Empieza ') ||
        c.comment.includes('ha recibido una falta') ||
        c.comment.includes('fuera de juego') ||
        c.comment.includes('despeje') ||
        c.comment.includes('asistencia de') ||
        c.comment.includes('saque de esquina') ||
        c.comment.includes('al larguero') ||
        c.comment.includes('mano de') ||
        c.comment.includes('parada') ||
        c.comment.includes('tarjeta amarilla') ||
        c.comment.includes('tarjeta roja')
      ) {
        continue;
      }

      const key = `${c.time || ''}_${c.comment}`;
      if (seenComments.has(key)) continue;
      seenComments.add(key);

      englishComments.push(c);
    }

    // Sort commentary chronologically or reverse
    // We parse events and goals
    const goals = [];
    const events = [];
    const liveCommentary = [];

    englishComments.forEach(c => {
      const timeStr = c.time || (c.clock ? `${c.clock}'` : '');
      const minuteNum = parseInt(timeStr) || 0;
      const commentText = c.comment || '';
      const type = (c.type || '').toLowerCase();

      let category = 'general';
      let isKey = false;
      let team = 'home';
      if (commentText.toLowerCase().includes('hull city') || commentText.toLowerCase().includes('(hull)')) {
        team = 'away';
      }

      // Check Goal
      if (type === 'goal' || commentText.toLowerCase().startsWith('goal!')) {
        category = 'goal_var';
        isKey = true;

        // Parse goal info: Goal! Chelsea 1, Hull City 0. Morgan Rogers (Chelsea) left footed shot... Assisted by João Pedro
        const goalScorerMatch = commentText.match(/Goal!\s*[^.]*\.\s*([^(]+)\s*\(([^)]+)\)/i);
        const assistMatch = commentText.match(/Assisted by\s+([^.]+?)(?:\s+following|\.|$)/i);
        const scoreMatch = commentText.match(/Chelsea\s*(\d+)\s*,\s*Hull(?:\s*City)?\s*(\d+)/i);

        const scorerName = goalScorerMatch ? goalScorerMatch[1].trim() : 'Player';
        const teamScoring = goalScorerMatch && goalScorerMatch[2].toLowerCase().includes('hull') ? 'away' : 'home';
        const assistName = assistMatch ? assistMatch[1].trim() : null;

        goals.push({
          minute: minuteNum || 1,
          player: scorerName,
          assist: assistName,
          team: teamScoring,
          score: scoreMatch ? `${scoreMatch[1]}-${scoreMatch[2]}` : `${matchData.homeTeam?.score || 1}-${matchData.awayTeam?.score || 0}`
        });

        events.push({
          minute: minuteNum || 1,
          type: 'goal',
          team: teamScoring,
          player: scorerName,
          assist: assistName,
          detail: commentText
        });
      }
      // Check Yellow Card
      else if (type.includes('card') || type.includes('yellow') || commentText.toLowerCase().includes('is shown the yellow card')) {
        category = 'card';
        isKey = true;
        const playerMatch = commentText.match(/([^(]+)\s*\(([^)]+)\)\s*is shown the yellow card/i);
        const cardPlayer = playerMatch ? playerMatch[1].trim() : 'Player';
        const cardTeam = playerMatch && playerMatch[2].toLowerCase().includes('hull') ? 'away' : 'home';

        events.push({
          minute: minuteNum,
          type: 'yellow_card',
          team: cardTeam,
          player: cardPlayer,
          detail: commentText
        });
      }
      // Check Red Card
      else if (type.includes('red') || commentText.toLowerCase().includes('is shown the red card')) {
        category = 'card';
        isKey = true;
        const playerMatch = commentText.match(/([^(]+)\s*\(([^)]+)\)\s*is shown the red card/i);
        const cardPlayer = playerMatch ? playerMatch[1].trim() : 'Player';
        const cardTeam = playerMatch && playerMatch[2].toLowerCase().includes('hull') ? 'away' : 'home';

        events.push({
          minute: minuteNum,
          type: 'red_card',
          team: cardTeam,
          player: cardPlayer,
          detail: commentText
        });
      }
      // Check Substitution
      else if (type.includes('sub') || commentText.toLowerCase().includes('substitution,')) {
        category = 'sub';
        isKey = true;
        // Substitution, Chelsea. Danny Welbeck replaces João Pedro.
        const subMatch = commentText.match(/Substitution,\s*([^.]+)\.\s*([^.]+?)\s+replaces\s+([^.]+)/i);
        if (subMatch) {
          const subTeam = subMatch[1].toLowerCase().includes('hull') ? 'away' : 'home';
          events.push({
            minute: minuteNum,
            type: 'substitution',
            team: subTeam,
            player: subMatch[2].trim(),
            player_out: subMatch[3].trim()
          });
        }
      }
      // Check VAR
      else if (commentText.toLowerCase().includes('var') || type.includes('var')) {
        category = 'goal_var';
        isKey = true;
      }
      // Check attempts / saves
      else if (type.includes('attempt') || type.includes('save') || type.includes('corner') || type.includes('post')) {
        category = 'key';
        isKey = true;
      }

      liveCommentary.push({
        time: timeStr ? `${timeStr}` : `${c.clock || ''}'`,
        type: type || 'comment',
        text: commentText,
        team: team,
        category: category,
        isKey: isKey,
        timestamp: c.timestamp || ''
      });
    });

    // 3. Process Official Stats
    let formattedStats = [];
    if (statsData && Array.isArray(statsData) && statsData.length >= 2) {
      const hs = statsData[0]?.stats || {};
      const as = statsData[1]?.stats || {};

      const safeNum = (v) => Number(v || 0);

      const homePass = safeNum(hs.totalPass);
      const awayPass = safeNum(as.totalPass);
      const homePassAcc = homePass > 0 ? Math.round((safeNum(hs.accuratePass) / homePass) * 1000) / 10 : 0;
      const awayPassAcc = awayPass > 0 ? Math.round((safeNum(as.accuratePass) / awayPass) * 1000) / 10 : 0;

      formattedStats = [
        { name: 'การครองบอล (Possession)', home: safeNum(hs.possessionPercentage), away: safeNum(as.possessionPercentage), isPercentage: true },
        { name: 'โอกาสทำประตูที่คาดหวัง (Expected Goals - xG)', home: safeNum(hs.expectedGoals), away: safeNum(as.expectedGoals), isPercentage: false },
        { name: 'โอกาสยิงทั้งหมด (Total Shots)', home: safeNum(hs.totalScoringAtt), away: safeNum(as.totalScoringAtt), isPercentage: false },
        { name: 'ยิงตรงกรอบ (Shots on Target)', home: safeNum(hs.ontargetScoringAtt), away: safeNum(as.ontargetScoringAtt), isPercentage: false },
        { name: 'ยิงหลุดกรอบ (Shots off Target)', home: Math.max(0, safeNum(hs.totalScoringAtt) - safeNum(hs.ontargetScoringAtt) - safeNum(hs.outfielderBlock)), away: Math.max(0, safeNum(as.totalScoringAtt) - safeNum(as.ontargetScoringAtt) - safeNum(as.outfielderBlock)), isPercentage: false },
        { name: 'ยิงติดบล็อก (Blocked Shots)', home: safeNum(hs.outfielderBlock), away: safeNum(as.outfielderBlock), isPercentage: false },
        { name: 'ยิงในกรอบเขตโทษ (Shots Inside Box)', home: safeNum(hs.attemptsIbox), away: safeNum(as.attemptsIbox), isPercentage: false },
        { name: 'ยิงนอกกรอบเขตโทษ (Shots Outside Box)', home: Math.max(0, safeNum(hs.totalScoringAtt) - safeNum(hs.attemptsIbox)), away: Math.max(0, safeNum(as.totalScoringAtt) - safeNum(as.attemptsIbox)), isPercentage: false },
        { name: 'ความแม่นยำในการส่งบอล (Passing Accuracy)', home: homePassAcc, away: awayPassAcc, isPercentage: true },
        { name: 'การส่งบอลทั้งหมด (Total Passes)', home: homePass, away: awayPass, isPercentage: false },
        { name: 'ส่งบอลสำเร็จ (Accurate Passes)', home: safeNum(hs.accuratePass), away: safeNum(as.accuratePass), isPercentage: false },
        { name: 'สัมผัสบอลทั้งหมด (Touches)', home: safeNum(hs.touches), away: safeNum(as.touches), isPercentage: false },
        { name: 'สัมผัสบอลในกรอบคู่แข่ง (Touches in Opp Box)', home: safeNum(hs.touchesInOppBox), away: safeNum(as.touchesInOppBox), isPercentage: false },
        { name: 'โอกาสทองที่สร้างได้ (Big Chances Created)', home: safeNum(hs.bigChanceCreated), away: safeNum(as.bigChanceCreated), isPercentage: false },
        { name: 'เตะมุม (Corners)', home: safeNum(hs.wonCorners || hs.lostCorners), away: safeNum(as.wonCorners || as.lostCorners), isPercentage: false },
        { name: 'ล้ำหน้า (Offsides)', home: safeNum(hs.totalOffside), away: safeNum(as.totalOffside), isPercentage: false },
        { name: 'เข้าปะทะสำเร็จ (Tackles)', home: safeNum(hs.totalTackle), away: safeNum(as.totalTackle), isPercentage: false },
        { name: 'เคลียร์บอล (Clearances)', home: safeNum(hs.totalClearance), away: safeNum(as.totalClearance), isPercentage: false },
        { name: 'ตัดบอล (Interceptions)', home: safeNum(hs.interception), away: safeNum(as.interception), isPercentage: false },
        { name: 'ชนะการดวลกลางอากาศ (Aerial Duels Won)', home: safeNum(hs.aerialWon), away: safeNum(as.aerialWon), isPercentage: false },
        { name: 'เซฟของผู้รักษาประตู (Saves)', home: safeNum(hs.saves), away: safeNum(as.saves), isPercentage: false },
        { name: 'ทำฟาวล์ (Fouls Conceded)', home: safeNum(hs.fkFoulLost), away: safeNum(as.fkFoulLost), isPercentage: false },
        { name: 'ใบเหลือง (Yellow Cards)', home: safeNum(hs.yellowCard), away: safeNum(as.yellowCard), isPercentage: false },
        { name: 'ใบแดง (Red Cards)', home: safeNum(hs.redCard), away: safeNum(as.redCard), isPercentage: false }
      ];
    }

    // Determine status
    let matchStatus = 'live';
    const period = matchData.period || 'FirstHalf';
    if (period === 'FullTime') matchStatus = 'completed';
    else if (period === 'PreMatch') matchStatus = 'upcoming';
    else if (period === 'HalfTime') matchStatus = 'halftime';
    else matchStatus = 'live';

    // 4. Update data/fixtures.json for persistence
    const fixturesPath = path.join(__dirname, '..', 'data', 'fixtures.json');
    let fixtures = [];
    try {
      fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
    } catch (e) {}

    const mIdx = fixtures.findIndex(m => m.id === 'm10' || m.pl_match_id === plMatchId);
    let targetMatch = null;

    if (mIdx !== -1) {
      targetMatch = fixtures[mIdx];
      targetMatch.pl_match_id = plMatchId;
      targetMatch.status = matchStatus;
      targetMatch.period = period;
      targetMatch.clock = matchData.clock ? `${matchData.clock}'` : '';
      targetMatch.home_score = matchData.homeTeam?.score ?? 0;
      targetMatch.away_score = matchData.awayTeam?.score ?? 0;

      if (goals.length > 0) {
        targetMatch.goals = goals;
      }
      if (events.length > 0) {
        targetMatch.events = events;
      }
      if (formattedStats.length > 0) {
        targetMatch.stats = formattedStats;
      }
      if (liveCommentary.length > 0) {
        targetMatch.live_commentary = liveCommentary;
      }
      targetMatch.last_synced = new Date().toISOString();

      fs.writeFileSync(fixturesPath, JSON.stringify(fixtures, null, 2), 'utf8');
    }

    res.json({
      success: true,
      matchId: plMatchId,
      clock: matchData.clock ? `${matchData.clock}'` : '',
      period: period,
      status: matchStatus,
      score: {
        home: matchData.homeTeam?.score ?? 0,
        away: matchData.awayTeam?.score ?? 0
      },
      goals,
      events,
      stats: formattedStats,
      live_commentary: liveCommentary,
      lastUpdated: new Date().toISOString(),
      match: targetMatch || null
    });

  } catch (error) {
    console.error('Error in api/pl-match handler:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
