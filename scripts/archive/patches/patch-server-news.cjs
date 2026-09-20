const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');
if (!server.includes('/api/news')) {
  const newsRoute = `
// Custom API route for news scraping
import newsHandler from './api/news.js';
app.get('/api/news', (req, res) => {
  newsHandler(req, res);
});
`;
  server = server.replace('app.get(\'/\'', newsRoute + '\napp.get(\'/\'');
  fs.writeFileSync('server.js', server);
}
