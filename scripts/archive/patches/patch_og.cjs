const fs = require('fs');

let html = fs.readFileSync('match-detail.html', 'utf8');

// The user is asking to apply style changes to:
// CSS selector 1: main > div#matchContent > div(6) > div(1) > table > tbody > tr(6) > td(4) > div(1) > span > img (This is the icon for Own Goal in the Key Events table)
// CSS selector 2: ... > tr(6) > td(4) > div(1) > strong (This is the text for Own Goal in the Key Events table)
// CSS selector 3: ... > tr(6) > td(5) (This is the description for Own Goal)

// Let's modify getEventIcon and getEventDesc to handle Own Goal and format it differently.
// getEventIcon should return a different icon or styling.
// In getEventDesc, if e.detail === 'Own Goal' it returns 'ทำประตู (Own Goal)' currently. We should make it red?

html = html.replace(/if \(type === 'goal'\) return 'Goal';/, `if (type === 'goal') return 'Goal';
          if (type === 'own_goal') return 'Own Goal';`);

html = html.replace(/case 'goal': return '<img src="databases\/logo\/svg\/goal\.svg"[^>]+>';/, `case 'goal': return '<img src="databases/logo/svg/goal.svg" data-tooltip-th="ทำประตู" data-tooltip-en="Goal" style="width: 24px; height: 24px; object-fit: contain;">';
            case 'own_goal': return '<img src="databases/logo/svg/goal.svg" data-tooltip-th="ทำเข้าประตูตัวเอง" data-tooltip-en="Own Goal" style="width: 24px; height: 24px; object-fit: contain; filter: invert(36%) sepia(93%) saturate(6288%) hue-rotate(344deg) brightness(97%) contrast(105%);">'; // Make the icon red`);

// Modify getEventDesc
html = html.replace(/return e\.detail \? \`ทำประตู \(\$\{e\.detail\}\)\` : 'ทำประตู';/, `if (e.detail === 'Own Goal' || e.type === 'own_goal') return '<span style="color: #f56565; font-weight: bold;">ทำเข้าประตูตัวเอง (Own Goal)</span>';
            return e.detail ? \`ทำประตู (\${e.detail})\` : 'ทำประตู';`);

// Ensure that renderEventItem treats 'goal' with detail 'Own Goal' as 'own_goal' type for rendering
// Wait, we can just intercept it inside renderEventItem.
html = html.replace(/const icon = getEventIcon\(e\.type\);/, `let eType = e.type;
          if (e.type === 'goal' && e.detail === 'Own Goal') eType = 'own_goal';
          const icon = getEventIcon(eType);`);

html = html.replace(/const title = getEventTitle\(e\.type\);/, `const title = getEventTitle(eType);`);
html = html.replace(/const getEventTitle = \(type\) => \{/, `const getEventTitle = (type) => {`);

fs.writeFileSync('match-detail.html', html);
