const fs = require('fs');

const files = [
  'about.html', 'icons.html', 'match-detail.html', 'men-team.html',
  'player-profile.html', 'post-match-graphic.html', 'pre-match-graphic.html',
  'the-story-blue.html', 'trophy.html', 'women-team.html'
];

files.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('data-i18n="nav.news"')) {
    html = html.replace(
      /<li><a href="about\.html"( class="active")? data-i18n="nav\.about">About Us<\/a><\/li>/,
      `<li><a href="about.html"$1 data-i18n="nav.about">About Us</a></li>
        <li><a href="https://www.chelseafc.com/en/news/latest-news-all" target="_blank" data-i18n="nav.news">News</a></li>`
    );
    fs.writeFileSync(file, html);
  }
});
