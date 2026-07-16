import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationsum } from '../../src/algorithms/backtracking/combination-sum/impl.ts';

test('combination-sum 基本行为', () => {
  // 算法存在且可调用
  assert.ok(typeof combinationsum === 'function');
});
