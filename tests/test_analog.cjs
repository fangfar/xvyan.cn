const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..', 'dist', 'analog');
const context = {};
vm.runInNewContext(['questions.js', 'stage.js'].map(name => fs.readFileSync(path.join(root, name), 'utf8')).join('\n') + '; globalThis.groupsForTest = groups;', context);
const questions = context.groupsForTest.flatMap(group => group.items);
assert.equal(questions.length, 27);
assert.equal(new Set(questions.map(question => question.id)).size, questions.length);
for (const question of questions) {
  assert.ok(question.description && question.key && question.result && question.steps.length, question.id);
  if (question.image) assert.ok(fs.existsSync(path.join(root, 'images', question.image)), question.id);
  if (question.answerImage) assert.ok(fs.existsSync(path.join(root, 'images', question.answerImage)), question.id);
}
const images = path.join(root, 'images');
const referenced = new Set(questions.flatMap(q => [q.image, q.answerImage].filter(Boolean)));
for (const question of questions) {
  for (const step of question.steps) {
    for (const [, image] of step.body.matchAll(/src="images\/([^"?]+)/g)) referenced.add(image);
  }
}
assert.deepEqual([...referenced].sort(), fs.readdirSync(images).sort());
assert.equal([...referenced].filter(image => image.endsWith('.webp')).length, 13);
assert.ok(!fs.existsSync(path.join(root, 'solutions.js')));
const differential = questions.find(q => q.id === '6.6');
assert.match(differential.description, /双入单出、双入双出/);
assert.doesNotMatch(differential.description, /10 mV/);
assert.match(differential.result, /−102\.2/);
const stage = questions.filter(q => q.id.startsWith('stage-'));
assert.equal(stage.filter(q => q.options).length, 5);
assert.equal(stage.filter(q => q.image).length, 3);
const repeated = stage.find(q => q.id === 'stage-5');
assert.deepEqual(Array.from(repeated.optionLabels), ['A/B','C','D']);
assert.equal(new Set(repeated.options).size, 3);
console.log('Analog review checks passed: 27 questions, unique IDs, answers, and all question images.');
