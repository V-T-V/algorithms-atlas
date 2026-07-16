import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicGoodsGame } from '../../src/algorithms/game/game-public-goods/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-public-goods/trace.ts';
test('全员贡献等于全员不贡献时收益相同', () => {
  const pAll = publicGoodsGame(10, [10, 10, 10, 10], 1.6);
  const pNone = publicGoodsGame(10, [0, 0, 0, 0], 1.6);
  assert.ok(Math.abs(pAll[0]! - pNone[0]!) < 1e-9);
});
test('m>1 时全贡献最优', () => {
  const pAll = publicGoodsGame(10, [10, 10], 3);
  assert.ok(pAll[0]! > 10);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
