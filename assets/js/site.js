/* Stephanie Roth – Portfolio: kleine Helfer ohne Framework */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;

  /* --- Header-Höhe für die erste Section ------------------------------- */
  var header = doc.querySelector('.site-header');
  function setHeaderHeight() {
    if (header) root.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  /* --- Mobile Navigation ------------------------------------------------ */
  var burger = doc.querySelector('.header-burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) burger.click();
    });
  }

  /* --- Skalierter Text: füllt die Blockbreite (wie Squarespace) -------- */
  var scaled = Array.prototype.slice.call(doc.querySelectorAll('.sqsrte-scaled-text'));
  function fitText() {
    scaled.forEach(function (el) {
      var container = el.closest('.sqs-html-content') || el.parentNode;
      var cw = container.clientWidth;
      if (!cw) return;
      el.style.fontSize = '100px';
      var w = el.scrollWidth;
      if (w) el.style.fontSize = (100 * cw / w) + 'px';
    });
  }

  function layout() { setHeaderHeight(); fitText(); }
  layout();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 60); });

  /* --- Galerie-Reel Pfeile -------------------------------------------- */
  doc.querySelectorAll('.sr-reel').forEach(function (reel) {
    var track = reel.querySelector('.sr-reel-track');
    function step(dir) {
      var items = track.children, center = track.scrollLeft + track.clientWidth / 2, target = null;
      for (var i = 0; i < items.length; i++) {
        var c = items[i].offsetLeft + items[i].offsetWidth / 2;
        if (dir > 0 && c > center + 5) { target = items[i]; break; }
        if (dir < 0 && c < center - 5) target = items[i];
      }
      if (!target) target = dir > 0 ? items[0] : items[items.length - 1];
      track.scrollTo({ left: target.offsetLeft + target.offsetWidth / 2 - track.clientWidth / 2 });
    }
    reel.querySelector('.sr-reel-prev').addEventListener('click', function () { step(-1); });
    reel.querySelector('.sr-reel-next').addEventListener('click', function () { step(1); });
  });

  /* --- Videos: Hinweis, falls die Videodatei noch fehlt ---------------- */
  doc.querySelectorAll('.sr-video video').forEach(function (v) {
    var src = v.querySelector('source');
    function missing() { v.closest('.sr-video').classList.add('is-missing'); }
    if (src) src.addEventListener('error', missing);
    v.addEventListener('error', missing);
  });

  /* --- Bokeh-Hintergrund pausieren ------------------------------------- */
  doc.querySelectorAll('.sr-bokeh-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var b = btn.parentNode.querySelector('.sr-bokeh');
      var paused = b.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.textContent = paused ? '▶' : '❚❚';
    });
  });

  /* --- Kontaktformular: öffnet das Mailprogramm mit vorbereiteter Mail -- */
  var form = doc.querySelector('.sr-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.sr-hp').value) return; // Spam-Schutz
      var f = form.elements;
      var name = (f.vorname.value + ' ' + f.nachname.value).trim();
      var subject = 'Anfrage über das Portfolio von ' + name;
      var text = f.nachricht.value + '\n\n—\n' + name + '\n' + f.email.value;
      var to = form.getAttribute('data-to');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      var note = form.querySelector('.sr-form-note');
      if (note) note.textContent = 'Dein Mailprogramm öffnet sich mit der vorbereiteten Nachricht. Falls nicht: schreib direkt an ' + to + '.';
    });
  }
})();
