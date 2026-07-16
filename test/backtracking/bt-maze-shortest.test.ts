import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btMazeShortest } from '../../src/algorithms/backtracking/bt-maze-shortest/impl.ts';

const GRID: ReadonlyArray<readonly number[]> = [
  [1, 1, 0, 1, 1],
  [0, 1, 1, 1, 0],
  [1, 1, 0, 1, 1],
];

test('bt-maze-shortest 找到最短路径', () => {
  const res = btMazeShortest(GRID, [0, 0], [2, 4]);
  assert.ok(res.length > 0);
  assert.deepEqual(res.path[0], [0, 0]);
  assert.deepEqual(res.path[res.path.length - 1], [2, 4]);
});

test('bt-maze-shortest 起点即终点', () => {
  const res = btMazeShortest(GRID, [0, 0], [0, 0]);
  assert.equal(res.length, 1);
});

test('bt-maze-shortest 不可达返回 -1', () => {
  const blocked: ReadonlyArray<readonly number[]> = [[1, 0, 1]];
  const res = btMazeShortest(blocked, [0, 0], [0, 2]);
  assert.equal(res.length, -1);
});

test('bt-maze-shortest 路径上每格都是通路', () => {
  const res = btMazeShortest(GRID, [0, 0], [2, 4]);
  for (const [r, c] of res.path) {
    assert.equal(GRID[r]![c], 1);
  }
});
