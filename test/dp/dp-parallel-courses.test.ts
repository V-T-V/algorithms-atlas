import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parallelCourses } from '../../src/algorithms/dp/dp-parallel-courses/impl.ts';

test('parallel-courses LeetCode 1136 例 1', () => {
  assert.equal(
    parallelCourses(3, [
      [1, 2],
      [2, 3],
    ]),
    3,
  );
});

test('parallel-courses LeetCode 1136 例 2', () => {
  assert.equal(
    parallelCourses(3, [
      [1, 2],
      [2, 3],
      [3, 1],
    ]),
    -1,
  );
});

test('parallel-courses 无依赖', () => {
  assert.equal(parallelCourses(2, []), 1);
});

test('parallel-courses 可并行', () => {
  // 1→3, 2→3：学期1修1,2；学期2修3
  assert.equal(
    parallelCourses(3, [
      [1, 3],
      [2, 3],
    ]),
    2,
  );
});

test('parallel-courses 单门', () => {
  assert.equal(parallelCourses(1, []), 1);
});
