import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  longestUniqueSubarray,
  slidingWindow,
} from '../../src/algorithms/design/sliding-window/impl.ts';

test('sliding-window 空数组与单元素', () => {
  assert.deepEqual(slidingWindow([]), { length: 0, start: 0 });
  assert.deepEqual(slidingWindow([1]), { length: 1, start: 0 });
});

test('sliding-window 求最长无重复子数组', () => {
  assert.deepEqual(slidingWindow([1, 2, 3, 1, 2, 3, 4]), { length: 4, start: 3 });
  assert.deepEqual(slidingWindow([5, 5, 5]), { length: 1, start: 0 });
  assert.deepEqual(longestUniqueSubarray([2, 1, 2, 3, 4, 3]), { length: 4, start: 1 });
});

test('sliding-window 钩子反映扩张、收缩与最优更新', () => {
  const expands: Array<[number, number]> = [];
  const shrinks: Array<[number, number]> = [];
  const bests: Array<[number, number, number]> = [];
  const result = slidingWindow([1, 2, 1, 3], {
    onExpand: (left, right) => expands.push([left, right]),
    onShrink: (left, right) => shrinks.push([left, right]),
    onUpdateBest: (left, right, length) => bests.push([left, right, length]),
  });
  assert.deepEqual(result, { length: 3, start: 1 });
  assert.deepEqual(expands, [
    [0, 0],
    [0, 1],
    [1, 2],
    [1, 3],
  ]);
  assert.deepEqual(shrinks, [[1, 2]]);
  assert.deepEqual(bests.at(-1), [1, 3, 3]);
});
