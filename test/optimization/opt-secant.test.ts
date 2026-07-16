import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secantMethod } from '../../src/algorithms/optimization/opt-secant/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-secant/trace.ts';
test('割线法求 √2', () => {
  const r = secantMethod((x) => x * x - 2, 1, 2);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
