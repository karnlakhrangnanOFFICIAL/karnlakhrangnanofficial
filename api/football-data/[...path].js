import fs from "fs";
import path from "path";

const FOOTBALL_DATA_TOKEN =
  process.env.FOOTBALL_DATA_TOKEN ||
  process.env.FOOTBALL_DATA_API_KEY ||
  process.env.NEXT_PUBLIC_FOOTBALL_DATA_TOKEN ||
  "fb73ad1df2194fdab3fe56614d1a953e";

// Memory cache dictionary for subpaths
const pathCache = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    let subPath = "";
    if (req.query && req.query.path) {
      if (Array.isArray(req.query.path)) {
        subPath = req.query.path.join("/");
      } else {
        subPath = req.query.path;
      }
    } else if (req.url) {
      const urlObj = new URL(req.url, "http://localhost");
      const pathname = urlObj.pathname.replace(/^\/api\/football-data\/?/, "");
      subPath = pathname;
    }

    const queryParams = new URLSearchParams();
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (key !== "path") {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else if (value !== undefined) {
            queryParams.append(key, value);
          }
        }
      }
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const cacheKey = `${subPath}${queryString}`;
    const now = Date.now();

    // Check memory cache (Valid for 60 seconds)
    const cached = pathCache.get(cacheKey);
    if (cached && now - cached.timestamp < 60000) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json(cached.data);
    }

    const targetUrl = `https://api.football-data.org/v4/${subPath}${queryString}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "X-Auth-Token": FOOTBALL_DATA_TOKEN,
          "User-Agent": "Mozilla/5.0 (ChelseaHub/2.0)",
        },
        signal: AbortSignal.timeout(2500),
      });

      if (response.ok) {
        const data = await response.json();
        pathCache.set(cacheKey, { data, timestamp: now });

        if (
          queryString.includes("_t=") ||
          queryString.includes("live=true") ||
          req.headers["cache-control"] === "no-cache"
        ) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
        } else {
          res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
        }
        return res.status(200).json(data);
      }
    } catch (fetchErr) {
      // Fast fallback on timeout without noisy logs
    }

    // If cached data exists (even if stale), serve it
    if (cached && cached.data) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=180");
      return res.status(200).json(cached.data);
    }

    // Local Fallback for matches (/teams/61/matches)
    if (subPath.includes("teams/61/matches") || subPath.includes("teams/61")) {
      try {
        const fixturesFile = path.join(process.cwd(), "data", "fixtures.json");
        if (fs.existsSync(fixturesFile)) {
          const fixturesData = JSON.parse(fs.readFileSync(fixturesFile, "utf8"));
          const matches = fixturesData
            .filter((m) => m.team_type !== "W")
            .map((m) => ({
              id: m.id,
              utcDate: `${m.date}T${m.time && m.time !== "TBC" ? m.time : "15:00"}:00Z`,
              status: m.status === "completed" ? "FINISHED" : m.status === "live" ? "IN_PLAY" : "TIMED",
              matchday: parseInt(m.round?.replace(/\D/g, ""), 10) || 1,
              stage: "REGULAR_SEASON",
              homeTeam: { id: m.ha === "H" ? 61 : 999, name: m.home_team, shortName: m.home_team, crest: m.home_logo || "databases/logo/teams/england_chelsea.svg" },
              awayTeam: { id: m.ha === "A" ? 61 : 999, name: m.away_team, shortName: m.away_team, crest: m.away_logo || "databases/logo/teams/england_chelsea.svg" },
              score: {
                fullTime: { home: m.home_score ?? null, away: m.away_score ?? null },
                halfTime: { home: m.home_half_score ?? null, away: m.away_half_score ?? null },
              },
              competition: { id: 2021, name: m.competition_name || m.competition || "Premier League", code: "PL" },
            }));

          const responseData = { count: matches.length, matches };
          pathCache.set(cacheKey, { data: responseData, timestamp: now });
          res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
          return res.status(200).json(responseData);
        }
      } catch (err) {}
    }

    // Local Fallback for standings (/competitions/PL/standings)
    if (subPath.includes("standings")) {
      try {
        const tablesFile = path.join(process.cwd(), "data", "tables-men.json");
        if (fs.existsSync(tablesFile)) {
          const tableData = JSON.parse(fs.readFileSync(tablesFile, "utf8"));
          pathCache.set(cacheKey, { data: tableData, timestamp: now });
          res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
          return res.status(200).json(tableData);
        }
      } catch (err) {}
    }

    // Fallback for general squad or team info (/teams/61)
    if (subPath.includes("teams/61")) {
      try {
        const playersFile = path.join(process.cwd(), "data", "players-men.json");
        if (fs.existsSync(playersFile)) {
          const squad = JSON.parse(fs.readFileSync(playersFile, "utf8"));
          const squadData = {
            id: 61,
            name: "Chelsea FC",
            shortName: "Chelsea",
            tla: "CHE",
            crest: "databases/logo/teams/england_chelsea.svg",
            squad: squad,
            coach: { name: "Xabi Alonso", nationality: "Spanish" },
          };
          pathCache.set(cacheKey, { data: squadData, timestamp: now });
          res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
          return res.status(200).json(squadData);
        }
      } catch (err) {}
    }

    return res.status(200).json({ success: true, message: "Fallback response", subPath });
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}
