import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const url = 'https://www.skysports.com/premier-league-table';
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Read the current static tables for the logo mapping
    let tablesData;
    try {
      const dataPath = path.join(process.cwd(), 'data', 'tables-men.json');
      const fileData = fs.readFileSync(dataPath, 'utf8');
      tablesData = JSON.parse(fileData);
    } catch (e) {
      console.error("Could not read tables-men.json for mapping", e);
    }
    
    // Map teams to logos based on our json
    const teamLogoMap = {};
    if (tablesData && tablesData.standings) {
      for (const item of tablesData.standings) {
        teamLogoMap[item.team.toLowerCase()] = item.logo;
      }
    }

    const standings = [];
    $('table tbody tr').each((i, el) => {
      const cols = $(el).find('td');
      if (cols.length >= 10) {
        let rawName = $(cols[1]).text().trim();
        // Sometimes sky sports appends weird spaces or newlines, though we replaced them in the test.
        rawName = rawName.replace(/\n/g, '').trim();
        
        // Try mapping or direct match
        let mappedName = rawName;
        // Common corrections just in case
        if (rawName === 'Man City') mappedName = 'Manchester City';
        if (rawName === 'Man Utd') mappedName = 'Manchester United';
        if (rawName === 'Newcastle') mappedName = 'Newcastle United';
        if (rawName === 'Nottm Forest') mappedName = 'Nottingham Forest';
        if (rawName === 'Spurs') mappedName = 'Tottenham Hotspur';
        if (rawName === 'Wolves') mappedName = 'Wolverhampton Wanderers';
        if (rawName === 'Leicester') mappedName = 'Leicester City';
        if (rawName === 'Ipswich') mappedName = 'Ipswich Town';
        if (rawName === 'Southampton') mappedName = 'Southampton'; // Already matched
        
        let logo = teamLogoMap[mappedName.toLowerCase()] || `databases/logo/teams/placeholder.svg`;
        
        // Just in case it's missed, check if any existing team includes the mapped name
        if (logo === `databases/logo/teams/placeholder.svg`) {
           for (const [k, v] of Object.entries(teamLogoMap)) {
               if (k.includes(mappedName.toLowerCase()) || mappedName.toLowerCase().includes(k)) {
                   logo = v;
                   break;
               }
           }
        }

        standings.push({
          pos: parseInt($(cols[0]).text().trim()) || (i+1),
          team: mappedName,
          logo: logo,
          p: parseInt($(cols[2]).text().trim()) || 0,
          w: parseInt($(cols[3]).text().trim()) || 0,
          d: parseInt($(cols[4]).text().trim()) || 0,
          l: parseInt($(cols[5]).text().trim()) || 0,
          gf: parseInt($(cols[6]).text().trim()) || 0,
          ga: parseInt($(cols[7]).text().trim()) || 0,
          gd: parseInt($(cols[8]).text().trim()) || 0,
          pts: parseInt($(cols[9]).text().trim()) || 0
        });
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ 
       success: true, 
       data: {
        competition: "Premier League",
        competition_logo: "databases/logo/competitions/men/premier_league.png",
        season: "2026/27",
        standings: standings
      }
    });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
