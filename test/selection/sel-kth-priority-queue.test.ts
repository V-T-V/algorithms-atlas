import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kthViaPriorityQueue,
  firstKSorted,
} from '../../src/algorithms/selection/sel-kth-priority-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-kth-priority-queue/trace.ts';

test('sel-kth-priority-queue 与排序一致', () => {
  const arr = [7, 2, 9, 4, 1, 8, 5];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 1; k <= arr.length; k++) {
    assert.equal(kthViaPriorityQueue(arr, k), sorted[k - 1], `k=${k}`);
  }
});

test('sel-kth-priority-queue 不改原数组', () => {
  const input = [3, 1, 2];
  kthViaPriorityQueue(input, 1);
  assert.deepEqual(input, [3, 1, 2]);
});

test('sel-kth-priority-queue firstKSorted 升序', () => {
  assert.deepEqual(firstKSorted([5, 3, 8, 1, 9, 2], 3), [1, 2, 3]);
});

test('sel-kth-priority-queue 越界抛错', () => {
  assert.throws(() => kthViaPriorityQueue([1], 0));
  assert.throws(() => kthViaPriorityQueue([1], 5));
});

test('sel-kth-priority-queue trace', () => {
  assert.ok(buildTrace().length > 2);
});
