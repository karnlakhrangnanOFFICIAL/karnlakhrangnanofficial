import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

function getLocalEplFallback() {
  try {
    const dataPath = path.join(process.cwd(), "data", "tables-men.json");
    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.warn("Could not read tables-men.json for fallback", e.message);
  }
  return {
    competition: "Premier League",
    competition_logo: "databases/logo/competitions/men/premier-league.png",
    season: "2026/27",
    standings: []
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Auth-Token");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const tablesData = getLocalEplFallback();

  try {
    const url = "https://www.skysports.com/premier-league-table";
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0" },
      signal: AbortSignal.timeout(6000)
    });

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      const teamLogoMap = {};
      if (tablesData && tablesData.standings) {
        for (const item of tablesData.standings) {
          if (item.team) teamLogoMap[item.team.toLowerCase()] = item.logo;
        }
      }

      const standings = [];
      $("table tbody tr").each((i, el) => {
        try {
          const cols = $(el).find("td");
          if (!cols || cols.length < 10) return;

          let rawName = $(cols[1]).text().trim().replace(/\n/g, "").trim();
          if (!rawName) return;

          let mappedName = rawName;
          if (rawName === "Man City") mappedName = "Manchester City";
          if (rawName === "Man Utd") mappedName = "Manchester United";
          if (rawName === "Newcastle") mappedName = "Newcastle United";
          if (rawName === "Nottm Forest") mappedName = "Nottingham Forest";
          if (rawName === "Spurs") mappedName = "Tottenham Hotspur";
          if (rawName === "Wolves") mappedName = "Wolverhampton Wanderers";
          if (rawName === "Leicester") mappedName = "Leicester City";
          if (rawName === "Ipswich") mappedName = "Ipswich Town";
          if (rawName === "Brighton") mappedName = "Brighton & Hove Albion";

          let logo = teamLogoMap[mappedName.toLowerCase()] || "databases/logo/teams/england_chelsea.svg";

          if (logo === "databases/logo/teams/england_chelsea.svg" && !mappedName.toLowerCase().includes("chelsea")) {
            for (const [k, v] of Object.entries(teamLogoMap)) {
              if (k.includes(mappedName.toLowerCase()) || mappedName.toLowerCase().includes(k)) {
                logo = v;
                break;
              }
            }
          }

          const parseColInt = (colIndex, fallback = 0) => {
            try {
              const val = parseInt($(cols[colIndex]).text().trim(), 10);
              return isNaN(val) ? fallback : val;
            } catch {
              return fallback;
            }
          };

          standings.push({
            pos: parseColInt(0, i + 1),
            team: mappedName,
            logo: logo,
            p: parseColInt(2, 0),
            w: parseColInt(3, 0),
            d: parseColInt(4, 0),
            l: parseColInt(5, 0),
            gf: parseColInt(6, 0),
            ga: parseColInt(7, 0),
            gd: parseColInt(8, 0),
            pts: parseColInt(9, 0),
          });
        } catch (rowErr) {
          console.warn(`Error parsing EPL table row ${i}:`, rowErr.message);
        }
      });

      if (standings.length >= 18) {
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
        return res.status(200).json({
          success: true,
          data: {
            competition: "Premier League",
            competition_logo: "databases/logo/competitions/men/premier-league.png",
            season: "2026/27",
            standings: standings,
          },
        });
      }
    }
  } catch (err) {
    console.warn("EPL Live Scrape error, serving fallback dataset:", err.message);
  }

  // Graceful fallback to static data
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json({
    success: true,
    data: tablesData,
  });
}
