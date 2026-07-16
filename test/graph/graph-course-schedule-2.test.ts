import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findOrder } from '../../src/algorithms/graph/graph-course-schedule-2/impl.ts';

test('course-schedule-2 LeetCode 210 例 1', () => {
  // 2 门 [[1,0]] -> [0,1]
  assert.deepEqual(findOrder(2, [[1, 0]]), [0, 1]);
});

test('course-schedule-2 LeetCode 210 例 2', () => {
  // 4 门 [[1,0],[2,0],[3,1],[3,2]] -> 0 先修，然后 1/2，然后 3
  const order = findOrder(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]);
  assert.equal(order[0], 0);
  assert.equal(order[3], 3);
  assert.ok(order.indexOf(1) < order.indexOf(3));
  assert.ok(order.indexOf(2) < order.indexOf(3));
});

test('course-schedule-2 环返回空', () => {
  assert.deepEqual(
    findOrder(2, [
      [0, 1],
      [1, 0],
    ]),
    [],
  );
});

test('course-schedule-2 无依赖', () => {
  assert.deepEqual(findOrder(2, []), [0, 1]);
});

test('course-schedule-2 单门', () => {
  assert.deepEqual(findOrder(1, []), [0]);
});
