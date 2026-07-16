import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brentRoot } from '../../src/algorithms/optimization/opt-brent/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-brent/trace.ts';
test('Brent 求 √2', () => {
  const r = brentRoot((x) => x * x - 2, 0, 2);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
