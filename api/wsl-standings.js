import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const url = 'https://www.wslfootball.com/standings/wsl';
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Read the current static tables for the logo mapping
    // Assuming the server runs from root
    let tablesData;
    try {
      const dataPath = path.join(process.cwd(), 'data', 'tables-women.json');
      const fileData = fs.readFileSync(dataPath, 'utf8');
      tablesData = JSON.parse(fileData);
    } catch (e) {
      console.error("Could not read tables-women.json for mapping", e);
    }
    
    // Map teams to logos based on our json
    const teamLogoMap = {};
    if (tablesData && tablesData.standings) {
      for (const item of tablesData.standings) {
        teamLogoMap[item.team.toLowerCase()] = item.logo;
      }
    }
    // Specific overrides if names don't match exactly
    const nameMapping = {
      'manchester citymci': 'Manchester City',
      'arsenalars': 'Arsenal',
      'chelseache': 'Chelsea',
      'manchester unitedmnu': 'Manchester United',
      'tottenham hotspurtot': 'Tottenham Hotspur',
      'london city lionesseslcl': 'London City Lionesses',
      'brighton & hove albionbha': 'Brighton & Hove Albion',
      'evertoneve': 'Everton',
      'aston villaavl': 'Aston Villa',
      'west ham unitedwhu': 'West Ham United',
      'liverpoolliv': 'Liverpool',
      'birmingham citybir': 'Birmingham City',
      'crystal palacecry': 'Crystal Palace',
      'charlton athleticcha': 'Charlton Athletic'
    };

    const standings = [];
    $('table tbody tr').each((i, el) => {
      const cols = $(el).find('td');
      if (cols.length >= 11) {
        const rawName = $(cols[2]).text().trim();
        const mappedName = nameMapping[rawName.toLowerCase()] || rawName.replace(/[A-Z]{3}$/, ''); // Fallback
        
        const logo = teamLogoMap[mappedName.toLowerCase()] || `databases/logo/teams/placeholder.svg`;
        
        standings.push({
          pos: parseInt($(cols[1]).text().trim()) || (i+1),
          team: mappedName,
          logo: logo,
          p: parseInt($(cols[4]).text().trim()) || 0,
          w: parseInt($(cols[5]).text().trim()) || 0,
          d: parseInt($(cols[7]).text().trim()) || 0,
          l: parseInt($(cols[6]).text().trim()) || 0,
          gf: parseInt($(cols[8]).text().trim()) || 0,
          ga: parseInt($(cols[9]).text().trim()) || 0,
          gd: parseInt($(cols[10]).text().trim()) || 0,
          pts: parseInt($(cols[3]).text().trim()) || 0
        });
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ 
      success: true, 
      data: {
        competition: "FA Women's Super League",
        competition_logo: "databases/logo/competitions/women/women_super_league.png",
        season: "2026/27",
        standings: standings
      }
    });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
