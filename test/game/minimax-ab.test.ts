import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minimaxab } from '../../src/algorithms/game/minimax-ab/impl.ts';

test('minimax-ab 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof minimaxab === 'function');
});
