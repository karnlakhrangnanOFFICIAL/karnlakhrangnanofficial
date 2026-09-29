import fs from "fs";
import path from "path";

const FOOTBALL_DATA_TOKEN =
  process.env.FOOTBALL_DATA_TOKEN ||
  process.env.FOOTBALL_DATA_API_KEY ||
  process.env.NEXT_PUBLIC_FOOTBALL_DATA_TOKEN ||
  "fb73ad1df2194fdab3fe56614d1a953e";

// In-memory cache to prevent upstream rate-limits and eliminate latency
let memoryCache = {
  data: null,
  timestamp: 0,
  key: "",
};

/**
 * Fallback static fixtures generator from local database or memory
 */
function getLocalMatchesFallback() {
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
          homeTeam: {
            id: m.ha === "H" ? 61 : 999,
            name: m.home_team,
            shortName: m.home_team,
            crest: m.home_logo || "databases/logo/teams/england_chelsea.svg",
          },
          awayTeam: {
            id: m.ha === "A" ? 61 : 999,
            name: m.away_team,
            shortName: m.away_team,
            crest: m.away_logo || "databases/logo/teams/england_chelsea.svg",
          },
          score: {
            fullTime: { home: m.home_score ?? null, away: m.away_score ?? null },
            halfTime: { home: m.home_half_score ?? null, away: m.away_half_score ?? null },
          },
          competition: {
            id: 2021,
            name: m.competition_name || m.competition || "Premier League",
            code: "PL",
          },
        }));
      return { count: matches.length, matches };
    }
  } catch (err) {
    // Silent fallback
  }

  // Hardcoded emergency fallback match
  return {
    count: 1,
    matches: [
      {
        id: 99901,
        utcDate: new Date(Date.now() + 86400000).toISOString(),
        status: "TIMED",
        matchday: 1,
        stage: "REGULAR_SEASON",
        homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea", crest: "databases/logo/teams/england_chelsea.svg" },
        awayTeam: { id: 65, name: "Manchester City FC", shortName: "Man City", crest: "databases/logo/teams/england_manchester_city.svg" },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        competition: { id: 2021, name: "Premier League", code: "PL" },
      },
    ],
  };
}

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, X-Requested-With");

  // Handle Preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    // Construct Query String
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
    const cacheKey = queryString;
    const now = Date.now();

    // Check memory cache (Valid for 60 seconds)
    if (memoryCache.data && memoryCache.key === cacheKey && now - memoryCache.timestamp < 60000) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json(memoryCache.data);
    }

    const targetUrl = `https://api.football-data.org/v4/teams/61/matches${queryString}`;

    // Fast-fail fetch with 2500ms timeout
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
        memoryCache = {
          data,
          timestamp: now,
          key: cacheKey,
        };

        const isLiveOrFresh =
          queryString.includes("_t=") ||
          queryString.includes("live=true") ||
          req.headers["cache-control"] === "no-cache";

        if (isLiveOrFresh) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
        } else {
          res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
        }
        return res.status(200).json(data);
      }
    } catch (fetchErr) {
      // Fast fallback on timeout or connection error without noisy logs
    }

    // If cached data exists (even if stale), serve it
    if (memoryCache.data) {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=180");
      return res.status(200).json(memoryCache.data);
    }

    // Graceful fallback to local dataset
    const fallbackData = getLocalMatchesFallback();
    memoryCache = {
      data: fallbackData,
      timestamp: now,
      key: cacheKey,
    };

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=180");
    return res.status(200).json(fallbackData);
  } catch (error) {
    const emergencyData = getLocalMatchesFallback();
    return res.status(200).json(emergencyData);
  }
}
