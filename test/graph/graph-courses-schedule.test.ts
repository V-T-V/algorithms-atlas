import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canFinish } from '../../src/algorithms/graph/graph-courses-schedule/impl.ts';

test('courses-schedule LeetCode 207 例 1', () => {
  assert.equal(canFinish(2, [[1, 0]]), true);
});

test('courses-schedule LeetCode 207 例 2', () => {
  assert.equal(
    canFinish(2, [
      [1, 0],
      [0, 1],
    ]),
    false,
  );
});

test('courses-schedule 无依赖', () => {
  assert.equal(canFinish(3, []), true);
});

test('courses-schedule 长链', () => {
  assert.equal(
    canFinish(4, [
      [1, 0],
      [2, 1],
      [3, 2],
    ]),
    true,
  );
});

test('courses-schedule 自环', () => {
  assert.equal(canFinish(2, [[0, 0]]), false);
});

test('courses-schedule 钩子', () => {
  let takes = 0;
  canFinish(3, [[1, 0]], { onTake: () => takes++ });
  assert.equal(takes, 3);
});
