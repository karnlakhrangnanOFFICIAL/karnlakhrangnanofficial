import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';

async function test() {
  const url = 'https://www.wslfootball.com/standings/wsl';
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);
  
  let tablesData;
  try {
    const dataPath = path.join(process.cwd(), 'data', 'tables-women.json');
    const fileData = fs.readFileSync(dataPath, 'utf8');
    tablesData = JSON.parse(fileData);
  } catch (e) {}
  
  const teamLogoMap = {};
  if (tablesData && tablesData.standings) {
    for (const item of tablesData.standings) {
      teamLogoMap[item.team.toLowerCase()] = item.logo;
    }
  }

  const standings = [];
  $('table tbody tr').each((i, el) => {
    const cols = $(el).find('td');
    if (cols.length >= 11) {
      const rawName = $(cols[2]).text().trim();
      const mappedName = rawName.replace(/[A-Z]{3}$/, '');
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
  console.log(standings);
}
test();
