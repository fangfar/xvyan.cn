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
  const input = { value: '', addEventListener(type, fn) { this.onInput = fn; } };
  const tools = { hidden: true }, count = {}, empty = { hidden: true };
  const items = ['owner/android Android 官方工具', 'owner/music 音乐播放器'].map(text => ({ hidden: false, getAttribute() { return text.toLowerCase(); } }));
  const root = { scrollHeight: 5000, classList: classes() };
  const document = {
    documentElement: root,
    querySelector: selector => ({
      '.site-header': { getBoundingClientRect: () => ({ bottom: 100 }) },
      '[data-star-search]': input, '[data-stars-tools]': tools,
      '[data-star-count]': count, '[data-star-empty]': empty,
    }[selector] || null),
    querySelectorAll: selector => selector === 'main > section[id]' ? sections : selector === '.site-header nav a' ? links : selector === '.star-list > li' ? items : [],
  };
  Object.assign(window, {
    addEventListener: (type, callback) => { window.events[type] = callback; },
    requestAnimationFrame: callback => window.frames.push(callback),
  });
  vm.runInNewContext(fs.readFileSync('assets/motion.js', 'utf8'), { document, window });
  const active = () => links.filter(link => link.attrs['aria-current'] === 'location').map(link => link.hash);
  const scrollTo = y => { window.scrollY = y; window.events.scroll(); window.frames.splice(0).forEach(callback => callback()); };
  return { window, active, scrollTo, input, tools, count, empty, items };
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

assert.equal(page.tools.hidden, false);
for (const [query, expected] of [['ANDROID', [false, true]], ['音乐', [true, false]], ['missing', [true, true]], ['  ', [false, false]]]) {
  page.input.value = query;
  page.input.onInput();
  assert.deepEqual(page.items.map(item => item.hidden), expected);
  assert.equal(page.empty.hidden, expected.some(hidden => !hidden));
}
console.log('Collection search checks passed: case, Chinese text, empty results and clearing.');
require('./test_theme.cjs');
