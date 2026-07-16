import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btSudokuValid } from '../../src/algorithms/backtracking/bt-sudoku-valid/impl.ts';

const VALID: string[][] = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

const INVALID_ROW: string[][] = VALID.map((r) => [...r]);
INVALID_ROW[0] = ['5', '3', '5', '.', '7', '.', '.', '.', '.'];

const INVALID_BOX: string[][] = VALID.map((r) => [...r]);
INVALID_BOX[0] = ['5', '3', '4', '.', '7', '.', '.', '.', '.'];
INVALID_BOX[1] = ['6', '.', '.', '1', '9', '5', '.', '.', '.'];
INVALID_BOX[2] = ['.', '9', '8', '.', '.', '.', '.', '6', '.'];

test('bt-sudoku-valid 有效盘', () => {
  assert.equal(btSudokuValid(VALID), true);
});

test('bt-sudoku-valid 行重复无效', () => {
  assert.equal(btSudokuValid(INVALID_ROW), false);
});

test('bt-sudoku-valid 宫重复无效', () => {
  assert.equal(btSudokuValid(INVALID_BOX), false);
});

test('bt-sudoku-valid 全空有效', () => {
  const empty = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '.'));
  assert.equal(btSudokuValid(empty), true);
});
