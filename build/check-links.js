// Verifica links/recursos locais do site gerado.
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..', 'site');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const pages = walk(SITE);
let check = 0, broken = [];

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const base = path.dirname(page);
  const re = /(?:href|src)="([^"#][^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    let target = m[1];
    if (/^https?:\/\//.test(target)) continue;
    if (target.endsWith('/')) target += 'index.html';
    const resolved = path.normalize(path.join(base, target.split(/[?#]/)[0]));
    if (!fs.existsSync(resolved)) {
      broken.push(`${path.relative(SITE, page)} -> ${target}`);
    }
    check++;
  }
}

console.log(`Páginas: ${pages.length}. Links locais verificados: ${check}. Quebrados: ${broken.length}`);
broken.forEach((b) => console.log('  QUEBRADO: ' + b));
process.exit(broken.length ? 1 : 0);