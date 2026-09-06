import * as cheerio from 'cheerio';

async function run() {
  const url = 'https://en.wikipedia.org/wiki/Peter_Osgood';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const $ = cheerio.load(text);
  
  $('p, h2, h3').each((i, el) => {
      if ($(el).is('h2') || $(el).is('h3')) {
          console.log('\n---', $(el).text().trim(), '---');
      } else {
          const txt = $(el).text().replace(/\[\d+\]/g, '').trim();
          if (txt.length > 50) {
              console.log(txt.substring(0, 100) + '...');
          }
      }
  });
}
run();
