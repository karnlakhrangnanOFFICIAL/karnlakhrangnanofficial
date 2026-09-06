import * as cheerio from 'cheerio';
import fs from 'fs';

async function run() {
  const url = 'https://www.bbc.com/sport/football/premier-league/table';
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const firstRow = $('table tbody tr').first();
  firstRow.find('td').each((i, el) => {
    console.log(`Col ${i}:`, $(el).text().trim());
  });
}
run();
