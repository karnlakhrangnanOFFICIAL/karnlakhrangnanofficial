import fs from "fs";
import path from "path";

const PL_HEADERS = {
  Origin: "https://www.premierleague.com",
  Referer: "https://www.premierleague.com/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

function getLocalFixtureFallback(plMatchId) {
  try {
    const fixturesPath = path.join(process.cwd(), "data", "fixtures.json");
    if (fs.existsSync(fixturesPath)) {
      const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
      const match = fixtures.find((m) => m.id === "m10" || m.pl_match_id === plMatchId) || fixtures.find(m => m.id === "m10");
      if (match) {
        return {
          success: true,
          matchId: plMatchId,
          clock: match.clock || "FT",
          period: match.period || "FullTime",
          status: match.status || "completed",
          score: {
            home: match.home_score ?? 2,
            away: match.away_score ?? 1,
          },
          goals: match.goals || [],
          events: match.events || [],
          stats: match.stats || [],
          live_commentary: match.live_commentary || [],
          lastUpdated: new Date().toISOString(),
          match: match,
        };
      }
    }
  } catch (e) {
    console.warn("Could not load local fixture fallback for pl-match:", e.message);
  }

  return {
    success: true,
    matchId: plMatchId,
    clock: "FT",
    period: "FullTime",
    status: "completed",
    score: { home: 2, away: 1 },
    goals: [],
    events: [],
    stats: [],
    live_commentary: [],
    lastUpdated: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Auth-Token");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const rawId = req.query?.matchId || req.query?.id || "2645227";
  const plMatchId = rawId === "m10" ? "2645227" : rawId;

  try {
    const matchUrl = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v1/matches/${plMatchId}`;
    const statsUrl = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v1/matches/${plMatchId}/stats`;
    const commBaseUrl = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v1/matches/${plMatchId}/commentary`;

    const [matchRes, statsRes] = await Promise.all([
      fetch(matchUrl, { headers: PL_HEADERS, signal: AbortSignal.timeout(6000) }),
      fetch(statsUrl, { headers: PL_HEADERS, signal: AbortSignal.timeout(6000) }).catch(() => null),
    ]);

    if (!matchRes.ok) {
      console.warn(`Premier League API returned status ${matchRes.status}. Using fallback dataset.`);
      const fallback = getLocalFixtureFallback(plMatchId);
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=180");
      return res.status(200).json(fallback);
    }

    const matchData = await matchRes.json();
    let statsData = null;
    if (statsRes && statsRes.ok) {
      try {
        statsData = await statsRes.json();
      } catch (e) {}
    }

    // Fetch commentary with pagination
    let rawComments = [];
    let nextUrl = commBaseUrl;
    let page = 0;
    while (nextUrl && page < 20) {
      page++;
      try {
        const commRes = await fetch(nextUrl, { headers: PL_HEADERS, signal: AbortSignal.timeout(4000) });
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

    // Filter English comments
    const englishComments = [];
    const seenComments = new Set();

    for (const c of rawComments) {
      if (!c.comment || c.type === "lineup") continue;
      if (/[\u0600-\u06FF]/.test(c.comment)) continue;
      if (
        c.comment.startsWith("Falta ") ||
        c.comment.startsWith("Remate ") ||
        c.comment.includes("cometido por") ||
        c.comment.includes("cometida por") ||
        c.comment.startsWith("¡Gooooool") ||
        c.comment.startsWith("Alineaciones") ||
        c.comment.startsWith("Empieza ") ||
        c.comment.includes("ha recibido una falta") ||
        c.comment.includes("fuera de juego") ||
        c.comment.includes("despeje") ||
        c.comment.includes("asistencia de") ||
        c.comment.includes("saque de esquina") ||
        c.comment.includes("al larguero") ||
        c.comment.includes("mano de") ||
        c.comment.includes("parada") ||
        c.comment.includes("tarjeta amarilla") ||
        c.comment.includes("tarjeta roja")
      ) {
        continue;
      }

      const key = `${c.time || ""}_${c.comment}`;
      if (seenComments.has(key)) continue;
      seenComments.add(key);
      englishComments.push(c);
    }

    const goals = [];
    const events = [];
    const liveCommentary = [];

    englishComments.forEach((c) => {
      const timeStr = c.time || (c.clock ? `${c.clock}'` : "");
      const minuteNum = parseInt(timeStr, 10) || 0;
      const commentText = c.comment || "";
      const type = (c.type || "").toLowerCase();

      let category = "general";
      let isKey = false;
      let team = "home";
      if (
        commentText.toLowerCase().includes("hull city") ||
        commentText.toLowerCase().includes("(hull)")
      ) {
        team = "away";
      }

      if (type === "goal" || commentText.toLowerCase().startsWith("goal!")) {
        category = "goal_var";
        isKey = true;

        const goalScorerMatch = commentText.match(/Goal!\s*[^.]*\.\s*([^(]+)\s*\(([^)]+)\)/i);
        const assistMatch = commentText.match(/Assisted by\s+([^.]+?)(?:\s+following|\.|$)/i);
        const scoreMatch = commentText.match(/Chelsea\s*(\d+)\s*,\s*Hull(?:\s*City)?\s*(\d+)/i);

        const scorerName = goalScorerMatch ? goalScorerMatch[1].trim() : "Player";
        const teamScoring =
          goalScorerMatch && goalScorerMatch[2].toLowerCase().includes("hull") ? "away" : "home";
        const assistName = assistMatch ? assistMatch[1].trim() : null;

        goals.push({
          minute: minuteNum || 1,
          player: scorerName,
          assist: assistName,
          team: teamScoring,
          score: scoreMatch
            ? `${scoreMatch[1]}-${scoreMatch[2]}`
            : `${matchData.homeTeam?.score || 1}-${matchData.awayTeam?.score || 0}`,
        });

        events.push({
          minute: minuteNum || 1,
          type: "goal",
          team: teamScoring,
          player: scorerName,
          assist: assistName,
          detail: commentText,
        });
      } else if (
        type.includes("card") ||
        type.includes("yellow") ||
        commentText.toLowerCase().includes("is shown the yellow card")
      ) {
        category = "card";
        isKey = true;
        const playerMatch = commentText.match(/([^(]+)\s*\(([^)]+)\)\s*is shown the yellow card/i);
        const cardPlayer = playerMatch ? playerMatch[1].trim() : "Player";
        const cardTeam =
          playerMatch && playerMatch[2].toLowerCase().includes("hull") ? "away" : "home";

        events.push({
          minute: minuteNum,
          type: "yellow_card",
          team: cardTeam,
          player: cardPlayer,
          detail: commentText,
        });
      } else if (
        type.includes("red") ||
        commentText.toLowerCase().includes("is shown the red card")
      ) {
        category = "card";
        isKey = true;
        const playerMatch = commentText.match(/([^(]+)\s*\(([^)]+)\)\s*is shown the red card/i);
        const cardPlayer = playerMatch ? playerMatch[1].trim() : "Player";
        const cardTeam =
          playerMatch && playerMatch[2].toLowerCase().includes("hull") ? "away" : "home";

        events.push({
          minute: minuteNum,
          type: "red_card",
          team: cardTeam,
          player: cardPlayer,
          detail: commentText,
        });
      } else if (type.includes("sub") || commentText.toLowerCase().includes("substitution,")) {
        category = "sub";
        isKey = true;
        const subMatch = commentText.match(
          /Substitution,\s*([^.]+)\.\s*([^.]+?)\s+replaces\s+([^.]+)/i
        );
        if (subMatch) {
          const subTeam = subMatch[1].toLowerCase().includes("hull") ? "away" : "home";
          events.push({
            minute: minuteNum,
            type: "substitution",
            team: subTeam,
            player: subMatch[2].trim(),
            player_out: subMatch[3].trim(),
          });
        }
      } else if (commentText.toLowerCase().includes("var") || type.includes("var")) {
        category = "goal_var";
        isKey = true;
      } else if (
        type.includes("attempt") ||
        type.includes("save") ||
        type.includes("corner") ||
        type.includes("post")
      ) {
        category = "key";
        isKey = true;
      }

      liveCommentary.push({
        time: timeStr ? `${timeStr}` : `${c.clock || ""}'`,
        type: type || "comment",
        text: commentText,
        team: team,
        category: category,
        isKey: isKey,
        timestamp: c.timestamp || "",
      });
    });

    goals.sort((a, b) => a.minute - b.minute);
    events.sort((a, b) => a.minute - b.minute);

    let formattedStats = [];
    if (statsData && Array.isArray(statsData) && statsData.length >= 2) {
      const hs = statsData[0]?.stats || {};
      const as = statsData[1]?.stats || {};
      const safeNum = (v) => Number(v || 0);

      const homePass = safeNum(hs.totalPass);
      const awayPass = safeNum(as.totalPass);
      const homePassAcc =
        homePass > 0 ? Math.round((safeNum(hs.accuratePass) / homePass) * 1000) / 10 : 0;
      const awayPassAcc =
        awayPass > 0 ? Math.round((safeNum(as.accuratePass) / awayPass) * 1000) / 10 : 0;

      formattedStats = [
        { name: "การครองบอล (Possession)", home: safeNum(hs.possessionPercentage), away: safeNum(as.possessionPercentage), isPercentage: true },
        { name: "โอกาสทำประตูที่คาดหวัง (Expected Goals - xG)", home: safeNum(hs.expectedGoals), away: safeNum(as.expectedGoals), isPercentage: false },
        { name: "โอกาสยิงทั้งหมด (Total Shots)", home: safeNum(hs.totalScoringAtt), away: safeNum(as.totalScoringAtt), isPercentage: false },
        { name: "ยิงตรงกรอบ (Shots on Target)", home: safeNum(hs.ontargetScoringAtt), away: safeNum(as.ontargetScoringAtt), isPercentage: false },
        { name: "ความแม่นยำในการส่งบอล (Passing Accuracy)", home: homePassAcc, away: awayPassAcc, isPercentage: true },
        { name: "การส่งบอลทั้งหมด (Total Passes)", home: homePass, away: awayPass, isPercentage: false },
        { name: "เตะมุม (Corners)", home: safeNum(hs.wonCorners || hs.lostCorners), away: safeNum(as.wonCorners || as.lostCorners), isPercentage: false },
        { name: "ทำฟาวล์ (Fouls Conceded)", home: safeNum(hs.fkFoulLost), away: safeNum(as.fkFoulLost), isPercentage: false },
        { name: "ใบเหลือง (Yellow Cards)", home: safeNum(hs.yellowCard), away: safeNum(as.yellowCard), isPercentage: false },
        { name: "ใบแดง (Red Cards)", home: safeNum(hs.redCard), away: safeNum(as.redCard), isPercentage: false },
      ];
    }

    let matchStatus = "live";
    const period = matchData.period || "FirstHalf";
    if (period === "FullTime") matchStatus = "completed";
    else if (period === "PreMatch") matchStatus = "upcoming";
    else if (period === "HalfTime") matchStatus = "halftime";
    else matchStatus = "live";

    // Optional safe local persistence (safely ignored if on read-only serverless filesystem)
    try {
      const fixturesPath = path.join(process.cwd(), "data", "fixtures.json");
      if (fs.existsSync(fixturesPath)) {
        const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
        const mIdx = fixtures.findIndex((m) => m.id === "m10" || m.pl_match_id === plMatchId);
        if (mIdx !== -1) {
          fixtures[mIdx].pl_match_id = plMatchId;
          fixtures[mIdx].status = matchStatus;
          fixtures[mIdx].period = period;
          fixtures[mIdx].clock = matchData.clock ? `${matchData.clock}'` : "";
          fixtures[mIdx].home_score = matchData.homeTeam?.score ?? 0;
          fixtures[mIdx].away_score = matchData.awayTeam?.score ?? 0;
          if (goals.length > 0) fixtures[mIdx].goals = goals;
          if (events.length > 0) fixtures[mIdx].events = events;
          if (formattedStats.length > 0) fixtures[mIdx].stats = formattedStats;
          if (liveCommentary.length > 0) fixtures[mIdx].live_commentary = liveCommentary;
          fixtures[mIdx].last_synced = new Date().toISOString();
          fs.writeFileSync(fixturesPath, JSON.stringify(fixtures, null, 2), "utf8");
        }
      }
    } catch (fsErr) {
      // Ignored in read-only environment like Vercel
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).json({
      success: true,
      matchId: plMatchId,
      clock: matchData.clock ? `${matchData.clock}'` : "",
      period: period,
      status: matchStatus,
      score: {
        home: matchData.homeTeam?.score ?? 0,
        away: matchData.awayTeam?.score ?? 0,
      },
      goals,
      events,
      stats: formattedStats,
      live_commentary: liveCommentary,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in api/pl-match handler:", error.message);
    const fallback = getLocalFixtureFallback(plMatchId);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(fallback);
  }
}
