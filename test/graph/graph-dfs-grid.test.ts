import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numIslands } from '../../src/algorithms/graph/graph-dfs-grid/impl.ts';

test('grid-dfs LeetCode 200 例 1', () => {
  const grid = [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ];
  assert.equal(numIslands(grid), 3);
});

test('grid-dfs 单岛屿', () => {
  assert.equal(
    numIslands([
      ['1', '1'],
      ['1', '1'],
    ]),
    1,
  );
});

test('grid-dfs 全水', () => {
  assert.equal(
    numIslands([
      ['0', '0'],
      ['0', '0'],
    ]),
    0,
  );
});

test('grid-dfs 全陆地', () => {
  assert.equal(
    numIslands([
      ['1', '1'],
      ['1', '1'],
    ]),
    1,
  );
});

test('grid-dfs 空网格', () => {
  assert.equal(numIslands([]), 0);
});

test('grid-dfs 钩子', () => {
  let islands = 0;
  numIslands([['1', '0', '1']], { onIsland: () => islands++ });
  assert.equal(islands, 2);
});
