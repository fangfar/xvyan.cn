const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist', 'analog');
const context = {};
vm.runInNewContext(['questions.js', 'solutions.js', 'stage.js'].map(name => fs.readFileSync(path.join(root, name), 'utf8')).join('\n') + '; globalThis.groupsForTest = groups;', context);
const questions = context.groupsForTest.flatMap(group => group.items);
assert.equal(questions.length, 27);
assert.equal(new Set(questions.map(question => question.id)).size, questions.length);
for (const question of questions) {
  assert.ok(question.description && question.key && question.result && question.steps.length, question.id);
  if (question.image) assert.ok(fs.existsSync(path.join(root, 'images', `${question.image}.svg`)), question.id);
  if (question.answerImage) assert.ok(fs.existsSync(path.join(root, 'images', `${question.answerImage}.svg`)), question.id);
}
const diagram = name => fs.readFileSync(path.join(root, 'images', `${name}.svg`), 'utf8');
for (const name of ['26', '27', '28', '210', '36', '37', '39', 'bjt', 'mos', 'diff', 'bjt-dc', 'bjt-ac']) {
  const dimensions = [...diagram(name).matchAll(/<rect [^>]*width="([\d.]+)" height="([\d.]+)"/g)];
  assert.ok(dimensions.length, `${name}: resistor symbols`);
  for (const [, width, height] of dimensions) assert.ok(Number(width) <= 44 && Number(height) <= 44, `${name}: oversized resistor`);
}
for (const name of ['27', '28']) {
  const sizes = [...diagram(name).matchAll(/<rect [^>]*width="([\d.]+)" height="([\d.]+)"/g)];
  assert.ok(sizes.every(([, w, h]) => Math.max(Number(w), Number(h)) === 34), `${name}: compact resistor bodies`);
}
assert.ok(diagram('27').includes('M500 295H465V310'), '2.7 non-inverting connection exits the amplifier');
assert.ok(diagram('28').includes('M740 220V290'), '2.8 feedback joins outside the amplifier');
assert.ok(diagram('28').includes('M690 360H720'), '2.8 non-inverting connection exits the amplifier');
assert.ok(questions.find(q => q.id === '6.6').description.includes('10 mV'));
for (const name of ['bjt-dc.svg', 'bjt-ac.svg']) assert.ok(fs.existsSync(path.join(root, 'images', name)));
assert.ok(!fs.readFileSync(path.join(root, 'questions.js'), 'utf8').includes('你在学习通上原选'));
const stage = questions.filter(question => question.id.startsWith('stage-'));
assert.equal(stage.filter(question => question.options?.length === 4).length, 5);
assert.equal(stage.filter(question => question.image).length, 3);
for (const question of questions) {
  for (const item of question.steps) {
    for (const [, image] of item.body.matchAll(/src="images\/([^"?]+)/g)) assert.ok(fs.existsSync(path.join(root, 'images', image)), image);
  }
}
console.log('Analog review checks passed: 27 questions, unique IDs, answers, and all question images.');
