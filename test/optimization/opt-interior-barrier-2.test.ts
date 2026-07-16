import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interiorBarrier } from '../../src/algorithms/optimization/opt-interior-barrier-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-interior-barrier-2/trace.ts';
test('内点法逼近边界', () => {
  const r = interiorBarrier(
    (x) => (x + 1) * (x + 1),
    (x) => 2 * (x + 1),
    5,
    0,
    1,
    60,
  );
  assert.ok(r.x >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
