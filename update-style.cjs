const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

css = css.replace(/\.league-table th \{[^}]+font-size: 0.65rem;/, match => match.replace('0.65rem', '1.3rem'));
css = css.replace(/\.league-table td \{[^}]+font-size: 0.85rem;/, match => match.replace('0.85rem', '1.7rem'));
css = css.replace(/\.league-table .logo-cell \{[^}]+width: 48px;/, match => match.replace('48px', '72px'));
css = css.replace(/\.league-table \.logo-cell img,\n\.league-table \.table-team-logo \{[^}]+width: 28px !important;\n\s+height: 28px !important;/, match => match.replace('28px', '56px').replace('28px', '56px'));
css = css.replace(/td\.logo-cell,\n\.league-table td\.logo-cell \{[^}]+width: 36px !important;/, match => match.replace('36px', '64px'));
css = css.replace(/td\.logo-cell img,\n\.league-table td\.logo-cell img \{[^}]+width: 24px !important;\n\s+height: 24px !important;\n\s+max-width: 24px !important;\n\s+max-height: 24px !important;/, match => match.replace(/24px/g, '48px'));

fs.writeFileSync('assets/css/style.css', css);
