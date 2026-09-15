// Motor de quiz: lê <script/type=json> dentro de .quiz-card (data-quiz-json) e renderiza.
(function () {
  function render(card) {
    let raw = card.getAttribute('data-quiz-json');
    if (!raw) {
      const s = card.querySelector('script[type="application/json"]');
      raw = s ? s.textContent : null;
    }
    if (!raw) return;
    let perguntas;
    try { perguntas = JSON.parse(raw); } catch (e) { console.error('quiz JSON inválido', e); return; }
    if (!Array.isArray(perguntas)) perguntas = [perguntas];

    const root = card.querySelector('.quiz-root');
    if (!root) return;

    let corretas = 0;
    let respondidas = 0;

    perguntas.forEach(function (q, qi) {
      const wrapper = document.createElement('div');
      wrapper.className = 'quiz-p';
      const p = document.createElement('p');
      p.className = 'pergunta';
      p.textContent = (qi + 1) + '. ' + q.pergunta;
      wrapper.appendChild(p);

      q.opcoes.forEach(function (op, oi) {
        const lab = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'radio';
        cb.name = 'quiz-' + qi;
        cb.value = oi;
        lab.appendChild(cb);
        lab.appendChild(document.createTextNode(' ' + op));
        wrapper.appendChild(lab);
      });

      const res = document.createElement('p');
      res.className = 'res-q';
      res.style.display = 'none';
      wrapper.appendChild(res);

      // correta marcada
      wrapper.addEventListener('change', function () {
        if (wrapper.dataset.corrigida === '1') return;
        const sel = wrapper.querySelector('input:checked');
        if (!sel) return;
        wrapper.dataset.corrigida = '1';
        wrapper.querySelectorAll('input').forEach(function (i) { i.disabled = true; });
        wrapper.querySelectorAll('label').forEach(function (l) { l.classList.add('disabled'); });
        const acertou = parseInt(sel.value, 10) === q.correta;
        res.style.display = 'block';
        if (acertou) {
          sel.closest('label').classList.add('correta');
          res.textContent = '✓ Correto! ' + (q.explicacao || '');
          res.style.color = 'var(--green)';
          corretas++;
        } else {
          sel.closest('label').classList.add('errada');
          const certo = wrapper.querySelectorAll('label')[q.correta];
          if (certo) certo.classList.add('correta');
          res.textContent = '✗ Errado. ' + (q.explicacao || '');
          res.style.color = 'var(--red)';
        }
        respondidas++;
        if (respondidas === perguntas.length) mostrarResultado();
      });

      root.appendChild(wrapper);
    });

    const bot = document.createElement('div');
    const result = document.createElement('p');
    result.className = 'resultado';
    result.style.display = 'none';
    bot.appendChild(result);
    root.appendChild(bot);

    function mostrarResultado() {
      result.style.display = 'block';
      result.textContent = 'Você acertou ' + corretas + ' de ' + perguntas.length + ' perguntas.';
      result.style.color = corretas === perguntas.length ? 'var(--green)' : 'var(--yellow)';
    }
  }

  function setup() {
    document.querySelectorAll('.quiz-card').forEach(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();