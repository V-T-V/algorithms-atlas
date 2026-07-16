import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationsum2 } from '../../src/algorithms/backtracking/combination-sum-2/impl.ts';

test('combination-sum-2 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof combinationsum2 === 'function');
});
