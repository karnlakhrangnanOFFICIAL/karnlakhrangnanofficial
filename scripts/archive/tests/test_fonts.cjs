const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');
if (css.includes('font-size: 14pt')) {
    console.log("Font size is 14pt");
}
