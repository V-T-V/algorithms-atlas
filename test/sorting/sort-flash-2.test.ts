import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flashSort2, type Flash2Hooks } from '../../src/algorithms/sorting/sort-flash-2/impl.ts';

test('flashSort2 基本', () => {
  assert.deepEqual(flashSort2([]), []);
  assert.deepEqual(flashSort2([1]), [1]);
  assert.deepEqual(flashSort2([2, 1]), [1, 2]);
  assert.deepEqual(
    flashSort2([29, 10, 14, 37, 13, 25, 41, 8, 22, 30]),
    [8, 10, 13, 14, 22, 25, 29, 30, 37, 41],
  );
});
test('flashSort2 逆序/重复', () => {
  assert.deepEqual(flashSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(flashSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('flashSort2 钩子', () => {
  let c = 0;
  flashSort2([3, 1, 2], { onClassify: () => c++ } as Flash2Hooks);
  assert.ok(c >= 1);
});
