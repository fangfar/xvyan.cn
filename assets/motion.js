(() => {
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.site-header nav a')];
  const header = document.querySelector('.site-header');
  let scheduled = false;

  function updateNavigation() {
    scheduled = false;
    const boundary = header.getBoundingClientRect().bottom + 48;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= boundary) current = section;
    }
    const requested = sections.find(section => `#${section.id}` === window.location.hash);
    if (requested && Math.abs(requested.getBoundingClientRect().top - current.getBoundingClientRect().top) < 1) {
      current = requested;
    }
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    for (const link of links) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function scheduleNavigation() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateNavigation);
  }

  updateNavigation();
  document.documentElement.classList.add('has-scrollspy');
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation);
  window.addEventListener('pageshow', scheduleNavigation);
  window.addEventListener('hashchange', scheduleNavigation);

})();


(function () {
  var input = document.querySelector('[data-star-search]');
  if (!input) return;
  var tools = document.querySelector('[data-stars-tools]');
  if (tools) tools.hidden = false;
  var count = document.querySelector('[data-star-count]');
  var empty = document.querySelector('[data-star-empty]');
  var items = Array.prototype.slice.call(document.querySelectorAll('.star-list > li'));
  function showCount(visible) {
    if (count) count.textContent = '显示 ' + visible + ' / 共 ' + items.length;
  }
  showCount(items.length);
  input.addEventListener('input', function () {
    var query = input.value.trim().toLowerCase();
    var visible = 0;
    items.forEach(function (item) {
      var haystack = item.getAttribute('data-search') || '';
      var matches = !query || haystack.indexOf(query) !== -1;
      item.hidden = !matches;
      if (matches) visible += 1;
    });
    showCount(visible);
    if (empty) empty.hidden = visible !== 0;
  });
})();
