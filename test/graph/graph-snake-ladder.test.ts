import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snakesAndLadders } from '../../src/algorithms/graph/graph-snake-ladder/impl.ts';

test('snake-ladder LeetCode 909 例 1', () => {
  const board = [
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, 35, -1, -1, 13, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, 15, -1, -1, -1, -1],
  ];
  assert.equal(snakesAndLadders(board), 4);
});

test('snake-ladder 无梯无蛇', () => {
  const board = [
    [-1, -1],
    [-1, -1],
  ];
  // 2x2: 1->4. 1 roll 3 = 4 => 1 步
  assert.equal(snakesAndLadders(board), 1);
});

test('snake-ladder 单格', () => {
  assert.equal(snakesAndLadders([[-1]]), 0);
});

test('snake-ladder 直达', () => {
  const board = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ];
  // 3x3: 1->9. roll 6? max 6, 1+6=7<9; need 2 rolls
  assert.ok(snakesAndLadders(board) >= 2);
});
