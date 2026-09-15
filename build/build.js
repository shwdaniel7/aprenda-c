// Gerador do site "Aprenda C"
// Uso: node build/build.js
// Lê os arquivos de conteúdo em build/content/*.js e emite HTML estático em site/.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(__dirname, 'content');
const SITE_DIR = path.join(ROOT, 'site');
const ASSETS_DIR = path.join(SITE_DIR, 'assets');

// ---------------------------------------------------------------------------
// utilidades
// ---------------------------------------------------------------------------

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slug(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const TRILHAS = {
  '0': {
    nome: 'Setup', cor: '#9aa0a6', icone: '🛠️',
    desc: 'Prepare seu ambiente: gcc, editor, terminal e depuração. Feita esta trilha, você consegue compilar e rodar qualquer exemplo do curso.',
  },
  '1': {
    nome: 'Fundamentos', cor: '#3b82f6', icone: '🌱',
    desc: 'Da História do C até funções e organização de programas. Todo o básico para escrever programas sólidos em C.',
  },
  '2': {
    nome: 'Intermediário', cor: '#f59e0b', icone: '🚀',
    desc: 'Ponteiros, strings, memória dinâmica, structs, pré-processador, bitwise e recursão. Aqui o C faz "clic".',
  },
  '3': {
    nome: 'Avançado', cor: '#8b5cf6', icone: '🧠',
    desc: 'Stdlib, erros, Unicode, signals, threads, atomics, sockets e programação de baixo nível.',
  },
  '4': {
    nome: 'Cyber', cor: '#ef4444', icone: '🛡️',
    desc: 'Ofensiva + defensiva: codificação segura, anatomia de memória, buffer overflow, ROP, format strings, shellcode e redes em C.',
  },
};

function readContent() {
  const files = ['t0.js', 't1.js', 't2.js', 't2e.js', 't3.js', 't3e.js', 't4.js'].filter((f) =>
    fs.existsSync(path.join(CONTENT_DIR, f))
  );
  const modules = [];
  for (const f of files) {
    const mods = require(path.join(CONTENT_DIR, f));
    modules.push(...mods);
  }
  return modules;
}

function attrEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// blocos HTML reutilizáveis
// ---------------------------------------------------------------------------

function pageShell(title, body, opts = {}) {
  const base = opts.base == null ? '../' : opts.base;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Aprenda C</title>
<link rel="stylesheet" href="${base}assets/css/style.css">
</head>
<body data-trilha="${esc(opts.active || '')}">
<header class="site-header">
  <a class="brand" href="${base}index.html">⌘ Aprenda <b>C</b></a>
  <nav class="top-nav">
    <a href="${base}index.html">Roadmap</a>
    <a href="${base}exercicios/index.html">Exercícios</a>
    <a href="${base}projetos/index.html">Projetos</a>
  </nav>
</header>
${body}
<footer class="site-footer">
  <p>Aprenda C — guia progressivo com Beej's Guide, King e conteúdo original.</p>
</footer>
<script src="${base}assets/js/progress.js"></script>
<script src="${base}assets/js/highlight.js"></script>
<script src="${base}assets/js/quiz.js"></script>
</body>
</html>`;
}

function modPath(m) {
  return `${m.trilhaSlug}/${m.slug}.html`;
}

function moduloCard(m, done) {
  return `<a class="mod-card${done ? ' done' : ''}" href="${modPath(m)}" data-mod="${esc(m.id)}">
  <span class="mod-num">${m.trilha}.${m.numero}</span>
  <span class="mod-titulo">${esc(m.titulo)}</span>
  <span class="mod-status">${done ? '✓' : '○'}</span>
</a>`;
}

function chip(texto) {
  return `<span class="chip">${esc(texto)}</span>`;
}

function codeBlock(codigo, rotulo) {
  if (!codigo) return '';
  return `<div class="code-block">
  <div class="code-head"><span>${rotulo ? 'Código — ' + esc(rotulo) : 'Código'}</span><button class="copy-btn" type="button">copiar</button></div>
  <pre class="code"><code class="language-c">${esc(codigo)}</code></pre>
</div>`;
}

function outputBlock(saida) {
  if (!saida) return '';
  return `<div class="output-block">
  <div class="code-head"><span>Saída esperada</span></div>
  <pre class="output"><code>${esc(saida)}</code></pre>
</div>`;
}

// ---------------------------------------------------------------------------
// página de módulo
// ---------------------------------------------------------------------------

function renderModulo(m, prev, next) {
  const secs = (m.secoes || [])
    .map((s, i) => {
      const paras = (s.paragrafos || []).map((p) => `<p>${p}</p>`).join('\n');
      const lista = s.lista
        ? `<ul>${s.lista.map((li) => `<li>${li}</li>`).join('\n')}</ul>`
        : '';
      const cod = codeBlock(s.codigo, s.rotulo);
      const saida = outputBlock(s.saida);
      return `<section class="card secao">
  <h2>${esc(s.titulo)}</h2>
  ${paras}
  ${lista}
  ${cod}
  ${saida}
</section>`;
    })
    .join('\n');

  const leitura = (() => {
    if (!m.leitura) return '';
    const beej = m.leitura.beej
      ? `<p><strong>Beej's Guide:</strong> ${esc(m.leitura.beej)}</p>`
      : '';
    const king = m.leitura.king
      ? `<p><strong>King (livro em PDF):</strong> ${esc(m.leitura.king)}</p>`
      : '';
    const foco = m.leitura.foco
      ? `<p class="foco"><strong>Foco da leitura:</strong> ${m.leitura.foco}</p>`
      : '';
    return `<section class="card leitura">
  <h2>📖 Leitura guiada</h2>
  ${beej}
  ${king}
  ${foco}
</section>`;
  })();

  const exs = (m.exercicios || [])
    .map((e, i) => {
      const dica = e.dica ? `<p class="dica"><strong>Dica:</strong> ${e.dica}</p>` : '';
      const sol = e.solucao
        ? `<details class="solucao"><summary>Ver solução</summary><pre class="code"><code class="language-c">${esc(e.solucao)}</code></pre>
        ${e.solucao_obs ? `<p class="obs">${e.solucao_obs}</p>` : ''}</details>`
        : '';
      return `<div class="exercicio" id="ex-${i + 1}" data-mod="${esc(m.id)}">
  <div class="ex-head">
    <span class="badge badge-nivel n${esc(String(e.nivel || 1))}">Nível ${e.nivel}</span>
    <span class="ex-actions"><label class="check-ex"><input type="checkbox" class="ex-done"> concluído</label></span>
  </div>
  <p class="num-ex">Exercício ${m.trilha}.${m.numero}.${i + 1}</p>
  <p class="enunciado">${e.enunciado}</p>
  ${dica}
  ${sol}
</div>`;
    })
    .join('\n');

  const quiz = m.quiz && m.quiz.length ? `
<section class="card quiz-card" data-quiz-json='${attrEsc(JSON.stringify(m.quiz))}'>
  <h2>❓ Verificação rápida</h2>
  <div class="quiz-root"></div>
</section>` : '';

  const projeto = m.projeto
    ? `<section class="card projeto">
  <h2>🏗️ Miniprojeto: ${esc(m.projeto.titulo)}</h2>
  <p>${m.projeto.descricao}</p>
  ${m.projeto.criterios ? `<div class="criterios"><h3>Critérios de aceite</h3><ul>${m.projeto.criterios.map((c) => `<li>${c}</li>`).join('')}</ul></div>` : ''}
</section>`
    : '';

  const nav = (() => {
    const p = prev ? `<a class="btn nav-prev" href="${prev.slug}.html">← ${prev.trilha}.${prev.numero} ${esc(prev.titulo)}</a>` : '';
    const n = next ? `<a class="btn nav-next" href="${next.slug}.html">${next.trilha}.${next.numero} ${esc(next.titulo)} →</a>` : '';
    return `<nav class="mod-nav">${p}${n}</nav>`;
  })();

  const trilhaInfo = TRILHAS[m.trilha];

  const body = `<main class="modulo">
  <nav class="breadcrumb"><a href="../index.html">Roadmap</a> / <a href="../index.html#t${m.trilha}">Trilha ${m.trilha} — ${trilhaInfo.nome}</a> / ${esc(m.titulo)}</nav>

  <header class="mod-header">
    <div class="mod-cab NUM">${m.trilha}.${m.numero}</div>
    <h1>${esc(m.titulo)}</h1>
    <p class="subtitulo">${esc(m.subtitulo || '')}</p>
    <div class="chips">
      ${chip('Nível: ' + (m.nivel || '—'))}
      ${chip('Duração: ' + (m.duracao || '—'))}
      ${chip('Pré-requisitos: ' + (m.prerequisitos || 'nenhum'))}
    </div>
    <button class="btn btn-done" data-mod="${esc(m.id)}">Marcar concluído</button>
  </header>

  <section class="card objetivos">
    <h2>🎯 Objetivos</h2>
    <p>${m.objetivo}</p>
  </section>

  ${leitura}
  ${secs}
  ${exs ? `<section class="card exs"><h2>✏️ Exercícios</h2>${exs}</section>` : ''}
  ${quiz}
  ${projeto}
  ${nav}
  <div class="mod-nav done-nav"><button class="btn btn-done" data-mod="${esc(m.id)}">Marcar concluído</button></div>
</main>`;

  return pageShell(`${m.trilha}.${m.numero} — ${m.titulo}`, body, { active: m.trilha });
}

