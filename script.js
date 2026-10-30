(function () {
  'use strict';

  var root = document.documentElement;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Safari before iOS 14 only supports the older addListener API.
  function onMediaChange(query, fn) {
    if (query.addEventListener) query.addEventListener('change', fn);
    else if (query.addListener) query.addListener(fn);
  }

  /* ---------- Theme toggle ---------- */
  var toggle = document.querySelector('.theme-toggle');

  function effectiveTheme() {
    var set = root.dataset.theme;
    if (set === 'light' || set === 'dark') return set;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function syncToggle() {
    var dark = effectiveTheme() === 'dark';
    toggle.classList.toggle('is-dark', dark);
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  toggle.addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncToggle();
    document.dispatchEvent(new Event('themechange'));
  });

  onMediaChange(darkQuery, function () {
    syncToggle();
    document.dispatchEvent(new Event('themechange'));
  });

  syncToggle();

  /* ---------- Top bar border + active section ---------- */
  var topbar = document.querySelector('.topbar');
  function onScroll() { topbar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.topbar nav a'));
  if ('IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Oscillator field ----------
     A ring of second-order (damped) Kuramoto oscillators:
       theta_i'' = GAMMA * (omega_i + K * mean_j sin(theta_j - theta_i) - theta_i')
     with each node coupled to its REACH nearest neighbours on either side.
     Random phases relax into synchronized travelling waves. */
  var canvas = document.getElementById('field');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var readout = document.getElementById('coherence');
  var TAU = Math.PI * 2;
  var REACH = 3, K = 2.2, GAMMA = 1.6, SPEED = 1.5, H = 1 / 120;

  var N = Math.max(48, Math.min(84, Math.round(canvas.clientWidth / 14)));
  var theta = new Float64Array(N);
  var vel = new Float64Array(N);
  var omega = new Float64Array(N);
  var acc = new Float64Array(N);
  var width = 0, height = 0, colors = {};

  function readColors() {
    var s = getComputedStyle(root);
    colors = {
      accent: s.getPropertyValue('--accent').trim(),
      ink: s.getPropertyValue('--ink').trim(),
      rule: s.getPropertyValue('--rule').trim(),
      faint: s.getPropertyValue('--ink-3').trim()
    };
  }

  // Phases start as a hidden 2- or 3-fold twist buried under noise, so the ring
  // looks random at first but usually settles into travelling waves, not a flat line.
  function seed() {
    var q = (Math.random() < 0.5 ? 2 : 3) * (Math.random() < 0.5 ? -1 : 1);
    for (var i = 0; i < N; i++) {
      theta[i] = TAU * q * i / N + (Math.random() - 0.5) * TAU * 0.7;
      omega[i] = 1.4 + (Math.random() - 0.5) * 0.5;
      vel[i] = omega[i];
    }
  }

  function step(dt) {
    var i, d, c;
    for (i = 0; i < N; i++) {
      c = 0;
      for (d = 1; d <= REACH; d++) {
        c += Math.sin(theta[(i + d) % N] - theta[i]) + Math.sin(theta[(i - d + N) % N] - theta[i]);
      }
      acc[i] = GAMMA * (omega[i] + K * c / (2 * REACH) - vel[i]);
    }
    for (i = 0; i < N; i++) {
      vel[i] += acc[i] * dt;
      theta[i] += vel[i] * dt;
    }
  }

  function advance(seconds) {
    var sim = seconds * SPEED;
    while (sim > 0) {
      var h = Math.min(H, sim);
      step(h);
      sim -= h;
    }
  }

  function coherence() {
    var s = 0;
    for (var i = 0; i < N; i++) s += Math.cos(theta[(i + 1) % N] - theta[i]);
    return Math.max(0, s / N);
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function nodeX(i) {
    var pad = 10;
    return pad + i * (width - 2 * pad) / (N - 1);
  }

  function draw() {
    if (!width) return;
    var mid = height / 2;
    var amp = height * 0.33;
    var dx = (width - 20) / (N - 1);
    var r = Math.max(1.4, Math.min(2.6, dx * 0.26));
    var i, x, y;
    var ys = new Array(N);
    for (i = 0; i < N; i++) ys[i] = mid - amp * Math.sin(theta[i]);

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.rule;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(width, mid);
    ctx.stroke();

    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = colors.faint;
    ctx.beginPath();
    for (i = 0; i < N; i++) {
      x = nodeX(i);
      ctx.moveTo(x, mid);
      ctx.lineTo(x, ys[i]);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(nodeX(0), ys[0]);
    for (i = 1; i < N; i++) ctx.lineTo(nodeX(i), ys[i]);
    ctx.stroke();

    ctx.fillStyle = colors.ink;
    for (i = 0; i < N; i++) {
      ctx.beginPath();
      ctx.arc(nodeX(i), ys[i], r, 0, TAU);
      ctx.fill();
    }
  }

  function updateReadout() {
    readout.textContent = coherence().toFixed(2);
  }

  // Scramble the phases of nodes near the pointer.
  function perturb(clientX) {
    var rect = canvas.getBoundingClientRect();
    var x = clientX - rect.left;
    var center = (x - 10) / ((width - 20) / (N - 1));
    var spread = Math.max(4, N / 8);
    for (var i = 0; i < N; i++) {
      var w = Math.exp(-Math.pow((i - center) / spread, 2));
      theta[i] += (Math.random() - 0.5) * TAU * 1.6 * w;
      vel[i] += (Math.random() - 0.5) * 4 * w;
    }
  }

  var running = false, visible = false, last = 0, frameCount = 0;

  function frame(t) {
    if (!running) return;
    var dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    advance(dt);
    draw();
    if (++frameCount % 6 === 0) updateReadout();
    requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduceMotion.matches || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  function stop() { running = false; }

  // With reduced motion: show a settled state and let clicks re-settle it without animating.
  function settleStatic() {
    advance(6);
    draw();
    updateReadout();
  }

  canvas.addEventListener('pointerdown', function (e) {
    perturb(e.clientX);
    if (reduceMotion.matches) settleStatic();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  document.addEventListener('themechange', function () {
    readColors();
    draw();
  });

  onMediaChange(reduceMotion, function () {
    if (reduceMotion.matches) { stop(); settleStatic(); } else start();
  });

  readColors();
  seed();
  if (reduceMotion.matches) advance(6);
  resize();
  updateReadout();
  canvas.parentNode.parentNode.classList.add('is-live');
  // The live canvas replaces the self-animating SVG fallback; stop its animation.
  var still = document.querySelector('.field-still');
  if (still && still.pauseAnimations) still.pauseAnimations();

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(canvas);
  } else {
    visible = true;
    start();
  }
})();
