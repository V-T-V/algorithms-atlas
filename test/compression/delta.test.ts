import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delta, inverseDelta } from '../../src/algorithms/compression/delta/impl.ts';

test('delta：差分编码', () => {
  assert.deepEqual(delta([1, 3, 6, 10]).deltas, [1, 2, 3, 4]);
  assert.deepEqual(delta([5]).deltas, [5]);
  assert.deepEqual(delta([]).deltas, []);
});

test('delta 往返：inverseDelta 还原', () => {
  const data = [10, 13, 21, 30, 55];
  const d = delta(data);
  assert.deepEqual(inverseDelta(d.deltas), data);
});
