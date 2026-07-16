import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aStarGrid, reconstructPath } from '../../src/algorithms/graph/graph-astar-2/impl.ts';

const GRID = [
  [0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0],
];

test('astar-grid 找到最短路径', () => {
  const r = aStarGrid(GRID, { r: 0, c: 0 }, { r: 3, c: 4 });
  // (0,0)->(0,1)->(0,2)->(1,2)->(2,2)->(3,2)->(3,3)->(3,4) = 7 步
  assert.equal(r.found, true);
  assert.equal(r.dist, 7);
});

test('astar-grid 路径回溯正确', () => {
  const r = aStarGrid(GRID, { r: 0, c: 0 }, { r: 3, c: 4 });
  const path = reconstructPath(r.prev, { r: 0, c: 0 }, { r: 3, c: 4 });
  assert.ok(path !== null);
  assert.deepEqual(path![0], { r: 0, c: 0 });
  assert.deepEqual(path![path!.length - 1], { r: 3, c: 4 });
});

test('astar-grid 无路径', () => {
  const blocked = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ];
  const r = aStarGrid(blocked, { r: 0, c: 0 }, { r: 2, c: 2 });
  assert.equal(r.found, false);
});

test('astar-grid 起点即终点', () => {
  const r = aStarGrid([[0]], { r: 0, c: 0 }, { r: 0, c: 0 });
  assert.equal(r.found, true);
  assert.equal(r.dist, 0);
});

test('astar-grid 障碍起点', () => {
  const r = aStarGrid([[1, 0]], { r: 0, c: 0 }, { r: 0, c: 1 });
  assert.equal(r.found, false);
});
