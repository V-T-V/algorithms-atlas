import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reachableNodes } from '../../src/algorithms/graph/graph-reachable-nodes/impl.ts';

test('reachable-nodes LeetCode 882 例 1', () => {
  assert.equal(
    reachableNodes(
      [
        [0, 1, 10],
        [0, 2, 1],
        [1, 2, 2],
      ],
      6,
      3,
    ),
    13,
  );
});

test('reachable-nodes LeetCode 882 例 2', () => {
  assert.equal(
    reachableNodes(
      [
        [0, 1, 4],
        [1, 2, 6],
        [0, 2, 8],
        [1, 3, 1],
      ],
      10,
      4,
    ),
    23,
  );
});

test('reachable-nodes maxMoves=0 只到起点', () => {
  assert.equal(reachableNodes([[0, 1, 5]], 0, 2), 1);
});

test('reachable-nodes 起点孤立', () => {
  assert.equal(reachableNodes([], 10, 1), 1);
});

test('reachable-nodes 大预算全覆盖', () => {
  assert.equal(reachableNodes([[0, 1, 2]], 100, 2), 4); // 2 节点 + 2 中间
});
