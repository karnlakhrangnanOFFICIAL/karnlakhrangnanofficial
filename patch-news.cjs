const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Insert HTML
html = html.replace(
  /<!-- ==================== MAIN CONTENT ==================== -->\n\s*<main class="main-container">/,
  `<!-- ==================== MAIN CONTENT ==================== -->
  <main class="main-container">
    
    <!-- NEWS CAROUSEL SECTION -->
    <div id="newsCarouselContainer" style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.25rem; font-family: var(--font-heading); margin-bottom: 1rem; color: var(--text-color);" data-i18n="nav.news">News</h2>
      <div id="newsCarousel" style="display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding-bottom: 1rem; scrollbar-width: none; -ms-overflow-style: none;">
        <style>#newsCarousel::-webkit-scrollbar { display: none; }</style>
        <div style="padding: 1rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-muted); width: 100%;">
          Loading latest news...
        </div>
      </div>
    </div>`
);

// Insert fetchNews function and call it
const fetchNewsFunc = `
    async function fetchChelseaNews() {
      const carousel = document.getElementById('newsCarousel');
      if (!carousel) return;
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://talkchelsea.net/feed/');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          let html = '';
          data.items.slice(0, 10).forEach((item, index) => {
            const thumbnail = item.thumbnail || 'assets/images/placeholder-team.svg';
            const pubDate = new Date(item.pubDate).toLocaleDateString(window.currentLang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            
            html += \`
              <a href="\${item.link}" target="_blank" class="card-link" style="text-decoration: none; display: block; flex: 0 0 280px; scroll-snap-align: start; animation-delay: \${index * 0.05}s;">
                <div class="card" style="height: 100%; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: var(--card-bg);">
                  <div style="height: 150px; overflow: hidden; background: var(--blue-dark); position: relative;">
                    <img src="\${thumbnail}" alt="" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/placeholder-team.svg'">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 20px 12px 8px;">
                      <span style="color: #fff; font-size: 0.7rem; background: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-weight: bold;">NEWS</span>
                    </div>
                  </div>
                  <div style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                    <h3 style="font-size: 0.95rem; line-height: 1.4; margin-bottom: 8px; color: var(--text-color); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">\${item.title}</h3>
                    <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
                      <span>📅</span> <span>\${pubDate}</span>
                    </div>
                  </div>
                </div>
              </a>
            \`;
          });
          carousel.innerHTML = html;
        } else {
          carousel.innerHTML = '<div style="padding: 1rem; color: var(--text-muted);">No news available at the moment.</div>';
        }
      } catch (err) {
        console.error('Error loading news:', err);
        carousel.innerHTML = '<div style="padding: 1rem; color: var(--text-muted);">Failed to load news.</div>';
      }
    }
`;

html = html.replace(
  /document\.addEventListener\('DOMContentLoaded', \(\) => \{/,
  fetchNewsFunc + '\n    document.addEventListener(\'DOMContentLoaded\', () => {'
);
html = html.replace(
  /loadAllData\(\);\n\s*\}\);/,
  `loadAllData();
      fetchChelseaNews();
    });`
);

fs.writeFileSync('index.html', html);
