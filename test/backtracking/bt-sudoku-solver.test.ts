import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveSudoku } from '../../src/algorithms/backtracking/bt-sudoku-solver/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-sudoku-solver/trace.ts';
test('solveSudoku 正确', () => {
  const b = [
    ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
    ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
    ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
    ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
    ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
    ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
    ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
    ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
    ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
  ].map((r) => [...r]);
  assert.equal(solveSudoku(b), true);
  assert.equal(b[0]![0], '5');
  assert.equal(b[0]![2], '4');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
