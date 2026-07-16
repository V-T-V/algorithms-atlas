import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle } from '../../src/algorithms/randomized/rand-shuffle-fy/impl.ts';
test('元素相同（多重集）', () => {
  const a = shuffle([1, 2, 3, 4, 5], 42);
  assert.deepEqual([...a].sort(), [1, 2, 3, 4, 5]);
});
test('可复现', () => {
  assert.deepEqual(shuffle([1, 2, 3], 7), shuffle([1, 2, 3], 7));
});
