const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  "const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://talkchelsea.net/feed/');",
  "const res = await fetch('/api/news'); // Fetch from our Serverless Scraper"
);

// Our response has { success: true, items: [...] } instead of status === 'ok'
html = html.replace(
  "if (data.status === 'ok' && data.items && data.items.length > 0)",
  "if (data.success && data.items && data.items.length > 0)"
);

fs.writeFileSync('index.html', html);
