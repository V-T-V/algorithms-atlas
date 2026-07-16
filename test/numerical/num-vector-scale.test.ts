import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vScale, vNormalize } from '../../src/algorithms/numerical/num-vector-scale/impl.ts';
test('数乘', () => {
  assert.deepEqual(vScale([1, 2, 3], 2), [2, 4, 6]);
});
test('归一化', () => {
  const n = vNormalize([3, 4]);
  assert.ok(Math.abs(Math.hypot(n[0]!, n[1]!) - 1) < 1e-9);
});
