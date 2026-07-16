import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveSurrounded } from '../../src/algorithms/graph/graph-surrounded-regions/impl.ts';

test('surrounded-regions LeetCode 130 例', () => {
  const board = [
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'X'],
    ['X', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'X'],
  ];
  const flips = solveSurrounded(board);
  assert.deepEqual(board, [
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'X', 'X'],
  ]);
  assert.equal(flips, 4);
});

test('surrounded-regions 全 O 边界相连保留', () => {
  const board = [
    ['O', 'O', 'O'],
    ['O', 'O', 'O'],
    ['O', 'O', 'O'],
  ];
  solveSurrounded(board);
  assert.deepEqual(board, [
    ['O', 'O', 'O'],
    ['O', 'O', 'O'],
    ['O', 'O', 'O'],
  ]);
});

test('surrounded-regions 中心 O 被翻', () => {
  const board = [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ];
  solveSurrounded(board);
  // 内部 3×3 全翻成 X
  assert.deepEqual(board, [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ]);
});

test('surrounded-regions 空', () => {
  assert.equal(solveSurrounded([]), 0);
});