// ---------------------------------------------------------------------------
// index / roadmap
// ---------------------------------------------------------------------------

function renderIndex(modules) {
  const porTrilha = {};
  for (const m of modules) {
    (porTrilha[m.trilha] = porTrilha[m.trilha] || []).push(m);
  }

  const cardBase = (m) => `<a class="mod-card" href="${modPath(m)}" data-mod="${esc(m.id)}">
  <span class="mod-num">${m.trilha}.${m.numero}</span>
  <span class="mod-titulo">${esc(m.titulo)}</span>
  <span class="mod-status">○</span>
</a>`;

  const trilhasHTML = Object.keys(TRILHAS)
    .sort()
    .map((k) => {
      const info = TRILHAS[k];
      const mods = porTrilha[k] || [];
      const cards = mods.map(cardBase).join('\n');
      const total = mods.length;
      return `<section class="trilha" id="t${k}">
  <header class="trilha-head">
    <span class="trilha-icone">${info.icone}</span>
    <div>
      <h2>Trilha ${k}: ${info.nome}</h2>
      <p class="trilha-desc">${info.desc}</p>
    </div>
    <div class="progresso" data-trilha="${k}"><div class="barra"><span class="barra-fill" style="background:${info.cor}"></span></div><span class="pct">0/${total}</span></div>
  </header>
  <div class="mod-grid">${cards}</div>
</section>`;
    })
    .join('\n');

  const body = `<main class="landing">
  <section class="hero">
    <h1>⌘ Aprenda <b>C</b></h1>
    <p class="tagline">Do zero ao avançado, com trilha de <b>Cyber</b> — conteúdo original + Beej's Guide + King.</p>
    <div class="hero-actions">
      <a class="btn" href="#roadmap">Começar agora ↓</a>
      <a class="btn ghost" href="#fontes">Fontes externas</a>
    </div>
  </section>

  <section class="card como-usar">
    <h2>Como usar este site</h2>
    <ol>
      <li>Comece pela <a href="#t0">Trilha 0 (Setup)</a> para deixar seu ambiente pronto (você já tem gcc).</li>
      <li>Avance pelos módulos em ordem. Cada um tem teoria, exemplos compiláveis, leitura guiada (Beej/King), exercícios com solução e um quiz.</li>
      <li>Compile e rode os exemplos com o gcc (ex.: <code>gcc prog.c -o prog && ./prog</code>). No Windows use <code>prog.exe</code>.</li>
      <li>Marque os módulos como concluídos — seu progresso fica salvo neste navegador.</li>
      <li>A Trilha 4 (Cyber) exige Linux: veja o <a href="${porTrilha['4'] && porTrilha['4'][0] ? modPath(porTrilha['4'][0]) : '#t4'}">primeiro módulo da trilha</a> para montar WSL2 ou uma VM.</li>
    </ol>
  </section>

  <section class="roadmap" id="roadmap">
    ${trilhasHTML}
  </section>

  ${renderCargaHoraria(modules)}

  <section class="card fontes" id="fontes">
    <h2>📚 Fontes externas (gratuitas e recomendadas)</h2>
    <ul>
      <li><a href="https://beej.us/guide/bgc/" target="_blank" rel="noopener">Beej's Guide to C</a> — principal tutorial deste curso (você também tem o .html salvo).</li>
      <li><a href="http://knking.com/books/c2/" target="_blank" rel="noopener">C Programming: A Modern Approach (King)</a> — seu PDF; referência teórica profunda.</li>
      <li><a href="https://en.cppreference.com/w/c" target="_blank" rel="noopener">cppreference</a> — referência completa da linguagem e da stdlib.</li>
      <li><a href="https://learn-c.org/" target="_blank" rel="noopener">learn-c.org</a> — tutoriais interativos rápidos.</li>
      <li><a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener">CS50 (Harvard)</a> — curso gratuito que ensina C em contexto.</li>
      <li><a href="https://exercism.org/tracks/c" target="_blank" rel="noopener">Exercism – C</a> — exercícios com mentoria.</li>
      <li><a href="https://pwn.college/" target="_blank" rel="noopener">pwn.college</a> — trilha de segurança/binary exploitation.</li>
      <li><a href="https://exploit.education/" target="_blank" rel="noopener">Exploit Education</a> — labs Phoenix/Protostar/Nebula.</li>
      <li><a href="https://github.com/RPISEC/MBE" target="_blank" rel="noopener">RPISEC Modern Binary Exploitation</a> — curso gratuito de exploit dev.</li>
      <li><a href="https://www.youtube.com/@LiveOverflow" target="_blank" rel="noopener">LiveOverflow (YouTube)</a> — vídeos de binary exploitation.</li>
      <li><a href="https://beej.us/guide/bgnet/" target="_blank" rel="noopener">Beej's Guide to Network Programming</a> — sockets em C.</li>
      <li>Livros clássicos: <em>The C Programming Language</em> (K&amp;R), <em>Hacking: The Art of Exploitation</em>, <em>The Shellcoder's Handbook</em>.</li>
    </ul>
  </section>
</main>`;

  return pageShell('Roadmap', body, { base: '' });
}

