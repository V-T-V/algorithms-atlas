import { test } from 'node:test';
import assert from 'node:assert/strict';
import { othello } from '../../src/algorithms/game/othello/impl.ts';

test('othello 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof othello === 'function');
});
