import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hamiltonpath } from '../../src/algorithms/backtracking/hamilton-path/impl.ts';

test('hamilton-path 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof hamiltonpath === 'function');
});
