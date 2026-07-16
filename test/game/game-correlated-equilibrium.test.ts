import { test } from 'node:test';
import assert from 'node:assert/strict';
import { correlatedEquilibrium } from '../../src/algorithms/game/game-correlated-equilibrium/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-correlated-equilibrium/trace.ts';
test('对角分布是相关均衡', () => {
  assert.equal(
    correlatedEquilibrium([
      [0.5, 0],
      [0, 0.5],
    ]),
    true,
  );
});
test('纯背叛分布非相关均衡下协调', () => {
  // (D,D) 纳什 -> 行固定推荐 D 时无偏离
  assert.equal(
    correlatedEquilibrium([
      [0, 0],
      [0, 1],
    ]),
    true,
  );
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
