import * as cheerio from 'cheerio';

async function run() {
  const url = 'https://www.wslfootball.com/transfers';
  const res = await fetch(url);
  const text = await res.text();
  const $ = cheerio.load(text);
  
  let chelseaTable = null;
  $('h3').each((i, el) => {
     if ($(el).text().trim() === 'Chelsea') {
        const topHeader = $(el).closest('.tw-club-hd'); // guessing class name?
        let cur = $(el);
        while (cur.length && cur[0].tagName !== 'body') {
            if (cur.nextAll('table').length > 0) {
               chelseaTable = cur.nextAll('table').first();
               break;
            }
            if (cur.nextAll('div').find('table').length > 0) {
               chelseaTable = cur.nextAll('div').first().find('table').first();
               break;
            }
            cur = cur.parent();
        }
     }
  });
  
  if (chelseaTable) {
     chelseaTable.find('tr').each((i, row) => {
         const cols = $(row).find('td');
         if (cols.length >= 2) {
            console.log($(cols[0]).text().trim(), '|', $(cols[1]).text().trim());
         }
     });
  }
}
run();
