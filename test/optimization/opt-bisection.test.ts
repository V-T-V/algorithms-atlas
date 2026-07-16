import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bisection } from '../../src/algorithms/optimization/opt-bisection/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bisection/trace.ts';
test('二分求 √2', () => {
  const r = bisection((x) => x * x - 2, 0, 2, 1e-9);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
