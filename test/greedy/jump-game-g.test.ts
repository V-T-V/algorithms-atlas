import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpGame, type JumpGameGHooks } from '../../src/algorithms/greedy/jump-game-g/impl.ts';

test('jump-game-g [2,3,1,1,4] 可达', () => {
  assert.equal(jumpGame([2, 3, 1, 1, 4]).canReach, true);
});

test('jump-game-g [3,2,1,0,4] 不可达', () => {
  assert.equal(jumpGame([3, 2, 1, 0, 4]).canReach, false);
});

test('jump-game-g 单元素可达', () => {
  assert.equal(jumpGame([0]).canReach, true);
  assert.equal(jumpGame([5]).canReach, true);
});

test('jump-game-g 两元素', () => {
  assert.equal(jumpGame([1, 0]).canReach, true);
  assert.equal(jumpGame([0, 1]).canReach, false); // 起点 0 跳不动
});

test('jump-game-g 全 0 除末尾', () => {
  // [0] 可达；[0,0] 不可达
  assert.equal(jumpGame([0]).canReach, true);
  assert.equal(jumpGame([0, 0]).canReach, false);
});

test('jump-game-g [0,2,3] 不可达', () => {
  assert.equal(jumpGame([0, 2, 3]).canReach, false);
});

test('jump-game-g 大跨步可达', () => {
  assert.equal(jumpGame([5, 0, 0, 0, 0, 0]).canReach, true);
});

test('jump-game-g 钩子被调用', () => {
  let steps = 0;
  let concludes = 0;
  const hooks: JumpGameGHooks = {
    onStep: () => steps++,
    onConclude: () => concludes++,
  };
  jumpGame([2, 3, 1, 1, 4], hooks);
  assert.ok(steps > 0);
  assert.equal(concludes, 1);
});
