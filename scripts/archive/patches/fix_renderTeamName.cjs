const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');

const replacement = `function renderTeamNameHTML(teamName, options = {}) {
  if (!teamName) return '';
  const info = getTeamInfo(teamName);
  const lang = options.lang || window.currentLang || 'th';
  const thName = (info && info.th) ? info.th : teamName;
  const enName = (info && info.en) ? info.en : teamName;
  const shortName = (info && info.short) ? info.short : teamName;
  const fullDisplay = lang === 'th' ? thName : enName;
  
  const isChelsea = teamName.toLowerCase().includes('chelsea') || teamName.toLowerCase() === 'kanlakhrangnan';
  const styleStr = isChelsea ? 'color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);' : 'color: #ffffff;';

  return \`<span class="team-name-wrapper" title="\${fullDisplay}">
    <span class="team-name-full" style="\${styleStr}">\${fullDisplay}</span>
    <span class="team-name-short" style="\${styleStr}">\${shortName}</span>
  </span>\`;
}`;

js = js.replace(/function renderTeamNameHTML\(teamName, options = \{\}\) \{[\s\S]*?<\/span>`;\n\}/, replacement);

fs.writeFileSync('assets/js/main.js', js, 'utf8');
console.log('done');
