(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var R = document.documentElement, clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // tema
  $('#th').onclick = function () {
    var n = R.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    R.setAttribute('data-theme', n);
    try { localStorage.setItem('th2', n); } catch (e) {}
  };

  // ---------- conteúdo (edite aqui) ----------
  var cards = [
    ['Suporte técnico', 'Atendimento ao usuário, resolução de problemas e manutenção do dia a dia da equipe.', ['Atendimento', 'Office']],
    ['Infraestrutura & hardware', 'Manutenção e montagem de computadores, redes básicas e inventário de PCs e monitores.', ['Hardware', 'Redes']],
    ['Desenvolvimento', 'Automação e sistemas internos em Python, com banco de dados SQL.', ['Python', 'SQL']],
    ['Modelagem de dados', 'Diagramas DER e normalização (1FN e 2FN) no MySQL Workbench.', ['MySQL', 'DER']]
  ];
  var timeline = [
    ['2022 a<br>2025', 'Auxiliar de Loja', 'Casas Bahia', 'Atendimento ao cliente, organização e envio de documentos e organização de estoque.'],
    ['Jul/2026', 'Inglês avançado', 'Aslan', 'Curso concluído.'],
    ['Ago/2026<br>até hoje', 'Estagiário de TI', 'FN Crespo', 'Suporte a cerca de 20 usuários, manutenção de hardware e inventário de máquinas.']
  ];
  var projects = [
    ['', 'chamados.py', 'Sistema de chamados de TI', 'Plataforma para os funcionários abrirem chamados de atendimento presencial, em formato de site ou bot de WhatsApp.', ['Python', 'Suporte']],
    ['b', 'inventário', 'Inventário de hardware', 'Levantamento dos PCs e monitores da empresa, com marca, modelo e organização do patrimônio de TI.', ['Hardware', 'Organização']],
    ['c', 'DER · 2FN', 'Modelagem de dados', 'Diagramas entidade-relacionamento e normalização até a 2FN, feitos no MySQL Workbench.', ['MySQL', 'SQL']]
  ];
  var tech = [['Python', 'python.png', ''], ['MySQL Workbench', 'mysql-workbench.png', ''], ['Git', 'git.png', ''], ['GitHub', 'github.png', 'w'],
    ['Excel', 'excel.png', ''], ['Word', 'word.png', ''], ['Hardware', 'hardware.png', 'w'], ['Redes', 'redes.png', 'w']];
  var tags = function (a) { return a.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(''); };

  $('#cards').innerHTML = cards.map(function (c, i) { return '<div class="ci" style="--i:' + i + '"><h3>' + c[0] + '</h3><p>' + c[1] + '</p>' + tags(c[2]) + '<span class="ar">↗</span></div>'; }).join('');
  $('#timeline').innerHTML = timeline.map(function (t) { return '<div class="tr rv"><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div><div class="ty">' + t[0] + '</div><p>' + t[3] + '</p></div>'; }).join('');
  $('#track').innerHTML = projects.map(function (p) { return '<div class="pc"><div class="pv ' + p[0] + '">' + p[1] + '</div><h3>' + p[2] + '</h3><p>' + p[3] + '</p>' + tags(p[4]) + '</div>'; }).join('');
  $('#ct').textContent = '0' + projects.length;
  $('#techg').innerHTML = '<div class="tc" style="--i:0"><i style="background:#00758f"><b style="color:#fff">SQL</b></i>SQL</div>' +
    tech.map(function (t, i) { return '<div class="tc ' + t[2] + '" style="--i:' + (i + 1) + '"><i><img alt="' + t[0] + '" src="assets/' + t[1] + '"></i>' + t[0] + '</div>'; }).join('');

  var study = [['JavaScript', 'Base da programação para web.'], ['Java', 'Programação orientada a objetos.'], ['IA Engineer', 'Formação em inteligência artificial.']];
  $('#sg').innerHTML = study.map(function (x, i) { return '<div class="st rv" style="transition-delay:' + (i * 0.12) + 's"><span class="bd"><i></i>em andamento</span><h3>' + x[0] + '</h3><p>' + x[1] + '</p><div class="sh"></div></div>'; }).join('');

  // texto "Sobre mim" aparece palavra por palavra
  var sp = $('#sp'), n = 0;
  sp.innerHTML = sp.textContent.split(' ').map(function (w) { return '<span class="sw" style="--i:' + (n++) + '">' + w + '</span>'; }).join(' ');

  // revelar ao entrar na tela
  var io = new IntersectionObserver(function (a) {
    a.forEach(function (x) { if (x.isIntersecting) x.target.classList.add('in'); });
  }, { threshold: 0.2 });
  $$('.rv, .sb, .big, .tg').forEach(function (e) { io.observe(e); });

  // menu ativo
  var nio = new IntersectionObserver(function (a) {
    a.forEach(function (x) {
      if (x.isIntersecting) $$('nav a').forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + x.target.id); });
    });
  }, { threshold: 0.4 });
  $$('section').forEach(function (s) { nio.observe(s); });


  // projetos: rolagem vertical vira horizontal
  var psec = $('#proj'), track = $('#track'), dist = 0;
  function sizeProj() {
    dist = Math.max(track.scrollWidth - innerWidth + innerWidth * 0.08, 0);
    psec.style.height = (innerHeight + Math.max(dist * 1.5, innerHeight * 1.1)) + 'px';
  }
  sizeProj(); addEventListener('resize', sizeProj); addEventListener('load', sizeProj);

  var gh = $('#ghost'), cur = 0, px = 0, py = 0, tx = 0, ty = 0, hl = $('#hl'), hr = $('#hr'), spine = $('#spine'), cards2 = $$('.pc');
  addEventListener('pointermove', function (e) { tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2; });

  function tick(ms) {
    var y = scrollY, vh = innerHeight, s = y / vh;
    cur = reduce ? s : cur + (s - cur) * 0.1;
    px += (tx - px) * 0.08; py += (ty - py) * 0.08;
    gh.style.transform = 'translate(calc(-50% + ' + (px * 26) + 'px),calc(-50% + ' + (py * 16 - s * 140) + 'px))';
    gh.style.opacity = clamp(1 - s / 0.9, 0, 1);
    R.style.setProperty('--mx', (50 + px * 45) + '%'); R.style.setProperty('--my', (38 + py * 35 - s * 4) + '%');

    $('#pg').style.width = (y / Math.max(1, document.documentElement.scrollHeight - vh) * 100) + '%';
    var f = clamp(s / 0.8, 0, 1);
    hl.style.opacity = 1 - f; hr.style.opacity = 1 - f;
    hl.style.transform = 'translate(' + (-70 * f) + 'px,-50%)';
    hr.style.transform = innerWidth < 800 ? 'none' : 'translate(' + (70 * f) + 'px,-50%)';

    var tl = $('.tlw').getBoundingClientRect();
    spine.style.transform = 'scaleY(' + clamp((vh * 0.65 - tl.top) / tl.height, 0, 1) + ')';

    var top = psec.getBoundingClientRect().top + y;
    var p = clamp((y - top) / Math.max(1, psec.offsetHeight - vh), 0, 1);
    track.style.transform = 'translateX(' + (-p * dist) + 'px)';
    var idx = Math.round(p * (projects.length - 1));
    $('#ci').textContent = '0' + (idx + 1); $('#pf').style.width = (p * 100) + '%';
    cards2.forEach(function (c, i) { c.classList.toggle('act', i === idx); });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
