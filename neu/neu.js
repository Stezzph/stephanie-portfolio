(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  function tc(sec) {
    var f = Math.floor((sec % 1) * 25), s = Math.floor(sec) % 60, m = Math.floor(sec / 60) % 60, h = Math.floor(sec / 3600);
    return [h, m, s, f].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  /* Showreel: Timecode und Pause */
  var hv = document.querySelector('.hero-video'), htc = document.getElementById('hero-tc'), hp = document.querySelector('.hero-pause');
  if (hv) {
    if (reduce) { hv.removeAttribute('autoplay'); hv.pause(); hp.textContent = 'Abspielen'; hp.setAttribute('aria-pressed', 'true'); }
    hv.addEventListener('timeupdate', function () { htc.textContent = tc(hv.currentTime); });
    hp.addEventListener('click', function () {
      if (hv.paused) { hv.play(); hp.textContent = 'Pause'; hp.setAttribute('aria-pressed', 'false'); }
      else { hv.pause(); hp.textContent = 'Abspielen'; hp.setAttribute('aria-pressed', 'true'); }
    });
  }

  /* Kopfzeile wird beim Scrollen hell */
  var top = document.querySelector('.top'), hero = document.querySelector('.hero');
  function onScroll() { top.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 80); }

  /* Schnittleiste: Clips so breit wie die Abschnitte, Abspielkopf folgt dem Scrollen */
  var clips = Array.prototype.slice.call(document.querySelectorAll('.tl-clip'));
  var head = document.querySelector('.tl-head'), track = document.querySelector('.tl-track'), ttc = document.getElementById('tl-tc');
  var secs = clips.map(function (c) { return document.getElementById(c.dataset.sec); });
  function layout() {
    secs.forEach(function (s, i) { clips[i].style.flexGrow = Math.max(1, Math.round(s.offsetHeight / 100)); });
  }
  function onTimeline() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    head.style.left = (p * track.clientWidth) + 'px';
    ttc.textContent = tc(p * 120); /* Die ganze Seite als 2-Minuten-Timeline */
    var mid = window.scrollY + window.innerHeight * 0.4, active = 0;
    secs.forEach(function (s, i) { if (s.offsetTop <= mid) active = i; });
    clips.forEach(function (c, i) { c.classList.toggle('is-active', i === active); c.toggleAttribute('aria-current', i === active); });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { onScroll(); onTimeline(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', function () { layout(); onTimeline(); });
  window.addEventListener('load', function () { layout(); onTimeline(); });
  layout(); onScroll(); onTimeline();

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
      layout(); onTimeline();
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
