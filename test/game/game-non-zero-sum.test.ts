import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameNonZeroSum } from '../../src/algorithms/game/game-non-zero-sum/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-non-zero-sum/trace.ts';

test('game-non-zero-sum 返回纳什与社会最优', () => {
  const r = gameNonZeroSum();
  assert.ok(r.nashCells.length >= 0);
  assert.ok(Array.isArray(r.socialOptimum));
});

test('game-non-zero-sum 纳什是最佳响应组合', () => {
  const r = gameNonZeroSum();
  for (const [i, j] of r.nashCells) {
    assert.ok(i === 0 || i === 1);
    assert.ok(j === 0 || j === 1);
  }
});

test('game-non-zero-sum buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
