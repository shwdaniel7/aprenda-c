// Valida o schema de build/content/*.js antes do build.
// Uso: node build/validate.js

const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, 'content');
const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.js'))
  .sort();

let erros = 0;
let avisos = 0;

function err(msg) {
  erros++;
  console.log('  [ERRO] ' + msg);
}
function aviso(msg) {
  avisos++;
  console.log('  [aviso] ' + msg);
}

for (const [fi, f] of files.entries()) {
  const mods = require(path.join(DIR, f));
  console.log(`\n== ${f} ==`);
  if (!Array.isArray(mods)) {
    err(f + ': export não é array');
    continue;
  }
  for (const m of mods) {
    const rot = `${m.trilha}.${m.numero} ${m.titulo} (${f})`;
    if (!m.trilha) err(rot + ': sem trilha');
    if (!m.numero) err(rot + ': sem numero');
    if (!m.titulo) err(rot + ': sem titulo');
    if (!m.objetivo) err(rot + ': sem objetivo');
    if (!Array.isArray(m.secoes) || !m.secoes.length) err(rot + ': sem secoes');
    (m.secoes || []).forEach((s, i) => {
      if (!s.titulo) err(`${rot} secao[${i}]: sem titulo`);
      if (s.codigo !== undefined && typeof s.codigo !== 'string') err(`${rot} secao[${i}]: codigo não-string`);
      if (s.codigo && !s.codigo.includes('main')) aviso(`${rot} secao[${i}] "${s.titulo}": codigo sem main?`);
      if (s.saida !== undefined && typeof s.saida !== 'string') err(`${rot} secao[${i}]: saida não-string`);
    });
    if (!Array.isArray(m.exercicios) || !m.exercicios.length) aviso(rot + ': sem exercicios');
    (m.exercicios || []).forEach((e, i) => {
      if (!e.enunciado) err(`${rot} ex[${i}]: sem enunciado`);
      if (!e.solucao) err(`${rot} ex[${i}]: sem solucao`);
      if (e.nivel && (e.nivel < 1 || e.nivel > 5)) err(`${rot} ex[${i}]: nivel fora de 1..5`);
    });
    (m.quiz || []).forEach((q, i) => {
      if (!q.pergunta) err(`${rot} quiz[${i}]: sem pergunta`);
      if (!Array.isArray(q.opcoes) || q.opcoes.length !== 4) err(`${rot} quiz[${i}]: opcoes != 4`);
      if (typeof q.correta !== 'number' || q.correta < 0 || q.correta >= (q.opcoes || []).length)
        err(`${rot} quiz[${i}]: correta fora do range`);
    });
    if (m.projeto) {
      if (!m.projeto.titulo || !m.projeto.descricao) err(rot + ': projeto incompleto');
    }
  }
}

console.log(`\nTotal: ${files.length} arquivos. Erros: ${erros}. Avisos: ${avisos}.`);
process.exit(erros ? 1 : 0);