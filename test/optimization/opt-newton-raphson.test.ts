import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newtonRaphson } from '../../src/algorithms/optimization/opt-newton-raphson/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-newton-raphson/trace.ts';
test('牛顿求 √2', () => {
  const r = newtonRaphson(
    (x) => x * x - 2,
    (x) => 2 * x,
    1.5,
  );
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-8);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
