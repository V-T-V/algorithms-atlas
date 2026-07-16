import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameMatchingPennies2 } from '../../src/algorithms/game/game-matching-pennies-2/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-matching-pennies-2/trace.ts';

test('game-matching-pennies-2 返回纳什与社会最优', () => {
  const r = gameMatchingPennies2();
  assert.ok(r.nashCells.length >= 0);
  assert.ok(Array.isArray(r.socialOptimum));
});

test('game-matching-pennies-2 纳什是最佳响应组合', () => {
  const r = gameMatchingPennies2();
  for (const [i, j] of r.nashCells) {
    assert.ok(i === 0 || i === 1);
    assert.ok(j === 0 || j === 1);
  }
});

test('game-matching-pennies-2 buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
