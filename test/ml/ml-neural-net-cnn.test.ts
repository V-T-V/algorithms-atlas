import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conv1d, maxPool1d } from '../../src/algorithms/ml/ml-neural-net-cnn/impl.ts';
test('conv1d 长度', () => {
  const out = conv1d([1, 2, 3, 4], [1, 0]);
  assert.equal(out.length, 3);
});
test('maxPool1d', () => {
  assert.deepEqual(maxPool1d([1, 5, 3, 2], 2), [5, 3]);
});
