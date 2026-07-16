import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kalman1d } from '../../src/algorithms/optimization/opt-kalman-1d/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-kalman-1d/trace.ts';
test('卡尔曼收敛到真值', () => {
  const est = kalman1d([5, 5, 5, 5, 5], 0, 1, 0.1, 0.5);
  assert.ok(Math.abs(est[est.length - 1]! - 5) < 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
