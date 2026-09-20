const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// For calendar view matches
html = html.replace(
  /dayMatches\.forEach\(match => \{/g,
  'dayMatches.forEach((match, idx) => {'
);

html = html.replace(
  /mEl\.classList\.add\('cal-match-item'\);/g,
  `mEl.classList.add('cal-match-item');\n          mEl.style.animationDelay = \`\${idx * 0.05}s\`;`
);

// For list view matches
html = html.replace(
  /container\.innerHTML = fixtures\.map\(match => \{/g,
  'container.innerHTML = fixtures.map((match, index) => {'
);

html = html.replace(
  /<a href="match-detail\.html\?id=\$\{match\.id\}" class="card-link">/g,
  '<a href="match-detail.html?id=${match.id}" class="card-link" style="animation-delay: ${index * 0.05}s;">'
);

fs.writeFileSync('index.html', html);
