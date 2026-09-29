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
        const cols = $(el).find("td");
        if (cols.length >= 10) {
          let rawName = $(cols[1]).text().trim().replace(/\n/g, "").trim();

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

          standings.push({
            pos: parseInt($(cols[0]).text().trim(), 10) || i + 1,
            team: mappedName,
            logo: logo,
            p: parseInt($(cols[2]).text().trim(), 10) || 0,
            w: parseInt($(cols[3]).text().trim(), 10) || 0,
            d: parseInt($(cols[4]).text().trim(), 10) || 0,
            l: parseInt($(cols[5]).text().trim(), 10) || 0,
            gf: parseInt($(cols[6]).text().trim(), 10) || 0,
            ga: parseInt($(cols[7]).text().trim(), 10) || 0,
            gd: parseInt($(cols[8]).text().trim(), 10) || 0,
            pts: parseInt($(cols[9]).text().trim(), 10) || 0,
          });
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
