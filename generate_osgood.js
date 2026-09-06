import * as cheerio from 'cheerio';
import fs from 'fs';

async function run() {
  const url = 'https://en.wikipedia.org/wiki/Peter_Osgood';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const $ = cheerio.load(text);
  
  let currentHeading = 'Introduction';
  const sections = {
      'Introduction': [],
      'Personal life': [],
      'Chelsea': [],
      'Southampton, Norwich and return to Chelsea': [],
      'England': [],
      'Retirement': []
  };
  
  $('p, h2, h3').each((i, el) => {
      if ($(el).is('h2') || $(el).is('h3')) {
          const text = $(el).text().replace(/\[.*?\]/g, '').trim();
          if (sections[text] !== undefined) {
              currentHeading = text;
          } else if (text === 'Playing career') {
              // skip
          } else {
              currentHeading = null;
          }
      } else if (currentHeading && $(el).is('p')) {
          const txt = $(el).text().replace(/\[\d+\]/g, '').trim();
          if (txt.length > 50) {
              sections[currentHeading].push(`<p>${txt}</p>`);
          }
      }
  });

  let bioHtml = '';
  
  for (const [key, paragraphs] of Object.entries(sections)) {
      if (paragraphs.length === 0) continue;
      
      if (key === 'Introduction') {
          bioHtml += `<h2 style="font-family: var(--font-heading); color: var(--blue-dark); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;" data-lang-th="บทนำ" data-lang-en="Introduction">Introduction</h2>\n`;
      } else {
          bioHtml += `<h2 style="font-family: var(--font-heading); color: var(--blue-dark); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem; margin-top: 2rem;">${key}</h2>\n`;
      }
      bioHtml += paragraphs.join('\n') + '\n';
  }

  // Build the complete HTML
  const templateHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Peter Osgood - KANLAKHRANGNAN Official</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="icon" href="../assets/images/karnlakhrangnan-logo.png" type="image/svg+xml">
  <style>
    /* Custom hero style for i-cons */
    .icon-hero {
      background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 100%);
      padding: 6rem 2rem 3rem;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .icon-hero::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('../databases/logo/national/eng.svg') no-repeat center;
      background-size: 50%;
      opacity: 0.05;
      z-index: 0;
    }
    .icon-hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
    }
    .icon-image-wrapper {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1.5rem;
      border: 4px solid var(--gold);
      background: var(--surface);
    }
    .icon-image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .icon-name {
      font-size: 2.5rem;
      font-family: var(--font-heading);
      margin-bottom: 0.5rem;
    }
    .icon-subtitle {
      font-size: 1.2rem;
      color: var(--gold);
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .icon-stats-bar {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1.5rem;
      background: rgba(0,0,0,0.2);
      padding: 1rem;
      border-radius: 12px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }
    .stat-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.8;
    }
    .bio-content {
      max-width: 800px;
      margin: 3rem auto;
      line-height: 1.8;
      font-size: 1.05rem;
      color: var(--text-color);
    }
    .bio-content p {
      margin-bottom: 1.5rem;
    }
    .bio-content p:first-letter {
      font-size: 3rem;
      float: left;
      line-height: 1;
      margin-right: 8px;
      color: var(--blue);
      font-family: var(--font-heading);
    }
  </style>
</head>
<body>

  <!-- ==================== NAVIGATION ==================== -->
  <nav class="navbar">
    <div class="nav-container">
      <a href="../index.html" class="nav-logo">
        <img src="../assets/images/karnlakhrangnan-logo.png" alt="KANLAKHRANGNAN Logo">
        <span class="team-name">KARNLAKHRANgNAN</span>
      </a>
      <div class="hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </div>
      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html" data-i18n="nav.home">หน้าแรก</a></li>
        <li><a href="../men-team.html" data-i18n="nav.men_team">ทีมชาย</a></li>
        <li><a href="../women-team.html" data-i18n="nav.women_team">ทีมหญิง</a></li>
        <li><a href="../trophy.html" data-i18n="nav.trophy">ถ้วยรางวัล</a></li>
        <li><a href="../icons.html" class="active" data-i18n="nav.icons">i-Cons</a></li>
        <li><a href="../the-story-blue.html" data-i18n="nav.story">The Story Blue</a></li>
        <li><a href="../about.html" data-i18n="nav.about">About Us</a></li>
        <li><a href="../transfers.html" data-i18n="nav.transfers">Transfers</a></li>
        <li><a href="#" class="lang-toggle" id="langToggle" data-i18n="nav.lang_toggle">EN</a></li>
      </ul>
    </div>
  </nav>

  <!-- ==================== ICON HERO ==================== -->
  <section class="icon-hero">
    <div class="icon-hero-content">
      <div class="icon-image-wrapper">
        <img src="../assets/images/players/peter-osgood/profile.webp" alt="Peter Osgood" onerror="this.src='../assets/images/placeholder-player.svg'">
      </div>
      <h1 class="icon-name">Peter Osgood</h1>
      <div class="icon-subtitle">"The King of Stamford Bridge" · Forward</div>
      <div class="icon-stats-bar">
        <div class="stat-item">
          <span class="stat-value">1964-1979</span>
          <span class="stat-label" data-lang-th="ช่วงเวลา" data-lang-en="Period">Period</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">380</span>
          <span class="stat-label" data-lang-th="ลงเล่น" data-lang-en="Appearances">Appearances</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">150</span>
          <span class="stat-label" data-lang-th="ประตู" data-lang-en="Goals">Goals</span>
        </div>
        <div class="stat-item">
          <span class="stat-value"><img src="../databases/logo/national/eng.svg" style="width: 24px; vertical-align: middle;" alt="England"></span>
          <span class="stat-label" data-lang-th="สัญชาติ" data-lang-en="Nationality">England</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== MAIN CONTENT ==================== -->
  <main class="main-container">
    <div style="margin-bottom: 2rem;">
      <a href="../icons.html" class="back-link">← กลับหน้า i-Cons</a>
    </div>

    <div class="bio-content">
      ${bioHtml}
    </div>
  </main>

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="../assets/images/karnlakhrangnan-logo.png" alt="kanlakhrangnan logo" style="height:40px;">
        <span>KARN LA KHRANG NAN</span>
      </div>
      <p>© 2026 <span>KARN LA KHRANG NAN Official</span>. All Rights Reserved.</p>
      <p class="footer-disclaimer">This is an unofficial fan website. Not affiliated with Chelsea FC.</p>
    </div>
  </footer>

  <script src="../assets/js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync('icon/peter-osgood-eng.html', templateHtml);
  console.log("Created icon/peter-osgood-eng.html");
}

run();
