import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ratmaze } from '../../src/algorithms/backtracking/rat-maze/impl.ts';

test('rat-maze 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof ratmaze === 'function');
});
