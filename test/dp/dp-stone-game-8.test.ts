import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoneGame8 } from '../../src/algorithms/dp/dp-stone-game-8/impl.ts';

test('stone-game-8 [1,2,3,4,5]', () => {
  // Alice 取全部得分 15 即结束
  assert.equal(stoneGame8([1, 2, 3, 4, 5]), 15);
});

test('stone-game-8 单块石头无法操作', () => {
  assert.equal(stoneGame8([-2]), 0);
});

test('stone-game-8 两块', () => {
  // 必须取两块合并，得分 7，结束
  assert.equal(stoneGame8([3, 4]), 7);
});

test('stone-game-8 含负数', () => {
  assert.equal(stoneGame8([7, -6, 5, 10, 5, -2, -4]), 15);
});

test('stone-game-8 三块', () => {
  // [1,-1,1]: 取前2 得 0 分, 剩 [0,1] Bob 取得 1 => Alice-Bob = 0-1 = -1;
  // 取前3 得 1 分 结束 => +1. 选 +1
  assert.equal(stoneGame8([1, -1, 1]), 1);
});
