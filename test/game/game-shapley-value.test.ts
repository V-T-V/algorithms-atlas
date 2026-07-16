import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shapleyValue } from '../../src/algorithms/game/game-shapley-value/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-shapley-value/trace.ts';
test('夏普利值和 = 总价值', () => {
  const v = (S: number[]) => (S.reduce((a, p) => a + [4, 3, 2][p]!, 0) >= 6 ? 1 : 0);
  const phi = shapleyValue(v, 3);
  const sum = phi.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
