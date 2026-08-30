/* SPGCL — progressive enhancement only.
   Every section renders and reads correctly with JavaScript disabled; this file
   adds the scroll, reveal and tab behaviours described in README.md. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sticky header state ───────────────────────────────────────────── */
  var header = document.getElementById('siteHeader');
  if (header) {
    var setHeaderState = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }

  /* ── Mobile navigation ─────────────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setNav(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ── Scroll reveals ────────────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
  }

  /* ── Hero stat bar: staggered entrance once painted ────────────────── */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
  });

  /* ── Global reach: country tabs ────────────────────────────────────── */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.reach__tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.reach__panel'));

  if (tabs.length && tabs.length === panels.length) {
    var select = function (index, focus) {
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].classList.toggle('is-active', active);
        panels[i].hidden = !active;
      });
      if (focus) { tabs[index].focus(); }
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { next = (i + 1) % tabs.length; }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { next = (i - 1 + tabs.length) % tabs.length; }
        else if (e.key === 'Home') { next = 0; }
        else if (e.key === 'End') { next = tabs.length - 1; }
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
  }

  /* ── Hero parallax ─────────────────────────────────────────────────── */
  var heroImg = document.getElementById('heroImg');
  var hero = document.querySelector('.hero');
  if (heroImg && hero && !reduceMotion) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () {
        var travel = Math.min(window.scrollY, hero.offsetHeight);
        heroImg.style.transform = 'translate3d(0,' + (travel * 0.2).toFixed(2) + 'px,0)';
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
