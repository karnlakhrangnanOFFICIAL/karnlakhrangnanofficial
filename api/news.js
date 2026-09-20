export default async function handler(req, res) {
  try {
    const urls = [
      'https://www.chelseafc.com/en/news/latest-news-all',
      'https://www.chelseafc.com/en/news/category/mens-team',
      'https://www.chelseafc.com/en/news/category/womens-team',
      'https://www.chelseafc.com/en/news/category/club'
    ];

    const responses = await Promise.all(
      urls.map(u => fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.text()).catch(() => ''))
    );

    const news = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    for (const rawHtml of responses) {
      if (!rawHtml) continue;
      const html = rawHtml.replace(/&quot;/g, '\"');
      const articles = html.split('\"type\":\"Article\"');

      for (let i = 1; i < articles.length; i++) {
        const segment = articles[i].substring(0, 1200);
        const titleMatch = articles[i - 1].match(/\"title\":\"([^\"]+)\",?$/);
        const urlMatch = segment.match(/\"url\":\"(\/en\/news\/article\/[^\"]+)\"/);
        const imgMatch = segment.match(/\"thumbnail\":\{.+?\"url\":\"([^\"]+)\"/);

        if (titleMatch && urlMatch && imgMatch) {
          const articleUrl = 'https://www.chelseafc.com' + urlMatch[1];
          let rawTitle = titleMatch[1];

          let cleanTitle = rawTitle;
          try {
            cleanTitle = JSON.parse('\"' + rawTitle.replace(/\"/g, '\\\"') + '\"');
          } catch (e) {
            cleanTitle = rawTitle
              .replace(/\\u2019/g, "’")
              .replace(/\\u2018/g, "‘")
              .replace(/\\u201c/g, "“")
              .replace(/\\u201d/g, "”")
              .replace(/\\u0027/g, "'")
              .replace(/\\u2013/g, "–")
              .replace(/\\u2014/g, "—")
              .replace(/\\u2026/g, "...");
          }

          if (seenUrls.has(articleUrl) || seenTitles.has(cleanTitle.toLowerCase())) continue;
          seenUrls.add(articleUrl);
          seenTitles.add(cleanTitle.toLowerCase());

          let img = imgMatch[1].replace('http://', 'https://');

          // Extract publication date / timestamp from Cloudinary version /v(\d{10})/ or date path
          let pubDate = null;
          const vMatch = img.match(/\/v(\d{10})\//);
          const dMatch = img.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);

          if (vMatch) {
            const timestamp = parseInt(vMatch[1], 10);
            pubDate = new Date(timestamp * 1000).toISOString();
          } else if (dMatch) {
            pubDate = new Date(`${dMatch[1]}-${dMatch[2]}-${dMatch[3]}T12:00:00Z`).toISOString();
          } else {
            pubDate = new Date().toISOString();
          }

          news.push({
            title: cleanTitle,
            link: articleUrl,
            thumbnail: img,
            pubDate: pubDate
          });
        }
      }
    }

    // Sort newest first
    news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ success: true, items: news });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
