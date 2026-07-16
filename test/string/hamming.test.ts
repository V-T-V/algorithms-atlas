import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hamming } from '../../src/algorithms/string/hamming/impl.ts';

test('hamming 基本距离', () => {
  assert.equal(hamming('', ''), 0);
  assert.equal(hamming('A', 'A'), 0);
  assert.equal(hamming('A', 'B'), 1);
  assert.equal(hamming('karolin', 'kathrin'), 3);
  assert.equal(hamming('karolin', 'kerstin'), 3);
  assert.equal(hamming('toned', 'roses'), 3);
});

test('hamming 完全相同与完全不同', () => {
  assert.equal(hamming('AAAA', 'AAAA'), 0);
  assert.equal(hamming('AAAA', 'BBBB'), 4);
});

test('hamming 不等长抛错', () => {
  assert.throws(() => hamming('AB', 'ABC'));
});

test('hamming 钩子被调用', () => {
  let compares = 0;
  let diffs = 0;
  let done = -1;
  hamming('karolin', 'kathrin', {
    onCompare: () => compares++,
    onDiff: () => diffs++,
    onDone: (d) => (done = d),
  });
  assert.equal(compares, 7, '应比较 7 次');
  assert.equal(diffs, 3, '应有 3 处不同');
  assert.equal(done, 3);
});
