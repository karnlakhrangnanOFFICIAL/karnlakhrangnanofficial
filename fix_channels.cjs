const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/channelsIcons = match\.channels\.map\(ch => {[\s\S]*?}\)\.join\(''\);/g, `channelsIcons = match.channels.map(ch => {
                let chName = typeof ch === 'string' ? ch : (ch.name || '');
                let iconUrl = (ch && typeof ch === 'object' && ch.logo) ? ch.logo : 'databases/logo/channels/default.png';
                if (!ch.logo) {
                    if (chName.toLowerCase().includes('true')) iconUrl = 'databases/logo/channels/true_premier.png';
                    else if (chName.toLowerCase().includes('bein')) iconUrl = 'databases/logo/channels/bein.png';
                    else if (chName.toLowerCase().includes('pptv')) iconUrl = 'databases/logo/channels/pptv.png';
                    else if (chName.toLowerCase().includes('apple')) iconUrl = 'databases/logo/channels/apple.png';
                }
                return \\\`<img src="\${iconUrl}" class="channel-icon" alt="\${chName}" title="\${chName}" onerror="this.style.display='none'">\\\`;
            }).join('');`);

fs.writeFileSync('index.html', html);
