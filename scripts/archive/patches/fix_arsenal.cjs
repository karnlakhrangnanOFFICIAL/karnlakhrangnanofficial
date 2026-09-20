const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');

const target = `  const isChelsea = teamName.toLowerCase().includes('chelsea') || teamName.toLowerCase() === 'kanlakhrangnan';
  const styleStr = isChelsea ? 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);' : 'color: #ffffff;';

  return \`<span class="team-name-wrapper" title="\${fullDisplay}">
    <span class="team-name-full" style="\${styleStr}">\${fullDisplay}</span>
    <span class="team-name-short" style="\${styleStr}">\${shortName}</span>
  </span>\`;`;

const replacement = `  const isChelsea = teamName.toLowerCase().includes('chelsea') || teamName.toLowerCase() === 'kanlakhrangnan';
  const isArsenal = teamName.toLowerCase().includes('arsenal');
  
  let styleStr = 'color: #ffffff !important;';
  if (isChelsea) {
      styleStr = 'color: #D4AF37 !important; font-weight: 800 !important; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4) !important;';
  } else if (isArsenal) {
      styleStr = 'color: #ffffff !important; font-weight: normal !important; text-shadow: none !important;';
  }

  return \`<span class="team-name-wrapper" title="\${fullDisplay}">
    <span class="team-name-full" style="\${styleStr}">\${fullDisplay}</span>
    <span class="team-name-short" style="\${styleStr}">\${shortName}</span>
  </span>\`;`;

js = js.replace(target, replacement);
fs.writeFileSync('assets/js/main.js', js, 'utf8');
console.log('done fixing arsenal');
