import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqp } from '../../src/algorithms/optimization/opt-sqp/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-sqp/trace.ts';
test('SQP 满足约束', () => {
  const r = sqp(
    (x) => x * x,
    (x) => [2 * x],
    (x) => x - 2,
    () => 1,
    0,
    100,
  );
  assert.ok(Math.abs(r.x - 2) < 1.0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
