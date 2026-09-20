import * as cheerio from 'cheerio';
import fs from 'fs';

async function run() {
  const url = 'https://www.premierleague.com/en/tables/premier-league/2026-27/all-matchweeks';
  console.log("Fetching...", url);
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await response.text();
  fs.writeFileSync('epl.html', html);
  console.log("Saved epl.html", html.length);
}
run();
