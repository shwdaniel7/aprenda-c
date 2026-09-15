// Progresso do aprendizado, salvo em localStorage.
(function () {
  const KEY = 'aprendac:done';
  const EXKEY = 'aprendac:exdone';

  function loadData(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveData(key, arr) {
    try {
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      /* file:// pode restringir em alguns navegadores; silencioso */
    }
  }

  function refreshChips() {
    const dados = loadData(KEY);
    document.querySelectorAll('[data-mod]').forEach((el) => {
      const id = el.getAttribute('data-mod');
      const done = dados.includes(id);
      if (el.classList.contains('mod-card')) {
        el.classList.toggle('done', done);
        const st = el.querySelector('.mod-status');
        if (st) st.textContent = done ? '✓' : '○';
      }
      if (el.classList.contains('btn-done')) {
        el.textContent = done ? '✓ Concluído — desfazer' : 'Marcar concluído';
      }
    });
  }

  function refreshProgresso() {
    const dados = loadData(KEY);
    document.querySelectorAll('.progresso[data-trilha]').forEach((p) => {
      const trilha = p.getAttribute('data-trilha');
      const cards = document.querySelectorAll(`.mod-card[data-mod^="t${trilha}-"]`);
      const total = cards.length;
      const done = cards
        .map((c) => dados.includes(c.getAttribute('data-mod')))
        .filter(Boolean).length;
      const fill = p.querySelector('.barra-fill');
      if (fill) fill.style.width = total ? (done / total) * 100 + '%' : '0%';
      const txt = p.querySelector('.pct');
      if (txt) txt.textContent = `${done}/${total}`;
    });
  }

  function corrigeVisitas() {
    const marcados = document.querySelectorAll('.check-ex .ex-done');
    const dados = loadData(EXKEY);
    marcados.forEach((cb) => {
      const ex = cb.closest('.exercicio');
      const mod = ex ? ex.getAttribute('data-mod') : '';
      const key = mod + '-' + (ex && ex.querySelector('.num-ex') ? ex.querySelector('.num-ex').textContent.trim() : '');
      cb.checked = dados.includes(key);
    });
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-done');
    if (!btn) return;
    const id = btn.getAttribute('data-mod');
    let dados = loadData(KEY);
    if (dados.includes(id)) dados = dados.filter((d) => d !== id);
    else dados.push(id);
    saveData(KEY, dados);
    refreshChips();
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
      refreshProgresso();
    }
  });

  document.addEventListener('change', function (e) {
    const cb = e.target.closest('.ex-done');
    if (!cb) return;
    const ex = cb.closest('.exercicio');
    const mod = ex ? ex.getAttribute('data-mod') : '';
    const label = ex ? ex.querySelector('.num-ex').textContent.trim() : '';
    const key = mod + '-' + label;
    let dados = loadData(EXKEY);
    if (cb.checked) dados.push(key);
    else dados = dados.filter((d) => d !== key);
    saveData(EXKEY, dados);
  });

  document.addEventListener('DOMContentLoaded', function () {
    refreshChips();
    refreshProgresso();
    corrigeVisitas();
  });
})();