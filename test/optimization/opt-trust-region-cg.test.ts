import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trustRegionCg } from '../../src/algorithms/optimization/opt-trust-region-cg/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-trust-region-cg/trace.ts';
test('信赖域 CG 收敛到 (1,1)', () => {
  const f = (x: readonly number[]) => (x[0]! - 1) ** 2 + (x[1]! - 1) ** 2;
  const r = trustRegionCg(
    f,
    (x) => [2 * (x[0]! - 1), 2 * (x[1]! - 1)],
    () => [
      [2, 0],
      [0, 2],
    ],
    [0, 0],
    100,
  );
  assert.ok(r.fx < 0.1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
