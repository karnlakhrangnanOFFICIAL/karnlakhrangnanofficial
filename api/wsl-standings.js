import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

function getLocalWslFallback() {
  try {
    const dataPath = path.join(process.cwd(), "data", "tables-women.json");
    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.warn("Could not read tables-women.json for fallback", e.message);
  }
  return {
    competition: "FA Women's Super League",
    competition_logo: "databases/logo/competitions/women/women_super_league.png",
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

  const tablesData = getLocalWslFallback();

  try {
    const url = "https://www.wslfootball.com/standings/wsl";
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

      const nameMapping = {
        "manchester citymci": "Manchester City",
        arsenalars: "Arsenal",
        chelseache: "Chelsea",
        "manchester unitedmnu": "Manchester United",
        "tottenham hotspurtot": "Tottenham Hotspur",
        "london city lionesseslcl": "London City Lionesses",
        "brighton & hove albionbha": "Brighton & Hove Albion",
        evertoneve: "Everton",
        "aston villaavl": "Aston Villa",
        "west ham unitedwhu": "West Ham United",
        liverpoolliv: "Liverpool",
        "birmingham citybir": "Birmingham City",
        "crystal palacecry": "Crystal Palace",
        "charlton athleticcha": "Charlton Athletic",
      };

      const standings = [];
      $("table tbody tr").each((i, el) => {
        const cols = $(el).find("td");
        if (cols.length >= 11) {
          const rawName = $(cols[2]).text().trim();
          const mappedName = nameMapping[rawName.toLowerCase()] || rawName.replace(/[A-Z]{3}$/, "");

          const logo = teamLogoMap[mappedName.toLowerCase()] || "databases/logo/teams/england_chelsea.svg";

          standings.push({
            pos: parseInt($(cols[1]).text().trim(), 10) || i + 1,
            team: mappedName,
            logo: logo,
            p: parseInt($(cols[4]).text().trim(), 10) || 0,
            w: parseInt($(cols[5]).text().trim(), 10) || 0,
            d: parseInt($(cols[7]).text().trim(), 10) || 0,
            l: parseInt($(cols[6]).text().trim(), 10) || 0,
            gf: parseInt($(cols[8]).text().trim(), 10) || 0,
            ga: parseInt($(cols[9]).text().trim(), 10) || 0,
            gd: parseInt($(cols[10]).text().trim(), 10) || 0,
            pts: parseInt($(cols[3]).text().trim(), 10) || 0,
          });
        }
      });

      if (standings.length > 0) {
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
        return res.status(200).json({
          success: true,
          data: {
            competition: "Barclays Women's Super League",
            competition_logo: "databases/logo/competitions/women/women_super_league.png",
            season: "2026/27",
            standings: standings,
          },
        });
      }
    }
  } catch (err) {
    console.warn("WSL Live Scrape error, falling back to local dataset:", err.message);
  }

  // Graceful fallback to static data
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json({
    success: true,
    data: tablesData,
  });
}
