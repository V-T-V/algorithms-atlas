import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shampoo } from '../../src/algorithms/optimization/opt-shampoo/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-shampoo/trace.ts';
test('Shampoo 收敛', () => {
  const w = shampoo((x) => [...x], [5, 5], 0.1, 1e-6, 200);
  const fx = 0.5 * w.reduce((a, b) => a + b * b, 0);
  assert.ok(fx < 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
