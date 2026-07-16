import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mctsuct } from '../../src/algorithms/game/mcts-uct/impl.ts';

test('mcts-uct 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof mctsuct === 'function');
});
