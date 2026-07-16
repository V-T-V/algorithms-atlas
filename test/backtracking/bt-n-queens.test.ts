import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totalNQueens } from '../../src/algorithms/backtracking/bt-n-queens/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-n-queens/trace.ts';
test('totalNQueens 正确', () => {
  assert.equal(totalNQueens(4), 2);
  assert.equal(totalNQueens(8), 92);
  assert.equal(totalNQueens(1), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
