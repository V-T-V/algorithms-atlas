import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameSilverDollar } from '../../src/algorithms/game/game-silver-dollar/impl.ts';

test('game-silver-dollar 返回布尔', () => {
  assert.equal(typeof gameSilverDollar([0, 2, 4, 6]), 'boolean');
});

test('game-silver-dollar 相邻紧贴间隔 0', () => {
  // 全部紧贴：间隔都为 0 → xor 0 → 先手必败
  assert.equal(gameSilverDollar([0, 1, 2, 3]), false);
});

test('game-silver-dollar 单枚硬币可移动则胜', () => {
  assert.equal(gameSilverDollar([3]), true);
  assert.equal(gameSilverDollar([0]), false);
});
