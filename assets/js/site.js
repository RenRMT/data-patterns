(function () {
  var root = document.documentElement;
  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* storage unavailable: the page still works */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // Theme toggle (light / dark), remembered between visits.
  var toggle = document.querySelector('[data-theme-toggle]');
  var label = document.querySelector('[data-theme-label]');
  function paintTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    if (toggle) toggle.setAttribute('aria-pressed', String(dark));
    if (label) label.textContent = dark ? 'Dark' : 'Light';
  }
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('theme', next);
    paintTheme();
  });
  paintTheme();

  // Stack switch: show examples for one stack, remembered between pages.
  var buttons = document.querySelectorAll('[data-set-stack]');
  function paint() {
    var current = root.getAttribute('data-stack') || '';
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-stack') === current));
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var value = b.getAttribute('data-set-stack');
      if (value) { root.setAttribute('data-stack', value); store('stack', value); }
      else { root.removeAttribute('data-stack'); store('stack', null); }
      paint();
    });
  });
  paint();

  // Catalog filter: matches names, plain descriptions and search terms.
  var filter = document.querySelector('[data-filter]');
  if (filter) {
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      document.querySelectorAll('.card[data-k]').forEach(function (card) {
        card.hidden = q !== '' && card.getAttribute('data-k').indexOf(q) === -1;
      });
      document.querySelectorAll('[data-filter-group]').forEach(function (group) {
        group.hidden = !group.querySelector('.card:not([hidden])');
      });
    });
  }

  // Self-assessment: remember ticks, point at the first open question.
  var list = document.querySelector('[data-assess]');
  if (list) {
    var boxes = list.querySelectorAll('input[type=checkbox]');
    var result = document.querySelector('[data-assess-result]');
    var saved = (read('assess') || '').split(',');
    function update() {
      var done = [], next = null;
      boxes.forEach(function (box) {
        var row = box.closest('li');
        row.classList.remove('is-next');
        if (box.checked) done.push(box.value);
        else if (!next) next = row;
      });
      store('assess', done.join(','));
      if (!result) return;
      if (next) {
        next.classList.add('is-next');
        result.textContent = done.length + ' of ' + boxes.length + ' in place. Your next step: ' +
          next.getAttribute('data-title') + '.';
      } else {
        result.textContent = 'All ' + boxes.length + ' in place. Re-check after the next change of staff, source or tool.';
      }
    }
    boxes.forEach(function (box) {
      box.checked = saved.indexOf(box.value) !== -1;
      box.addEventListener('change', update);
    });
    var reset = document.querySelector('[data-assess-reset]');
    if (reset) reset.addEventListener('click', function () {
      boxes.forEach(function (box) { box.checked = false; });
      update();
    });
    update();
  }
})();
