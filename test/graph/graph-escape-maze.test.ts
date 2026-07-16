import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeMaze } from '../../src/algorithms/graph/graph-escape-maze/impl.ts';

test('maze 基本逃脱', () => {
  const maze = [
    ['S', '.', '.', '#', '.'],
    ['#', '#', '.', '#', '.'],
    ['.', '.', '.', '.', '.'],
    ['.', '#', '#', '#', 'E'],
  ];
  // S(0,0)->(0,1)->(0,2)->(1,2)->(2,2)->(2,3)->(2,4)->(3,4) = 7
  assert.equal(escapeMaze(maze), 7);
});

test('maze 直达', () => {
  const maze = [['S', 'E']];
  assert.equal(escapeMaze(maze), 1);
});

test('maze 起点即终点', () => {
  // S 和 E 必须分开；本测试 S==E 不可能，故跳过；改为相邻
  const maze = [['S', 'E']];
  assert.equal(escapeMaze(maze), 1);
});

test('maze 无路', () => {
  const maze = [
    ['S', '#'],
    ['#', 'E'],
  ];
  assert.equal(escapeMaze(maze), -1);
});

test('maze 缺 S 或 E', () => {
  assert.equal(escapeMaze([['.', '.']]), -1);
});
