import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tictactoe } from '../../src/algorithms/game/tic-tac-toe/impl.ts';

test('tic-tac-toe 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof tictactoe === 'function');
});
