const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// We need to find the place after appending the matches and the counter badge
// Then attach the click event to dayEl.
//
//        if (dayMatches.length > 2) {
//          const badge = document.createElement('div');
//          ...
//          dayEl.appendChild(badge);
//        }
//        grid.appendChild(dayEl);
//
html = html.replace(
  /grid\.appendChild\(dayEl\);\n\s*\}\n\s*\}/,
  `
        if (dayMatches.length > 0) {
          dayEl.style.cursor = 'pointer';
          dayEl.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
              // Prevent default so we don't accidentally navigate if clicking on a truncated link
              e.preventDefault();
              window.showMobileMatchOverlay(dayMatches, dateStr);
            }
          });
        }
        grid.appendChild(dayEl);
      }
    }`
);

fs.writeFileSync('index.html', html);
