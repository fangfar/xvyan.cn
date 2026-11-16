const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist', 'analog');
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'questions.js'), 'utf8') + fs.readFileSync(path.join(root, 'solutions.js'), 'utf8') + '; globalThis.groupsForTest = groups;', context);
const questions = context.groupsForTest.flatMap(group => group.items);
assert.equal(questions.length, 19);
assert.equal(new Set(questions.map(question => question.id)).size, questions.length);
const vector = new Set(['26', '27', '28', '210', '36', '37', '39', 'bjt', 'mos', 'diff', 'curve1', 'curve2']);
for (const question of questions) {
  assert.ok(question.description && question.key && question.result && question.steps.length, question.id);
  if (question.image) assert.ok(fs.existsSync(path.join(root, 'images', `${question.image}.${vector.has(question.image) ? 'svg' : 'png'}`)), question.id);
  if (question.answerImage) assert.ok(fs.existsSync(path.join(root, 'images', `${question.answerImage}.png`)), question.id);
}
assert.ok(questions.find(q => q.id === '6.6').description.includes('10 mV'));
for (const name of ['bjt-dc.svg', 'bjt-ac.svg']) assert.ok(fs.existsSync(path.join(root, 'images', name)));
assert.ok(!fs.readFileSync(path.join(root, 'questions.js'), 'utf8').includes('你在学习通上原选'));
console.log('Analog review checks passed: 19 questions, unique IDs, answers, and all question images.');
