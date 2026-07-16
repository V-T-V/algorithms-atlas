import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpGame2, type JumpGame2Hooks } from '../../src/algorithms/greedy/jump-game-2/impl.ts';

test('jump-game-2 [2,3,1,1,4] = 2', () => {
  // LeetCode 示例：0→1→4
  assert.equal(jumpGame2([2, 3, 1, 1, 4]), 2);
});

test('jump-game-2 [2,3,0,1,4] = 2', () => {
  assert.equal(jumpGame2([2, 3, 0, 1, 4]), 2);
});

test('jump-game-2 单元素 = 0', () => {
  assert.equal(jumpGame2([5]), 0);
  assert.equal(jumpGame2([0]), 0);
});

test('jump-game-2 两元素 = 1', () => {
  assert.equal(jumpGame2([1, 0]), 1);
  assert.equal(jumpGame2([2, 3]), 1);
});

test('jump-game-3 全 1 数组 = n-1', () => {
  assert.equal(jumpGame2([1, 1, 1, 1, 1]), 4);
});

test('jump-game-2 一次跨到底 = 1', () => {
  assert.equal(jumpGame2([5, 0, 0, 0, 0, 0]), 1);
});

test('jump-game-2 结果 <= n-1', () => {
  const cases = [
    [2, 3, 1, 1, 4],
    [1, 1, 1, 1],
    [5, 4, 3, 2, 1, 0],
  ];
  for (const c of cases) {
    const r = jumpGame2(c);
    assert.ok(r <= c.length - 1, `步数 ${r} 应 <= ${c.length - 1}`);
  }
});

test('jump-game-2 钩子被调用', () => {
  let steps = 0;
  let jumps = 0;
  const hooks: JumpGame2Hooks = {
    onStep: () => steps++,
    onJump: () => jumps++,
  };
  jumpGame2([2, 3, 1, 1, 4], hooks);
  assert.ok(steps > 0);
  assert.equal(jumps, 2);
});
