const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createPage(reducedMotion = false, supportsObserver = true) {
  const classes = () => {
    const values = new Set();
    return { add: (...names) => names.forEach(name => values.add(name)), remove: name => values.delete(name), contains: name => values.has(name) };
  };
  const ids = ['home', 'works', 'articles', 'stars', 'about'];
  const window = { scrollY: 0, innerHeight: 800, events: {}, frames: [] };
  const sections = ids.map((id, i) => ({ id, getBoundingClientRect: () => ({ top: i * 1000 - window.scrollY }) }));
  const links = ids.map(id => ({ hash: `#${id}`, attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, removeAttribute(key) { delete this.attrs[key]; } }));
  const item = { classList: classes(), getBoundingClientRect: () => ({ top: 1200 }) };
  const media = { matches: reducedMotion, addEventListener: (_, callback) => { media.change = callback; } };
  const root = { scrollHeight: 5000, classList: classes() };
  const document = {
    documentElement: root,
    querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 100 }) }),
    querySelectorAll: selector => selector === 'main > section[id]' ? sections : selector === '.site-header nav a' ? links : [item],
  };
  let observer;
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.observed = new Set(); observer = this; }
    observe(target) { this.observed.add(target); }
    unobserve(target) { this.observed.delete(target); }
    disconnect() { this.observed.clear(); }
  }
  Object.assign(window, {
    addEventListener: (type, callback) => { window.events[type] = callback; },
    requestAnimationFrame: callback => window.frames.push(callback),
    matchMedia: () => media,
  });
  if (supportsObserver) window.IntersectionObserver = IntersectionObserver;
  vm.runInNewContext(fs.readFileSync('assets/motion.js', 'utf8'), { document, window, IntersectionObserver });
  const active = () => links.filter(link => link.attrs['aria-current'] === 'location').map(link => link.hash);
  const scrollTo = y => { window.scrollY = y; window.events.scroll(); window.frames.splice(0).forEach(callback => callback()); };
  return { window, active, scrollTo, item, media, observer };
}

const page = createPage();
assert.deepEqual(page.active(), ['#home']);
page.scrollTo(2050);
assert.deepEqual(page.active(), ['#articles']);
page.scrollTo(3050);
assert.deepEqual(page.active(), ['#stars']);
page.scrollTo(4200);
assert.deepEqual(page.active(), ['#about']);
page.scrollTo(1000);
assert.deepEqual(page.active(), ['#works']);
page.window.events.scroll();
page.window.events.scroll();
assert.equal(page.window.frames.length, 1, 'Multiple scroll events share one frame');
assert.equal(page.item.classList.contains('reveal-pending'), true);
page.observer.callback([{ target: page.item, isIntersecting: false }]);
assert.equal(page.item.classList.contains('reveal-pending'), true);
page.observer.callback([{ target: page.item, isIntersecting: true }]);
assert.equal(page.item.classList.contains('reveal-pending'), false);
assert.equal(page.observer.observed.size, 0, 'Reveals play once');
assert.equal(createPage(true).item.classList.contains('reveal-pending'), false);
assert.equal(createPage(false, false).item.classList.contains('reveal-pending'), false);
const changedPreference = createPage();
changedPreference.media.matches = true;
changedPreference.media.change();
assert.equal(changedPreference.item.classList.contains('reveal-pending'), false);
assert.equal(changedPreference.observer.observed.size, 0);
console.log('Motion checks passed: scroll tracking, frame batching, reveal once, reduced motion, observer fallback.');
