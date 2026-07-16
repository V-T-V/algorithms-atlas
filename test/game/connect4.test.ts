import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connect4 } from '../../src/algorithms/game/connect4/impl.ts';

test('connect4 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof connect4 === 'function');
});
