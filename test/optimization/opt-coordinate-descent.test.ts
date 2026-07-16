import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coordinateDescent } from '../../src/algorithms/optimization/opt-coordinate-descent/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-coordinate-descent/trace.ts';
test('坐标下降近 (1,2)', () => {
  const r = coordinateDescent((x) => (x[0]! - 1) ** 2 + (x[1]! - 2) ** 2, [0, 0], 100, 0.05);
  assert.ok(r.fx < 0.5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
