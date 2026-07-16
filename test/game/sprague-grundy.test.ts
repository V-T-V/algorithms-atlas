import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spraguegrundy } from '../../src/algorithms/game/sprague-grundy/impl.ts';

test('sprague-grundy 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof spraguegrundy === 'function');
});
