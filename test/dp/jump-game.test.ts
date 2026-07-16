import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpGame } from '../../src/algorithms/dp/jump-game/impl.ts';

test('jump-game 基本行为', () => {
  assert.equal(jumpGame([]), true); // 已在末格
  assert.equal(jumpGame([0]), true); // 单格
  assert.equal(jumpGame([1]), true);
});

test('jump-game 经典用例', () => {
  // LeetCode 55：[2,3,1,1,4] → true
  assert.equal(jumpGame([2, 3, 1, 1, 4]), true);
  // [3,2,1,0,4] → false（被 0 卡住）
  assert.equal(jumpGame([3, 2, 1, 0, 4]), false);
});

test('jump-game 首格为 0', () => {
  assert.equal(jumpGame([0, 1]), false); // 起点 0 且非末格
  assert.equal(jumpGame([0]), true);
});

test('jump-game 中途 0 但可越过', () => {
  assert.equal(jumpGame([3, 0, 0, 1, 0]), true); // 0→3→4，越过中段 0
  assert.equal(jumpGame([1, 0, 1, 0]), false); // 必落在中段 0
});

test('jump-game 钩子被调用', () => {
  let visit = 0;
  let extend = 0;
  let done: boolean | null = null;
  jumpGame([2, 3, 1, 1, 4], {
    onVisit: () => visit++,
    onExtend: () => extend++,
    onDone: (ok) => {
      done = ok;
    },
  });
  assert.ok(visit >= 1, '应触发 onVisit');
  assert.ok(extend >= 1, '应触发 onExtend');
  assert.equal(done, true);
});
