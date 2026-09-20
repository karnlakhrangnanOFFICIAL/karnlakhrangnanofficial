const fs = require('fs');
let code = fs.readFileSync('assets/js/team.js', 'utf8');

code = code.replace(
    /playerImgEl\.src = pImg;/g,
    "playerImgEl.src = pImg;\n      playerImgEl.alt = player.name;"
);

fs.writeFileSync('assets/js/team.js', code);
