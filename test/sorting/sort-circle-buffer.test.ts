import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleBufferSort } from '../../src/algorithms/sorting/sort-circle-buffer/impl.ts';

test('circleBufferSort 基本排序', () => {
  assert.deepEqual(circleBufferSort([]), []);
  assert.deepEqual(circleBufferSort([1]), [1]);
  assert.deepEqual(circleBufferSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('circleBufferSort 已有序/逆序/重复', () => {
  assert.deepEqual(circleBufferSort([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(circleBufferSort([3, 2, 1]), [1, 2, 3]);
  assert.deepEqual(circleBufferSort([3, 3, 1, 2]), [1, 2, 3, 3]);
});

test('circleBufferSort 不修改原数组', () => {
  const input = [3, 1, 2];
  circleBufferSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('circleBufferSort 钩子被调用', () => {
  let merges = 0;
  let stages = 0;
  circleBufferSort([3, 1, 2], {
    onMerged: () => merges++,
    onStage: () => stages++,
    onInitBuffer: () => {},
  });
  assert.ok(merges >= 1);
  assert.ok(stages >= 1);
});
