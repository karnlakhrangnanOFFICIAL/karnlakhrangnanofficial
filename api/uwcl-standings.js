import fs from "fs";
import path from "path";

function getLocalUwclFallback() {
  try {
    const dataPath = path.join(process.cwd(), "data", "tables-uwcl.json");
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }
  } catch (err) {
    console.warn("Could not read tables-uwcl.json fallback:", err.message);
  }
  return {
    competition: "UEFA Women's Champions League",
    competition_logo: "databases/logo/competitions/women/women_uwcl_champions_league_logo.svg",
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

  try {
    const fallbackData = getLocalUwclFallback();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      success: true,
      data: fallbackData
    });
  } catch (error) {
    console.error("Error in uwcl-standings API:", error);
    const fallbackData = getLocalUwclFallback();
    return res.status(200).json({
      success: true,
      data: fallbackData
    });
  }
}
