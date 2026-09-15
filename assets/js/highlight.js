// Highlight de sintaxe C leve (regex de varredura única).
(function () {
  const KEYWORDS =
    'auto|bool|break|case|char|const|continue|default|do|double|else|enum|extern|' +
    'float|for|goto|if|inline|int|long|register|restrict|return|short|signed|' +
    'sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|' +
    '_Bool|_Complex|_Imaginary|_Generic|_Noreturn|_Static_assert|_Thread_local|' +
    'true|false|null';

  const PREPROC =
    'include|define|undef|if|ifdef|ifndef|else|elif|endif|error|warning|pragma|line|embed';

  const PATTERN = new RegExp(
    // 1: spans já inseridos (pula)
    '(<\\/?(?:span|b|i|em)[^>]*>)' +
    // 2: preprocessador
    '|(^[ \\t]*#[ \\t]*(?:' + PREPROC + ')\\b[^\\n]*)' +
    // 3: comentários
    '|(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +
    // 4: strings e chars
    '|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')' +
    // 5: números
    '|(\\b(?:0[xX][0-9a-fA-F_]+|\\d+[0-9a-zA-Z_]*)(?:\\.[0-9a-zA-Z_]+)?(?:[eEpP][+-]?\\d+)?[a-zA-Z0-9_]*\\b)' +
    // 6: palavras-chave e tipos
    '|(\\b(?:' + KEYWORDS + ')\\b)' +
    // 7: chamadas de função
    '|(\\b[A-Za-z_][A-Za-z0-9_]*(?=\\s*\\())' +
    '|()',
    'gm'
  );

  const classes = ['hl-p', 'hl-c', 'hl-s', 'hl-n', 'hl-k', 'hl-f'];

  function highlight(code) {
    return code.replace(PATTERN, function (m, p1, p2, p3, p4, p5, p6, p7) {
      if (p1) return p1;
      const cls = classes[[p2, p3, p4, p5, p6, p7].findIndex((p) => p)];
      return `<span class="${cls}">${m}</span>`;
    });
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setup() {
    document.querySelectorAll('pre.code code.language-c').forEach(function (el) {
      const raw = el.textContent;
      el.innerHTML = highlight(escapeHtml(raw));
      // garantir que trailing newline apareça
      if (raw.endsWith('\n')) el.innerHTML += '\n';
    });
  }

  // botões de copiar
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const pre = btn.closest('.code-block').querySelector('pre.code');
    const texto = pre ? pre.textContent : '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () {
        const old = btn.textContent;
        btn.textContent = 'copiado ✓';
        setTimeout(function () { btn.textContent = old; }, 1200);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();