// carga horária estimada ---------------------------------------------------

function horasDe(d) {
  const s = String(d || '');
  const mm = s.match(/(\d+)\s*min/);
  if (mm) return parseFloat(mm[1]) / 60;
  const hh = s.match(/(\d+)\s*h\s*(\d{1,2})?\s*min/);
  if (hh) return parseFloat(hh[1]) + (hh[2] ? parseFloat(hh[2]) / 60 : 0);
  const dec = s.match(/(\d+)[,.](\d+)/);
  if (dec) return parseFloat(dec[1] + '.' + dec[2]);
  const int = s.match(/(\d+)/);
  return int ? parseFloat(int[1]) : 0;
}

const EX_MIN = { 1: 7, 2: 12, 3: 20, 4: 35, 5: 50 };
const PROJ_RANGE = { '0': [0.5, 1], '1': [1, 2], '2': [1, 2.5], '3': [1.5, 3], '4': [2, 5] };

function praticaPorTrilha(modules, k) {
  const mods = modules.filter((m) => m.trilha === k);
  let exMin = 0;
  let qzMin = 0;
  let projL = 0;
  let projH = 0;
  for (const m of mods) {
    for (const e of m.exercicios || []) exMin += EX_MIN[String(e.nivel)] || 12;
    qzMin += (m.quiz || []).length * 2.5;
    if (m.projeto) {
      const r = PROJ_RANGE[k] || [1, 2];
      projL += r[0];
      projH += r[1];
    }
  }
  const base = (exMin + qzMin) / 60;
  return [base + projL, base + projH];
}

