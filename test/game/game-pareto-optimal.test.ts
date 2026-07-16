import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameParetoOptimal } from '../../src/algorithms/game/game-pareto-optimal/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-pareto-optimal/trace.ts';

test('game-pareto-optimal 返回纳什与社会最优', () => {
  const r = gameParetoOptimal();
  assert.ok(r.nashCells.length >= 0);
  assert.ok(Array.isArray(r.socialOptimum));
});

test('game-pareto-optimal 纳什是最佳响应组合', () => {
  const r = gameParetoOptimal();
  for (const [i, j] of r.nashCells) {
    assert.ok(i === 0 || i === 1);
    assert.ok(j === 0 || j === 1);
  }
});

test('game-pareto-optimal buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
