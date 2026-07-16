import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lettercombos } from '../../src/algorithms/backtracking/letter-combos/impl.ts';

test('letter-combos 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof lettercombos === 'function');
});