function renderCargaHoraria(modules) {
  const linhas = Object.keys(TRILHAS)
    .sort()
    .map((k) => {
      const mods = modules.filter((m) => m.trilha === k);
      const aulas = mods.reduce((s, m) => s + horasDe(m.duracao), 0);
      const p = praticaPorTrilha(modules, k);
      return { k, nome: TRILHAS[k].nome, n: mods.length, aulas, p1: p[0], p2: p[1] };
    });
  const totn = linhas.reduce((s, l) => s + l.n, 0);
  const tota = linhas.reduce((s, l) => s + l.aulas, 0);
  const totp1 = linhas.reduce((s, l) => s + l.p1, 0);
  const totp2 = linhas.reduce((s, l) => s + l.p2, 0);
  const fmt = (x) => {
    if (x < 1) return Math.max(5, Math.round((x * 60) / 5) * 5) + ' min';
    const v = Math.round(x * 10) / 10;
    return String(v).replace('.', ',') + 'h';
  };
  const rows = linhas
    .map(
      (l) => `<tr>
  <td>Trilha ${l.k}: ${esc(l.nome)}</td>
  <td>${l.n}</td>
  <td>${fmt(l.aulas)}</td>
  <td>${fmt(l.p1)}–${fmt(l.p2)}</td>
  <td>${fmt(l.aulas + l.p1)} – ${fmt(l.aulas + l.p2)}</td>
</tr>`
    )
    .join('\n');
  return `<section class="card carga" id="carga">
  <h2>⏱️ Carga horária estimada</h2>
  <table class="tabela-carga">
    <thead><tr><th>Trilha</th><th>Módulos</th><th>Aulas (site)</th><th>Prática</th><th>Total estimado</th></tr></thead>
    <tbody>
${rows}
<tr class="total"><td>TOTAL</td><td>${totn}</td><td>${fmt(tota)}</td><td>${fmt(totp1)}–${fmt(totp2)}</td><td>${fmt(tota + totp1)} – ${fmt(tota + totp2)}</td></tr>
    </tbody>
  </table>
  <p class="carga-rodape">Aulas = tempo médio só da página (teoria, exemplos e quiz); a leitura guiada de Beej/King é opcional e não entra na conta. Prática = exercícios, quizzes e projetos, estimados pelo nível de cada um. Na média, o curso completo (incluindo a Trilha Cyber) fica em ~150–220h — com 8–10h/semana, ≈ 4–6 meses; só as trilhas 1–3, para "saber C de verdade", ≈ 3–4 meses.</p>
</section>`;
}

