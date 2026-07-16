import { test } from 'node:test';
import assert from 'node:assert/strict';
import { batchGradientDescent } from '../../src/algorithms/optimization/opt-gradient-batch-3/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-gradient-batch-3/trace.ts';
test('BGD 拟合 y=2x', () => {
  const r = batchGradientDescent([[1], [2], [3]], [2, 4, 6], 0.1, 500);
  assert.ok(Math.abs(r.w[0]! - 2) < 0.5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
