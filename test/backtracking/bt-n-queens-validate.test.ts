import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btNQueensValidate } from '../../src/algorithms/backtracking/bt-n-queens-validate/impl.ts';

test('bt-n-queens-validate 合法布局', () => {
  assert.equal(btNQueensValidate([1, 3, 0, 2]), true);
  assert.equal(btNQueensValidate([0]), true);
});

test('bt-n-queens-validate 同列冲突', () => {
  assert.equal(btNQueensValidate([0, 0]), false);
});

test('bt-n-queens-validate 对角线冲突', () => {
  assert.equal(btNQueensValidate([0, 1]), false); // 相邻对角
});

test('bt-n-queens-validate 列越界', () => {
  assert.equal(btNQueensValidate([0, 5]), false);
});
