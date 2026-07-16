import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRedundantConnection } from '../../src/algorithms/graph/graph-redundant-connection/impl.ts';

test('redundant-connection LeetCode 684 例 1', () => {
  assert.deepEqual(
    findRedundantConnection([
      [1, 2],
      [1, 3],
      [2, 3],
    ]),
    [2, 3],
  );
});

test('redundant-connection LeetCode 684 例 2', () => {
  assert.deepEqual(
    findRedundantConnection([
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 4],
      [1, 5],
    ]),
    [1, 4],
  );
});

test('redundant-connection 最小环', () => {
  assert.deepEqual(
    findRedundantConnection([
      [1, 2],
      [2, 1],
    ]),
    [2, 1],
  );
});

test('redundant-connection 返回第一条成环边', () => {
  // 1-2、2-3 合并后，3-1 闭合环 → 返回 [3,1]
  assert.deepEqual(
    findRedundantConnection([
      [1, 2],
      [2, 3],
      [3, 1],
    ]),
    [3, 1],
  );
});
