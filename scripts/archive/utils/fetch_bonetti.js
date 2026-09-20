import * as cheerio from 'cheerio';

async function run() {
  const url = 'https://en.wikipedia.org/wiki/Peter_Bonetti';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const $ = cheerio.load(text);
  
  let paragraphs = [];
  $('#mw-content-text p').each((i, el) => {
      const p = $(el).text().replace(/\[\d+\]/g, '').trim();
      if (p.length > 50) {
          paragraphs.push(p);
      }
  });
  
  console.log(paragraphs.slice(0, 4).join('\n\n'));
}
run();
