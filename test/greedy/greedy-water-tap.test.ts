import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waterFilling } from '../../src/algorithms/greedy/greedy-water-tap/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-water-tap/trace.ts';
test('水量守恒', () => {
  const r = waterFilling([2, 5, 3], 6);
  assert.ok(Math.abs(r.levels.reduce((a, b) => a + b, 0) - 6) < 1e-6);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