// ---------------------------------------------------------------------------
// índices de exercícios e projetos
// ---------------------------------------------------------------------------

function renderExercicios(modules) {
  const groups = modules
    .filter((m) => m.exercicios && m.exercicios.length)
    .map((m) => {
      const exs = m.exercicios
        .map((e, i) => `<div class="exercicio">
  <div class="ex-head"><span class="badge badge-nivel n${esc(String(e.nivel || 1))}">Nível ${e.nivel}</span></div>
  <p class="num-ex">${m.trilha}.${m.numero}.${i + 1} — <a href="../${modPath(m)}#ex-${i + 1}">${esc(m.titulo)}</a></p>
  <p class="enunciado">${e.enunciado}</p>
  ${e.dica ? `<p class="dica"><strong>Dica:</strong> ${e.dica}</p>` : ''}
  ${e.solucao ? `<details class="solucao"><summary>Ver solução</summary><pre class="code"><code class="language-c">${esc(e.solucao)}</code></pre></details>` : ''}
</div>`).join('\n');
      return `<section class="card exs"><h2>${m.trilha}.${m.numero} — ${esc(m.titulo)}</h2>${exs}</section>`;
    })
    .join('\n');

  const body = `<main class="landing"><section class="hero small"><h1>✏️ Banco de exercícios</h1><p>Lista ordenada por trilha e módulo, com gabarito comentado. Resolva ANTES de abrir a solução.</p></section>${groups}</main>`;
  return pageShell('Exercícios', body);
}

