import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gomoku } from '../../src/algorithms/game/gomoku/impl.ts';

test('gomoku 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof gomoku === 'function');
});
