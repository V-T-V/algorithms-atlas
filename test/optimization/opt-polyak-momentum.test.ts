import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polyakMomentum } from '../../src/algorithms/optimization/opt-polyak-momentum/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-polyak-momentum/trace.ts';
test('Polyak 收敛到 0', () => {
  const r = polyakMomentum((x) => [...x], [5, 5], 0.05, 0.9, 300);
  assert.ok(r.fx < 0.1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
