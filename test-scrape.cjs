const cheerio = require('cheerio');
fetch('https://www.chelseafc.com/en/news/latest-news-all')
  .then(res => res.text())
  .then(html => {
    const $ = cheerio.load(html);
    const news = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && (href.includes('/en/news/article/') || href.includes('/news/article/'))) {
        const title = $(el).find('h3, h2, h4, p').text().trim() || $(el).text().trim();
        const img = $(el).find('img').attr('src') || $(el).find('source').attr('srcset');
        if (title && title.length > 10 && !news.find(n => n.link === href)) {
          news.push({ title: title.replace(/\s+/g, ' '), link: href.startsWith('http') ? href : 'https://www.chelseafc.com' + href, thumbnail: img });
        }
      }
    });
    console.log(news.slice(0, 5));
  }).catch(console.error);
