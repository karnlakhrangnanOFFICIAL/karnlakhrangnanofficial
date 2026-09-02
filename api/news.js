export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.chelseafc.com/en/news/latest-news-all');
    let html = await response.text();
    html = html.replace(/&quot;/g, '\"');
    
    const articles = html.split('\"type\":\"Article\"');
    const news = [];
    
    for (let i=1; i<articles.length; i++) {
      const segment = articles[i].substring(0, 1000);
      const titleMatch = articles[i-1].match(/\"title\":\"([^\"]+)\",$/);
      const urlMatch = segment.match(/\"url\":\"(\/en\/news\/article\/[^\"]+)\"/);
      const imgMatch = segment.match(/\"thumbnail\":\{.+?\"url\":\"([^\"]+)\"/);
      
      if (titleMatch && urlMatch && imgMatch && !news.find(n => n.title === titleMatch[1])) {
        // Clean up title encoding if needed
        let title = titleMatch[1].replace(/\\u2019/g, "'").replace(/\\u2018/g, "'").replace(/\\u0027/g, "'");
        // Convert http image to https to avoid mixed content
        let img = imgMatch[1].replace('http://', 'https://');
        
        news.push({ 
          title: title, 
          link: 'https://www.chelseafc.com' + urlMatch[1], 
          thumbnail: img 
        });
      }
      
      if (news.length >= 10) break; // Limit to 10 latest news
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ success: true, items: news });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
