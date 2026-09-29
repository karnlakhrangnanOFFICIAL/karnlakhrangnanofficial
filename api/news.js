import fs from "fs";
import path from "path";

/**
 * Fallback news items if Chelsea FC website is unreachable
 */
function getFallbackNews() {
  return [
    {
      title: "Chelsea squad preparation ahead of the upcoming Premier League fixture",
      link: "https://www.chelseafc.com/en/news/category/mens-team",
      thumbnail: "databases/logo/teams/england_chelsea.svg",
      pubDate: new Date().toISOString(),
    },
    {
      title: "Tactical breakdown and squad performance review from Cobham Training Ground",
      link: "https://www.chelseafc.com/en/news/category/club",
      thumbnail: "databases/logo/teams/england_chelsea.svg",
      pubDate: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      title: "Chelsea Women prepare for high-stakes clash in Barclays Women's Super League",
      link: "https://www.chelseafc.com/en/news/category/womens-team",
      thumbnail: "databases/logo/teams/england_chelsea.svg",
      pubDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Auth-Token");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const urls = [
      "https://www.chelseafc.com/en/news/latest-news-all",
      "https://www.chelseafc.com/en/news/category/mens-team",
      "https://www.chelseafc.com/en/news/category/womens-team",
      "https://www.chelseafc.com/en/news/category/club",
    ];

    const responses = await Promise.all(
      urls.map((u) =>
        fetch(u, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: AbortSignal.timeout(6000),
        })
          .then((r) => (r.ok ? r.text() : ""))
          .catch(() => "")
      )
    );

    const news = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    for (const rawHtml of responses) {
      if (!rawHtml) continue;
      const html = rawHtml.replace(/&quot;/g, '"');
      const articles = html.split('"type":"Article"');

      for (let i = 1; i < articles.length; i++) {
        const segment = articles[i].substring(0, 1200);
        const titleMatch = articles[i - 1].match(/"title":"([^"]+)",?$/);
        const urlMatch = segment.match(/"url":"(\/en\/news\/article\/[^"]+)"/);
        const imgMatch = segment.match(/"thumbnail":\{.+?"url":"([^"]+)"/);

        if (titleMatch && urlMatch && imgMatch) {
          const articleUrl = "https://www.chelseafc.com" + urlMatch[1];
          let rawTitle = titleMatch[1];

          let cleanTitle = rawTitle;
          try {
            cleanTitle = JSON.parse('"' + rawTitle.replace(/"/g, '\\"') + '"');
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

          let img = imgMatch[1].replace("http://", "https://");

          // Extract publication date / timestamp
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
            pubDate: pubDate,
          });
        }
      }
    }

    // Sort newest first
    news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const finalNews = news.length > 0 ? news : getFallbackNews();

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ success: true, items: finalNews });
  } catch (err) {
    console.error("News API Error:", err.message);
    // Never trigger a 500 Function Invocation error
    const fallbackNews = getFallbackNews();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json({ success: true, items: fallbackNews });
  }
}
