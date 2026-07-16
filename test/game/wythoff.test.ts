import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wythoff } from '../../src/algorithms/game/wythoff/impl.ts';

test('wythoff 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof wythoff === 'function');
});
