import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whale } from '../../src/algorithms/optimization/opt-whale/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-whale/trace.ts';
test('鲸鱼收敛', () => {
  const r = whale((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 20, 50);
  assert.ok(r.bestFit < 5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
