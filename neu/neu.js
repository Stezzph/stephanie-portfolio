(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  function tc(sec) {
    var f = Math.floor((sec % 1) * 25), s = Math.floor(sec) % 60, m = Math.floor(sec / 60) % 60, h = Math.floor(sec / 3600);
    return [h, m, s, f].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  /* Showreel: Pause-Knopf */
  var rv = document.querySelector('.reel-video'), rp = document.querySelector('.reel-pause');
  if (rv) {
    if (reduce) { rv.removeAttribute('autoplay'); rv.pause(); rp.textContent = 'Abspielen'; rp.setAttribute('aria-pressed', 'true'); }
    rp.addEventListener('click', function () {
      if (rv.paused) { rv.play(); rp.textContent = 'Pause'; rp.setAttribute('aria-pressed', 'false'); }
      else { rv.pause(); rp.textContent = 'Abspielen'; rp.setAttribute('aria-pressed', 'true'); }
    });
  }

  /* Kopfzeile bekommt beim Scrollen einen Hintergrund */
  var top = document.querySelector('.top');
  function onScroll() { top.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Was ich mache: Zeilen auf- und zuklappen */
  document.querySelectorAll('.svc-head').forEach(function (h) {
    h.addEventListener('click', function () {
      var li = h.parentElement, open = !li.classList.contains('is-open');
      document.querySelectorAll('.svc').forEach(function (x) { x.classList.remove('is-open'); x.querySelector('.svc-head').setAttribute('aria-expanded', 'false'); });
      if (open) { li.classList.add('is-open'); h.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* Videos spielen beim Darüberfahren (nur mit Maus) */
  function hoverPlay(btn) {
    var v = btn.querySelector('video'); if (!v) return;
    btn.addEventListener('mouseenter', function () {
      if (!v.src) v.src = v.dataset.src;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      btn.classList.add('is-playing');
    });
    btn.addEventListener('mouseleave', function () { v.pause(); btn.classList.remove('is-playing'); });
  }
  if (canHover && !reduce) document.querySelectorAll('.w-open, .reel-open').forEach(hoverPlay);

  /* Reels seitlich blättern */
  var reels = document.querySelector('.reels');
  document.querySelectorAll('.rn').forEach(function (b) {
    b.addEventListener('click', function () { reels.scrollBy({ left: Number(b.dataset.dir) * reels.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' }); });
  });

  /* Filter */
  var chips = document.querySelectorAll('.f-chip'), items = document.querySelectorAll('.w-item');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.filter;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      items.forEach(function (it) { it.hidden = !(f === 'alle' || it.dataset.cat === f); });
    });
  });

  /* «Arbeiten ansehen» filtert direkt */
  document.querySelectorAll('[data-jump]').forEach(function (a) {
    a.addEventListener('click', function () {
      var c = document.querySelector('.f-chip[data-filter="' + a.dataset.jump + '"]'); if (c) c.click();
    });
  });

  /* Grossansicht */
  var lb = document.querySelector('.lb'), stage = lb.querySelector('.lb-stage');
  var lbTitle = lb.querySelector('.lb-title'), lbCtx = lb.querySelector('.lb-ctx');
  var list = [], idx = 0, opener = null;
  function show(i) {
    idx = (i + list.length) % list.length;
    var b = list[idx]; stage.innerHTML = '';
    var el;
    if (b.dataset.kind === 'video') {
      el = document.createElement('video');
      el.controls = true; el.playsInline = true; el.autoplay = true; el.poster = b.dataset.poster; el.src = b.dataset.src;
    } else {
      el = document.createElement('img'); el.src = b.dataset.src; el.alt = b.dataset.title + ': ' + b.dataset.ctx;
    }
    stage.appendChild(el);
    lbTitle.textContent = b.dataset.title; lbCtx.textContent = b.dataset.ctx;
    lb.querySelectorAll('.lb-nav').forEach(function (n) { n.hidden = list.length < 2; });
  }
  function open(btn) {
    var group = btn.classList.contains('reel-open') ? '.reel-open' : '.w-item:not([hidden]) .w-open';
    list = Array.prototype.slice.call(document.querySelectorAll(group));
    opener = btn; show(list.indexOf(btn)); lb.showModal();
  }
  document.querySelectorAll('.w-open, .reel-open').forEach(function (b) {
    b.addEventListener('click', function () { var v = b.querySelector('video'); if (v) v.pause(); open(b); });
  });
  lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('close', function () { stage.innerHTML = ''; if (opener) opener.focus(); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === stage) lb.close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.open) return;
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  });

  /* Kontaktformular: öffnet das Mailprogramm */
  var form = document.querySelector('.c-form'), note = form.querySelector('.c-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.website.value) return;
    if (!form.name.value.trim() || !form.email.value.trim() || !form.msg.value.trim()) {
      note.textContent = 'Bitte Name, E-Mail und Nachricht ausfüllen.'; return;
    }
    var body = form.msg.value + '\n\n' + form.name.value + '\n' + form.email.value;
    window.location.href = 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent('Anfrage über stephanie-portfolio von ' + form.name.value) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Dein Mailprogramm öffnet sich mit der fertigen Nachricht.';
  });
})();
