import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gridBfs } from '../../src/algorithms/graph/graph-bfs-grid/impl.ts';

test('grid-bfs 基本最短路', () => {
  const grid = [
    [0, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
  ];
  assert.equal(gridBfs(grid, 0, 0, 3, 3), 6);
});

test('grid-bfs 起点即终点', () => {
  assert.equal(gridBfs([[0]], 0, 0, 0, 0), 0);
});

test('grid-bfs 不可达', () => {
  const grid = [
    [0, 1, 0],
    [0, 1, 0],
  ];
  assert.equal(gridBfs(grid, 0, 0, 1, 2), -1);
});

test('grid-bfs 起点为障碍', () => {
  assert.equal(gridBfs([[1, 0]], 0, 0, 0, 1), -1);
});

test('grid-bfs 钩子', () => {
  let visits = 0;
  gridBfs(
    [
      [0, 0],
      [0, 0],
    ],
    0,
    0,
    1,
    1,
    { onVisit: () => visits++ },
  );
  assert.ok(visits >= 2);
});
