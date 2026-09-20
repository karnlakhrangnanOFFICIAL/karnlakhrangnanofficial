const fs = require('fs');

const files = [
  'about.html', 'icons.html', 'match-detail.html', 'men-team.html',
  'player-profile.html', 'post-match-graphic.html', 'pre-match-graphic.html',
  'the-story-blue.html', 'trophy.html', 'women-team.html', 'index.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('data-i18n="nav.transfers"')) {
      html = html.replace(
        /<li><a href="https:\/\/www\.chelseafc\.com\/en\/news\/latest-news-all" target="_blank" data-i18n="nav\.news">News<\/a><\/li>/,
        `<li><a href="https://www.chelseafc.com/en/news/latest-news-all" target="_blank" data-i18n="nav.news">News</a></li>
        <li><a href="transfers.html" data-i18n="nav.transfers">Transfers</a></li>`
      );
      fs.writeFileSync(file, html);
    }
  }
});
