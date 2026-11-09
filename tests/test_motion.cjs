const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createPage() {
  const classes = () => {
    const values = new Set();
    return { add: (...names) => names.forEach(name => values.add(name)), remove: name => values.delete(name), contains: name => values.has(name) };
  };
  const ids = ['home', 'works', 'stars', 'about'];
  const window = { scrollY: 0, innerHeight: 800, events: {}, frames: [] };
  const sections = ids.map((id, i) => ({ id, getBoundingClientRect: () => ({ top: i * 1000 - window.scrollY }) }));
  const links = ids.map(id => ({ hash: `#${id}`, attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, removeAttribute(key) { delete this.attrs[key]; } }));
  const root = { scrollHeight: 5000, classList: classes() };
  const document = {
    documentElement: root,
    querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 100 }) }),
    querySelectorAll: selector => selector === 'main > section[id]' ? sections : selector === '.site-header nav a' ? links : [],
  };
  Object.assign(window, {
    addEventListener: (type, callback) => { window.events[type] = callback; },
    requestAnimationFrame: callback => window.frames.push(callback),
  });
  vm.runInNewContext(fs.readFileSync('assets/motion.js', 'utf8'), { document, window });
  const active = () => links.filter(link => link.attrs['aria-current'] === 'location').map(link => link.hash);
  const scrollTo = y => { window.scrollY = y; window.events.scroll(); window.frames.splice(0).forEach(callback => callback()); };
  return { window, active, scrollTo };
}

const page = createPage();
assert.deepEqual(page.active(), ['#home']);
page.scrollTo(2050);
assert.deepEqual(page.active(), ['#stars']);
page.scrollTo(4200);
assert.deepEqual(page.active(), ['#about']);
page.scrollTo(1000);
assert.deepEqual(page.active(), ['#works']);
page.window.events.scroll();
page.window.events.scroll();
assert.equal(page.window.frames.length, 1, 'Multiple scroll events share one frame');
console.log('Navigation checks passed: active section, upward scrolling, page bottom, frame batching; no reveal animations.');
