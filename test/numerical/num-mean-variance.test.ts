import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanVariance } from '../../src/algorithms/numerical/num-mean-variance/impl.ts';
test('均值方差', () => {
  const s = meanVariance([1, 2, 3, 4, 5]);
  assert.equal(s.mean, 3);
  assert.ok(Math.abs(s.variance - 2.5) < 1e-9);
});
test('样本不足报错', () => {
  assert.throws(() => meanVariance([1]), RangeError);
});
