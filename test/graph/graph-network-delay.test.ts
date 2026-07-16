import { test } from 'node:test';
import assert from 'node:assert/strict';
import { networkDelayTime } from '../../src/algorithms/graph/graph-network-delay/impl.ts';

test('network-delay LeetCode 743 例 1', () => {
  assert.equal(
    networkDelayTime(
      [
        [2, 1, 1],
        [2, 3, 1],
        [3, 4, 1],
      ],
      4,
      2,
    ),
    2,
  );
});

test('network-delay LeetCode 743 例 2', () => {
  assert.equal(networkDelayTime([[1, 2, 1]], 2, 2), -1);
});

test('network-delay LeetCode 743 例 3', () => {
  assert.equal(networkDelayTime([[1, 2, 1]], 2, 1), 1);
});

test('network-delay 单节点', () => {
  assert.equal(networkDelayTime([], 1, 1), 0);
});

test('network-delay 钩子', () => {
  let settles = 0;
  networkDelayTime(
    [
      [2, 1, 1],
      [2, 3, 1],
      [3, 4, 1],
    ],
    4,
    2,
    { onSettle: () => settles++ },
  );
  assert.equal(settles, 4);
});
