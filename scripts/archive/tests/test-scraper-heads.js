import * as cheerio from 'cheerio';
async function run() {
  const url = 'https://www.wslfootball.com/standings/wsl';
  const res = await fetch(url);
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const heads = [];
  $('table thead th').each((i, el) => {
    heads.push($(el).text().trim());
  });
  console.log('Headers:', heads);
  
  const cols = [];
  $('table tbody tr').first().find('td').each((i, el) => {
    cols.push($(el).text().trim());
  });
  console.log('Row 0:', cols);
}
run();
