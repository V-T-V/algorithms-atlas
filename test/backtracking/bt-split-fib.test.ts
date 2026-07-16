import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitIntoFib } from '../../src/algorithms/backtracking/bt-split-fib/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-split-fib/trace.ts';
test('splitIntoFib 正确', () => {
  assert.deepEqual(splitIntoFib('11235813'), [1, 1, 2, 3, 5, 8, 13]);
  assert.deepEqual(splitIntoFib('112358130'), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
