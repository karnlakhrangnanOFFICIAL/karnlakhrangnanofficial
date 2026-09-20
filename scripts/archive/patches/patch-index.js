const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inside renderCalendar, at the start of the day loop, we know dayMatches.length
// But wait, dayMatches is computed inside the loop.
// Let's find: `const dayMatches = window.allMatchesGlobal.filter(m => m.date === dateStr);`
// And add after it:
// `if (dayMatches.length > 2) { dayEl.classList.add('has-many-matches'); }`

html = html.replace(
  /const dayMatches = window\.allMatchesGlobal\.filter\(m => m\.date === dateStr\);/g,
  `const dayMatches = window.allMatchesGlobal.filter(m => m.date === dateStr);
        if (dayMatches.length > 2) {
          dayEl.classList.add('has-many-matches');
        }`
);

// We should also append the counter badge at the end of the day loop
// Find:
// `dayMatches.forEach(match => {`
// ... loop ...
// `grid.appendChild(dayEl);`

// Let's insert the counter badge before `grid.appendChild(dayEl)`
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

// And we should also add `cal-match-item` to `mEl` so we can target it.
html = html.replace(/const mEl = document\.createElement\('a'\);/g, `const mEl = document.createElement('a');\n          mEl.classList.add('cal-match-item');`);

fs.writeFileSync('index.html', html);
