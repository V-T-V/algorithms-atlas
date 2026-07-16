import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sudokuSolver,
  isValidSolution,
  type Board,
} from '../../src/algorithms/backtracking/sudoku-solver/impl.ts';

// LeetCode 37 经典示例（有唯一解）
const PUZZLE: Board = [
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

const SOLUTION: Board = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

test('sudoku-solver 求出经典题解', () => {
  const result = sudokuSolver(PUZZLE);
  assert.notEqual(result, null);
  assert.deepEqual(result, SOLUTION);
});

test('sudoku-solver 解合法（行列宫均 1-9）', () => {
  const result = sudokuSolver(PUZZLE);
  assert.ok(result, '应有解');
  assert.equal(isValidSolution(result), true);
});

test('sudoku-solver 解保留题目给定值', () => {
  const result = sudokuSolver(PUZZLE)!;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (PUZZLE[r]![c]! !== 0) {
        assert.equal(result[r]![c], PUZZLE[r]![c], `给定值 (${r},${c}) 不应被改动`);
      }
    }
  }
});

test('sudoku-solver 空棋盘可解且合法', () => {
  const empty: Board = Array.from({ length: 9 }, () => new Array<number>(9).fill(0));
  const result = sudokuSolver(empty);
  assert.ok(result, '空棋盘应有解');
  assert.equal(isValidSolution(result), true);
});

test('sudoku-solver 不修改入参', () => {
  const snapshot = PUZZLE.map((row) => [...row]);
  sudokuSolver(PUZZLE);
  assert.deepEqual(PUZZLE, snapshot);
});

test('sudoku-solver 钩子被调用', () => {
  let places = 0;
  let backtracks = 0;
  let solved = 0;
  sudokuSolver(PUZZLE, {
    onPlace: () => places++,
    onBacktrack: () => backtracks++,
    onSolved: () => solved++,
  });
  assert.ok(places > 0, '应触发试填');
  assert.ok(backtracks > 0, '应触发回溯');
  assert.equal(solved, 1);
});

test('sudoku-solver isValidSolution 拒绝非解', () => {
  const bad: Board = SOLUTION.map((row) => [...row]);
  bad[0]![0] = 1; // 破坏第一行
  assert.equal(isValidSolution(bad), false);
});
