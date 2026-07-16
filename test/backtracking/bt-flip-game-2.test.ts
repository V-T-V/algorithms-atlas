import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btFlipGame2 } from '../../src/algorithms/backtracking/bt-flip-game-2/impl.ts';

test('bt-flip-game-2 ++++ 先手胜', () => {
  assert.equal(btFlipGame2('++++'), true);
});

test('bt-flip-game-2 +++ 先手胜（翻中间两个留单点）', () => {
  assert.equal(btFlipGame2('+++'), true);
});

test('bt-flip-game-2 无 ++ 段先手败', () => {
  assert.equal(btFlipGame2('--'), false);
});

test('bt-flip-game-2 + 偶数胜奇数败', () => {
  // 长度 2 胜
  assert.equal(btFlipGame2('++'), true);
  // 长度 1 无可翻
  assert.equal(btFlipGame2('+'), false);
});