function renderProjetos(modules) {
  const projs = modules
    .filter((m) => m.projeto)
    .map((m) => `<section class="card projeto">
  <h2>🏗️ ${esc(m.projeto.titulo)} <span class="proj-mod">(${m.trilha}.${m.numero} — ${esc(m.titulo)})</span></h2>
  <p>${m.projeto.descricao}</p>
  ${m.projeto.criterios ? `<div class="criterios"><h3>Critérios de aceite</h3><ul>${m.projeto.criterios.map((c) => `<li>${c}</li>`).join('')}</ul></div>` : ''}
</section>`).join('\n');

  const body = `<main class="landing"><section class="hero small"><h1>🏗️ Projetos</h1><p>Projetos consolidadores espalhados pelas trilhas. Faça todos com o gcc.</p></section>${projs}</main>`;
  return pageShell('Projetos', body);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  if (!fs.existsSync(SITE_DIR)) fs.mkdirSync(SITE_DIR, { recursive: true });
  if (!fs.existsSync(path.join(SITE_DIR, 'assets'))) {
    fs.cpSync(path.join(ROOT, 'assets'), ASSETS_DIR, { recursive: true });
  }

  const modules = readContent().map((m) => ({
    ...m,
    slug: m.slug || slug(m.titulo),
    trilhaSlug: m.trilhaSlug || `trilha-${m.trilha}-${slug(TRILHAS[m.trilha].nome)}`,
    id: m.id || `t${m.trilha}-m${String(m.numero).padStart(2, '0')}`,
    quiz: m.quiz || [],
    secoes: m.secoes || [],
    exercicios: m.exercicios || [],
  }));

  // ordena por trilha, depois por numero numerico
  modules.sort((a, b) => {
    const tn = (x) => parseInt(x.trilha, 10);
    const nm = (x) => parseInt(x.numero, 10);
    if (tn(a) !== tn(b)) return tn(a) - tn(b);
    return nm(a) - nm(b);
  });

  // próximo/anterior dentro da trilha
  const idx = {};
  modules.forEach((m) => (idx[m.id] = m));

  for (let i = 0; i < modules.length; i++) {
    const m = modules[i];
    const prev = i > 0 && modules[i - 1].trilha === m.trilha ? modules[i - 1] : null;
    const next = modules[i + 1] && modules[i + 1].trilha === m.trilha ? modules[i + 1] : null;
    const dir = path.join(SITE_DIR, m.trilhaSlug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const href = path.join(dir, m.slug + '.html');
    fs.writeFileSync(href, renderModulo(m, prev, next), 'utf8');
    console.log('gerado:', path.relative(SITE_DIR, href));
  }

  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), renderIndex(modules), 'utf8');
  console.log('gerado: index.html');

  const exDir = path.join(SITE_DIR, 'exercicios');
  if (!fs.existsSync(exDir)) fs.mkdirSync(exDir, { recursive: true });
  fs.writeFileSync(path.join(exDir, 'index.html'), renderExercicios(modules), 'utf8');
  console.log('gerado: exercicios/index.html');

  const pjDir = path.join(SITE_DIR, 'projetos');
  if (!fs.existsSync(pjDir)) fs.mkdirSync(pjDir, { recursive: true });
  fs.writeFileSync(path.join(pjDir, 'index.html'), renderProjetos(modules), 'utf8');
  console.log('gerado: projetos/index.html');
}

main();