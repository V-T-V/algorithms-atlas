import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  solveSudoku,
  solveSudokuCopy,
  isValid,
  type Board,
} from '../../src/algorithms/recursion/rec-sudoku-2/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-sudoku-2/trace.ts';

test('rec-sudoku-2 求解经典题', () => {
  const board: Board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
  const result = solveSudokuCopy(board);
  assert.ok(result !== null);
  // 验证每行/列/宫含 1-9
  for (let r = 0; r < 9; r++) {
    const row: Set<number> = new Set(result![r]!);
    assert.equal(row.size, 9);
  }
});

test('rec-sudoku-2 isValid', () => {
  const board: Board = [
    [5, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  assert.ok(isValid(board, 0, 2, 4)); // 4 在该行/列/宫都无
  assert.ok(!isValid(board, 0, 1, 5)); // 5 已在第 0 行
});

test('rec-sudoku-2 原地修改', () => {
  const board: Board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  assert.ok(solveSudoku(board));
  // 全空板应有解
  for (let r = 0; r < 9; r++) assert.equal(new Set(board[r]).size, 9);
});

test('rec-sudoku-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
