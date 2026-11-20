(function () {
  // Sound buttons: one video plays with sound at a time.
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.sound'));
  function setSound(btn, on) {
    var v = btn.parentNode.querySelector('video');
    v.muted = !on;
    if (on) { v.currentTime = 0; v.play(); }
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
  }
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var turnOn = btn.getAttribute('aria-pressed') !== 'true';
      buttons.forEach(function (b) { if (b !== btn) setSound(b, false); });
      setSound(btn, turnOn);
    });
  });

  // Carousel arrows.
  var track = document.getElementById('carousel');
  var arrows = document.querySelectorAll('.car-btn');
  function update() {
    var max = track.scrollWidth - track.clientWidth - 2;
    arrows[0].disabled = track.scrollLeft <= 2;
    arrows[1].disabled = track.scrollLeft >= max;
  }
  Array.prototype.forEach.call(arrows, function (a) {
    a.addEventListener('click', function () {
      var step = track.querySelector('li').getBoundingClientRect().width + 20;
      track.scrollBy({ left: step * Number(a.getAttribute('data-dir')), behavior: 'smooth' });
    });
  });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Buttons that pre-select what the visitor is interested in.
  var select = document.getElementById('f-plan');
  Array.prototype.forEach.call(document.querySelectorAll('[data-plan]'), function (a) {
    a.addEventListener('click', function () { select.value = a.getAttribute('data-plan'); });
  });

  // Enquiry form: send without leaving the page.
  var form = document.getElementById('enquiry');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    status.className = 'status'; status.textContent = '';
    fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.success) throw new Error(d.message);
        form.reset();
        status.className = 'status ok';
        status.textContent = "Thanks! Your message is on its way. I'll be in touch within one working day.";
      })
      .catch(function () {
        status.className = 'status err';
        status.innerHTML = 'Sorry, that didn’t send. Please email <a href="mailto:hello@7vcreative.co.uk">hello@7vcreative.co.uk</a> instead.';
      })
      .then(function () { btn.disabled = false; btn.textContent = 'Send'; });
  });
})();
