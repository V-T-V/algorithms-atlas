import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bashgame } from '../../src/algorithms/game/bash-game/impl.ts';

test('bash-game 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof bashgame === 'function');
});
