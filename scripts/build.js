import fs from 'fs';
import path from 'path';

function minifyJS(code) {
  return code
    .replace(/(^|[^\:\x27"])\/\/.*$/gm, '$1')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([\{\}\(\);,=\+\-\*\/><!?:&|])\s*/g, '$1')
    .trim();
}

function minifyCSS(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([\{\};:,])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim();
}

try {
  const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
  const teamJs = fs.readFileSync('assets/js/team.js', 'utf8');
  const bundledJs = mainJs + '\n;\n' + teamJs;
  const minifiedJs = minifyJS(bundledJs);
  fs.writeFileSync('assets/js/app.bundle.min.js', minifiedJs, 'utf8');
  console.log(`[Build] JS bundled & minified: ${bundledJs.length} -> ${minifiedJs.length} bytes`);

  const css = fs.readFileSync('assets/css/style.css', 'utf8');
  const minifiedCss = minifyCSS(css);
  fs.writeFileSync('assets/css/style.min.css', minifiedCss, 'utf8');
  console.log(`[Build] CSS minified: ${css.length} -> ${minifiedCss.length} bytes`);
} catch (err) {
  console.error('[Build Error]', err);
  process.exit(1);
}
