const cheerio = require('cheerio');
fetch('https://www.chelseafc.com/en/news/latest-news-all')
  .then(res => res.text())
  .then(html => {
    const $ = cheerio.load(html);
    const news = [];
    // Need to find the correct selector for news cards.
    // Usually they are in a grid or list.
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/en/news/article/')) {
        const title = $(el).find('h3, h2, h4, span').text().trim() || $(el).attr('title') || $(el).attr('aria-label');
        const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
        if (title && title.length > 10 && !news.find(n => n.link === href)) {
          news.push({ title, link: href, thumbnail: img });
        }
      }
    });
    console.log(news.slice(0, 5));
  }).catch(console.error);
