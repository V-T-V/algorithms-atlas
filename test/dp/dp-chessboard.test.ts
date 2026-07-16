import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chessboardPaths } from '../../src/algorithms/dp/dp-chessboard/impl.ts';

test('chessboard 3×2 = 3', () => {
  assert.equal(chessboardPaths(3, 2), 3);
});

test('chessboard 3×7 = 28 (LeetCode 62)', () => {
  assert.equal(chessboardPaths(3, 7), 28);
});

test('chessboard 1×1 = 1', () => {
  assert.equal(chessboardPaths(1, 1), 1);
});

test('chessboard 单行/单列 = 1', () => {
  assert.equal(chessboardPaths(1, 5), 1);
  assert.equal(chessboardPaths(5, 1), 1);
});

test('chessboard 非法维度', () => {
  assert.equal(chessboardPaths(0, 5), 0);
  assert.equal(chessboardPaths(5, 0), 0);
});
