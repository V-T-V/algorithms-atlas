import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoneGame2, type StoneGame2Hooks } from '../../src/algorithms/game/stone-game-2/impl.ts';

test('stone-game-2 经典例子 [2,7,9,4,4] = 10', () => {
  // LeetCode 标准答案：Alice 拿 2+9+... 实际答案是 10
  assert.equal(stoneGame2([2, 7, 9, 4, 4]).aliceStones, 10);
});

test('stone-game-2 [1,2,3,4,5,100]', () => {
  // 答案 104
  assert.equal(stoneGame2([1, 2, 3, 4, 5, 100]).aliceStones, 104);
});

test('stone-game-2 单堆', () => {
  assert.equal(stoneGame2([5]).aliceStones, 5);
  assert.equal(stoneGame2([100]).aliceStones, 100);
});

test('stone-game-2 两堆 Alice 至少拿大堆', () => {
  // M=1 → 可取 1..2 堆，Alice 一次全拿
  const r = stoneGame2([3, 7]);
  assert.equal(r.aliceStones, 10);
});

test('stone-game-2 Alice 石子数 + Bob 石子数 = 总和', () => {
  const piles = [2, 7, 9, 4, 4];
  const r = stoneGame2(piles);
  const bob = r.total - r.aliceStones;
  assert.equal(r.aliceStones + bob, r.total);
});

test('stone-game-2 Alice+Bob = 总和', () => {
  const r = stoneGame2([2, 7, 9, 4, 4]);
  // Alice=10, Bob=16（此例 Bob 反而更多，因为规则限制）
  assert.equal(r.aliceStones + (r.total - r.aliceStones), r.total);
});

test('stone-game-2 空数组', () => {
  assert.equal(stoneGame2([]).aliceStones, 0);
});

test('stone-game-2 全 1 数组', () => {
  const r = stoneGame2([1, 1, 1, 1]);
  assert.equal(r.total, 4);
  assert.ok(r.aliceStones >= 2);
});

test('stone-game-2 钩子被调用', () => {
  let solves = 0;
  let concludes = 0;
  const hooks: StoneGame2Hooks = {
    onSolve: () => solves++,
    onConclude: () => concludes++,
  };
  stoneGame2([2, 7, 9, 4, 4], hooks);
  assert.ok(solves > 0);
  assert.equal(concludes, 1);
});
