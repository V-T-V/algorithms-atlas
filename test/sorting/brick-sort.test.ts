import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brickSort, type BrickSortHooks } from '../../src/algorithms/sorting/brick-sort/impl.ts';

test('brickSort 基本', () => {
  assert.deepEqual(brickSort([]), []);
  assert.deepEqual(brickSort([1]), [1]);
  assert.deepEqual(brickSort([2, 1]), [1, 2]);
  assert.deepEqual(brickSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('brickSort 逆序/重复', () => {
  assert.deepEqual(brickSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(brickSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('brickSort 不修改原数组', () => {
  const input = [3, 1, 2];
  brickSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('brickSort 钩子', () => {
  let c = 0;
  brickSort([3, 1, 2], { onCompare: () => c++ } as BrickSortHooks);
  assert.ok(c >= 1);
});
