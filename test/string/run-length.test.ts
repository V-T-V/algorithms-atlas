import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runLength, decodeRuns } from '../../src/algorithms/string/run-length/impl.ts';

test('runLength 基本编码', () => {
  assert.deepEqual(runLength('aaabbc'), [
    { char: 'a', count: 3, start: 0 },
    { char: 'b', count: 2, start: 3 },
    { char: 'c', count: 1, start: 5 },
  ]);
  assert.deepEqual(runLength(''), []);
  assert.deepEqual(runLength('a'), [{ char: 'a', count: 1, start: 0 }]);
});

test('runLength 可逆', () => {
  for (const s of ['aaabbc', 'aabbccdd', 'xyz', 'aaaa']) {
    assert.equal(decodeRuns(runLength(s)), s);
  }
});

test('runLength 钩子', () => {
  let runs = 0;
  runLength('aaabb', { onRun: () => runs++ });
  assert.equal(runs, 2);
});
