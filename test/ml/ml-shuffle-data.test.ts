import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffleData } from '../../src/algorithms/ml/ml-shuffle-data/impl.ts';
test('打乱 元素不变', () => {
  assert.deepEqual(shuffleData([1, 2, 3, 4, 5], 1).sort(), [1, 2, 3, 4, 5]);
});
test('打乱 可复现', () => {
  assert.deepEqual(shuffleData([1, 2, 3], 7), shuffleData([1, 2, 3], 7));
});
