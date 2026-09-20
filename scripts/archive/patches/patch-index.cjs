const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add class to completed matches
html = html.replace(/<span class="team-name"/g, '<span class="team-name cal-team-name"');

// Add class to upcoming matches
html = html.replace(/<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px;">\$\{oppName\}<\/span>/g, '<span class="cal-team-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px;">${oppName}</span>');

html = html.replace(
  /const dayMatches = window\.allMatchesGlobal\.filter\(m => m\.date === dateStr\);/g,
  `const dayMatches = window.allMatchesGlobal.filter(m => m.date === dateStr);
        if (dayMatches.length > 2) {
          dayEl.classList.add('has-many-matches');
        }`
);

// We should also append the counter badge at the end of the day loop
html = html.replace(
  /grid\.appendChild\(dayEl\);\n\s*\}\n\s*\}/g,
  `
        if (dayMatches.length > 2) {
          const badge = document.createElement('div');
          badge.className = 'mobile-match-counter';
          const lang = window.currentLang || 'th';
          badge.textContent = lang === 'en' ? dayMatches.length + ' Matches' : dayMatches.length + ' นัด';
          dayEl.appendChild(badge);
        }
        grid.appendChild(dayEl);
      }
    }`
);

html = html.replace(/const mEl = document\.createElement\('a'\);/g, `const mEl = document.createElement('a');\n          mEl.classList.add('cal-match-item');`);

fs.writeFileSync('index.html', html);
