import { test } from 'node:test';
import assert from 'node:assert/strict';
import { augmentedLagrangian } from '../../src/algorithms/optimization/opt-penalty-aug-lag/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-penalty-aug-lag/trace.ts';
test('ALM 满足约束', () => {
  const r = augmentedLagrangian(
    (x) => x * x,
    (x) => 2 * x,
    (x) => x - 2,
    () => 1,
    0,
    50,
  );
  assert.ok(Math.abs(r.x - 2) < 0.5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
