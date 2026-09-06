import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://www.wslfootball.com/standings/wsl';
  const res = await fetch(url);
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const rows = [];
  $('table tbody tr').each((i, el) => {
    const cols = $(el).find('td');
    if (cols.length > 0) {
      rows.push({
        pos: $(cols[0]).text().trim(),
        team: $(cols[1]).text().trim(),
        pts: $(cols[2]).text().trim(),
        pld: $(cols[3]).text().trim(),
        w: $(cols[4]).text().trim(),
        l: $(cols[5]).text().trim(),
        d: $(cols[6]).text().trim(),
        gf: $(cols[7]).text().trim(),
        ga: $(cols[8]).text().trim(),
        gd: $(cols[9]).text().trim(),
      });
    }
  });
  console.log(rows);
}
run();
