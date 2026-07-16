import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinHeightTrees } from '../../src/algorithms/graph/graph-min-height-trees/impl.ts';

test('min-height-trees LeetCode 310 例 1', () => {
  const res = findMinHeightTrees(4, [
    [1, 0],
    [1, 2],
    [1, 3],
  ]);
  assert.deepEqual(
    res.sort((a, b) => a - b),
    [1],
  );
});

test('min-height-trees LeetCode 310 例 2', () => {
  const res = findMinHeightTrees(6, [
    [0, 3],
    [1, 3],
    [2, 3],
    [4, 3],
    [5, 4],
  ]);
  assert.deepEqual(
    res.sort((a, b) => a - b),
    [3, 4],
  );
});

test('min-height-trees 单节点', () => {
  assert.deepEqual(findMinHeightTrees(1, []), [0]);
});

test('min-height-trees 两节点', () => {
  const res = findMinHeightTrees(2, [[0, 1]]);
  assert.deepEqual(
    res.sort((a, b) => a - b),
    [0, 1],
  );
});

test('min-height-trees 链', () => {
  // 0-1-2-3-4 中心是 2
  const res = findMinHeightTrees(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ]);
  assert.deepEqual(
    res.sort((a, b) => a - b),
    [2],
  );
});
