// ---- theme toggle (persisted, falls back to system preference) ----
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  applyTheme(stored || (systemLight ? 'light' : 'dark'));

  toggle.addEventListener('click', function () {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// ---- hero typewriter ----
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const text = "Turning ideas that sound dumb out loud into products people actually use.";
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 18);
    }
  }
  type();
})();

// ---- shared motion/pointer checks ----
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasFinePointer = window.matchMedia('(pointer: fine)').matches;

// ---- click / tap burst — satisfying pop wherever you click, cursor stays native ----
(function () {
  if (prefersReducedMotion) return;

  var colorClasses = ['click-particle--a', 'click-particle--b'];

  document.addEventListener('pointerdown', function (e) {
    if (typeof e.button === 'number' && e.button > 0) return;

    var burst = document.createElement('div');
    burst.className = 'click-burst';
    burst.style.left = e.clientX + 'px';
    burst.style.top = e.clientY + 'px';

    var ring = document.createElement('span');
    ring.className = 'click-ring';
    burst.appendChild(ring);

    var ring2 = document.createElement('span');
    ring2.className = 'click-ring click-ring--delay';
    burst.appendChild(ring2);

    var core = document.createElement('span');
    core.className = 'click-core';
    burst.appendChild(core);

    var count = 7;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('span');
      particle.className = 'click-particle ' + colorClasses[i % 2];
      var angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
      var dist = 20 + Math.random() * 28;
      particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      particle.style.animationDelay = (Math.random() * 0.04) + 's';
      burst.appendChild(particle);
    }

    document.body.appendChild(burst);
    setTimeout(function () { burst.remove(); }, 650);
  }, { passive: true });
})();

// ---- scroll progress bar ----
(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var ticking = false;
  function update() {
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    bar.style.width = (scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ---- hero symbol parallax on scroll ----
(function () {
  if (prefersReducedMotion) return;
  var symbols = document.querySelectorAll('.hero .symbol');
  if (!symbols.length) return;
  var ticking = false;
  function update() {
    var y = window.scrollY;
    symbols.forEach(function (el, i) {
      var speed = 0.06 + (i % 3) * 0.05;
      var dir = i % 2 === 0 ? 1 : -1;
      el.style.transform = 'translateY(' + (y * speed * dir) + 'px)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

// ---- magnetic buttons ----
(function () {
  if (!hasFinePointer || prefersReducedMotion) return;
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.35) + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
})();

// ---- card spotlight (follows cursor) + 3D tilt on featured cards ----
(function () {
  if (!hasFinePointer || prefersReducedMotion) return;

  document.querySelectorAll('.qlink, .project, .skill-card, .featured-card, .contact-box, .about-proof').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  document.querySelectorAll('.featured-card, .project.live').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateX(' + (py * -4) + 'deg) rotateY(' + (px * 5) + 'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
})();

// ---- scroll reveal ----
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();
