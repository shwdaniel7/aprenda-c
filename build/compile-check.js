// Compila (no Windows/MinGW) todos os blocos C completos das trilhas 1-3.
// Uso: node build/compile-check.js
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const DIR = path.join(__dirname, 'content');
const TMP = path.join(__dirname, '_tmp');
fs.mkdirSync(TMP, { recursive: true });

const EXCLUIR_MODULOS = new Set(['2.09', '3.08']); // multifile e POSIX sockets (exigem Linux)
const isProg = (s) =>
  typeof s === 'string' && s.includes('#include') && /\bint\s+main\s*\(/.test(s);

let total = 0, ok = 0, falhas = 0;

for (const f of ['t1.js', 't2.js', 't2e.js', 't3.js', 't3e.js']) {
  const mods = require(path.join(DIR, f));
  for (const m of mods) {
    const chave = `${m.trilha}.${m.numero}`;
    if (EXCLUIR_MODULOS.has(chave)) {
      console.log(`${chave} ${m.titulo}: EXCLUÍDO (blocos exigem Linux)`);
      continue;
    }
    const blocos = [];
    (m.secoes || []).forEach((s, i) => {
      if (isProg(s.codigo)) blocos.push({ n: `secao-${i + 1}`, cod: s.codigo });
    });
    const count1 = blocos.length;
    (m.exercicios || []).forEach((e, i) => {
      if (isProg(e.solucao)) blocos.push({ n: `ex-${i + 1}`, cod: e.solucao });
    });
    for (const [bi, b] of blocos.entries()) {
      total++;
      const p = path.join(TMP, `${m.numero}-${bi}-${b.n.replace(/[^a-z0-9]/g, '')}.c`);
      fs.writeFileSync(p, b.cod);
      try {
        execSync(`gcc -Wall -Wextra -std=c11 -pthread "${p}" -o "${p}.exe"`, {
          stdio: ['ignore', 'ignore', 'pipe'],
        });
        ok++;
      } catch (e) {
        falhas++;
        const msgs = (e.stderr || '').toString().split('\n').filter(Boolean).slice(0, 6).join(' | ');
        console.log(`FALHOU ${chave} ${m.titulo} [${b.n}]: ${msgs}`);
      }
    }
    if (blocos.length) console.log(`${chave} ${m.titulo}: ${blocos.length} blocos`);
  }
}

console.log(`\nResultado: ${ok}/${total} compilaram. Falhas: ${falhas}.`);
process.exit(falhas ? 1 : 0);