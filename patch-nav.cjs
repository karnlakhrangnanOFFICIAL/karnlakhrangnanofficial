const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  /<li><a href="about\.html" data-i18n="nav\.about">About Us<\/a><\/li>/,
  `<li><a href="about.html" data-i18n="nav.about">About Us</a></li>
        <li><a href="https://www.chelseafc.com/en/news/latest-news-all" target="_blank" data-i18n="nav.news">News</a></li>`
);
fs.writeFileSync('index.html', html);
