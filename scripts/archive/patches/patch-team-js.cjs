const fs = require('fs');
let content = fs.readFileSync('assets/js/team.js', 'utf8');

const replacement = `
  container.innerHTML = players.map(p => {
    let pos = p.position || '';
    pos = formatPlayerPosition(p.position, isTh);
    let pImage = p.image || 'assets/images/placeholder-player.svg';
    
    let statusBadge = '';
    let opacity = '1';
    
    if (p.status === 'sold') {
      statusBadge = \`<div style="position:absolute; top:10px; right:10px; background:#c0392b; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1;">\${isTh ? 'ย้ายออก' : 'Sold'}</div>\`;
      opacity = '0.6';
    } else if (p.status === 'loaned_out') {
      statusBadge = \`<div style="position:absolute; top:10px; right:10px; background:#f39c12; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1;">\${isTh ? 'ยืมตัว' : 'Loaned Out'}</div>\`;
    } else if (p.status === 'new_signing') {
      statusBadge = \`<div style="position:absolute; top:10px; right:10px; background:#27ae60; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1;">\${isTh ? 'นักเตะใหม่' : 'New Signing'}</div>\`;
    }

    return \`
      <a href="player-profile.html?id=\${p.id}&team=\${teamType}" class="player-card" style="text-decoration: none; color: inherit; display: block; position:relative; opacity: \${opacity};">
        \${statusBadge}
        <img src="\${pImage}" alt="\${p.name}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/placeholder-player.svg';">
        <div class="player-info">
          <h3>\${p.name}</h3>
          <span class="player-number">#\${p.number || '?'}</span>
          <span class="player-position">\${pos}</span>
          <div class="player-stats">
          \${(() => {
`;

// It's safer to use string replace
content = content.replace(/container\.innerHTML = players\.map\(p => \{\s*let pos = p\.position \|\| '';\s*pos = formatPlayerPosition\(p\.position, isTh\);\s*let pImage = p\.image \|\| 'assets\/images\/placeholder-player\.svg';\s*return `[\s\S]*?<img src="\${pImage}" alt="\${p\.name}" loading="lazy" onerror="this\.onerror=null; this\.src='assets\/images\/placeholder-player\.svg';">\s*<div class="player-info">\s*<h3>\${p\.name}<\/h3>\s*<span class="player-number">#\${p\.number \|\| '\?'}<\/span>\s*<span class="player-position">\${pos}<\/span>\s*<div class="player-stats">\s*\$\{?\(\(\) => \{/m, replacement);

fs.writeFileSync('assets/js/team.js', content);
