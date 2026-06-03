/* BudgetThrills theme — interactions */
(function () {
  'use strict';

  /* ---- Theme toggle (light/dark) ---- */
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cur  = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('bt-theme', next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#F7F7F5' : '#0A0A0A');
    });
  });

  /* ---- Per-letter scroll reveal ---- */
  function splitText(el) {
    var mode    = el.dataset.split;
    var stagger = parseFloat(el.dataset.stagger || '0.025');
    var baseDel = parseFloat(el.dataset.delay   || '0');
    var original = el.textContent;
    el.textContent = '';

    var wrap = document.createElement('span');
    wrap.className = 'reveal-line';

    if (mode === 'chars') {
      Array.prototype.forEach.call(original, function (ch, i) {
        var span = document.createElement('span');
        span.className = 'reveal-char';
        span.style.animationDelay = (baseDel + i * stagger) + 's';
        span.textContent = ch === ' ' ? ' ' : ch;
        wrap.appendChild(span);
      });
    } else {
      var words = original.split(/(\s+)/);
      var idx = 0;
      words.forEach(function (token) {
        if (/^\s+$/.test(token)) {
          wrap.appendChild(document.createTextNode(token));
        } else {
          var span = document.createElement('span');
          span.className = 'reveal-word';
          span.style.animationDelay = (baseDel + idx * stagger) + 's';
          span.textContent = token;
          wrap.appendChild(span);
          idx++;
        }
      });
    }
    el.appendChild(wrap);
    return wrap;
  }

  var splits = [];
  document.querySelectorAll('[data-split]').forEach(function (el) {
    splits.push(splitText(el));
  });

  var revealNodes = splits.concat(Array.prototype.slice.call(document.querySelectorAll('[data-reveal]')));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach(function (n) { n.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });

    revealNodes.forEach(function (n) { io.observe(n); });
    // safety net so headless / capture tools always see content
    setTimeout(function () {
      revealNodes.forEach(function (n) { n.classList.add('in'); });
    }, 1200);
  }

  /* ---- Countdown (end of day) ---- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var t = new Date(); t.setHours(23, 59, 59, 0);
    var diff = Math.max(0, t - Date.now());
    var h = Math.floor(diff / 3.6e6);
    var m = Math.floor((diff % 3.6e6) / 6e4);
    var s = Math.floor((diff % 6e4) / 1e3);
    var H = document.getElementById('cd-h'); if (H) H.textContent = pad(h);
    var M = document.getElementById('cd-m'); if (M) M.textContent = pad(m);
    var S = document.getElementById('cd-s'); if (S) S.textContent = pad(s);
  }
  if (document.querySelector('.cd')) { setInterval(tick, 1000); tick(); }

  /* ---- PDP gallery ---- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var main = gallery.querySelector('[data-gallery-main] img');
    gallery.querySelectorAll('.thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        gallery.querySelectorAll('.thumb').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        var src = t.dataset.imageFull || t.querySelector('img').src;
        if (main) main.src = src;
      });
    });
  });

  /* ---- Swatches (single-attribute variant selector) ---- */
  document.querySelectorAll('[data-swatches]').forEach(function (group) {
    group.querySelectorAll('.swatch').forEach(function (s) {
      s.addEventListener('click', function () {
        group.querySelectorAll('.swatch').forEach(function (x) { x.classList.remove('active'); });
        s.classList.add('active');
        var label = document.querySelector('[data-color-label]');
        if (label) label.textContent = s.dataset.color || '';
        var form = group.closest('form');
        if (form && s.dataset.variantId) {
          var idInput = form.querySelector('input[name="id"]');
          if (idInput) idInput.value = s.dataset.variantId;
        }
      });
    });
  });

  document.querySelectorAll('[data-sizes]').forEach(function (group) {
    group.querySelectorAll('.size').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        group.querySelectorAll('.size').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var form = group.closest('form');
        if (form && b.dataset.variantId) {
          var idInput = form.querySelector('input[name="id"]');
          if (idInput) idInput.value = b.dataset.variantId;
        }
      });
    });
  });

  /* ---- Qty stepper ---- */
  document.querySelectorAll('.qty').forEach(function (q) {
    var input = q.querySelector('input');
    var down  = q.querySelector('[data-qty-down]');
    var up    = q.querySelector('[data-qty-up]');
    if (down) down.addEventListener('click', function () {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    if (up) up.addEventListener('click', function () {
      input.value = (parseInt(input.value, 10) || 1) + 1;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  /* ---- Add to Cart (AJAX) ---- */
  document.querySelectorAll('form[data-product-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: new URLSearchParams(new FormData(form))
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.status && data.status >= 400) throw new Error(data.description || 'Error');
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        if (btn) { btn.textContent = 'Added ✓'; setTimeout(function () { btn.disabled = false; btn.textContent = originalText; }, 1500); }
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.setAttribute('data-count', cart.item_count);
        });
      })
      .catch(function (err) {
        if (btn) { btn.textContent = 'Try again'; setTimeout(function () { btn.disabled = false; btn.textContent = originalText; }, 1500); }
        console.error('Add to cart failed:', err);
      });
    });
  });

  /* ---- Newsletter (Shopify customer form noop catcher) ---- */
  document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function () {
      var out = form.querySelector('[data-nl-out]');
      if (out) setTimeout(function () { out.textContent = "You're in. Check your inbox for the drop."; }, 100);
    });
  });

  /* ---- Mobile nav toggle ---- */
  var navBtn  = document.querySelector('[data-nav-toggle]');
  var navMenu = document.querySelector('[data-nav-menu]');
  if (navBtn && navMenu) {
    navBtn.addEventListener('click', function () { navMenu.classList.toggle('hidden'); });
  }
})();
