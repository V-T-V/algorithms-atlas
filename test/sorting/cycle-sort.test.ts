import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cycleSort } from '../../src/algorithms/sorting/cycle-sort/impl.ts';

test('cycleSort 基本排序', () => {
  assert.deepEqual(cycleSort([]), []);
  assert.deepEqual(cycleSort([1]), [1]);
  assert.deepEqual(cycleSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('cycleSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(cycleSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('cycleSort 不修改原数组', () => {
  const input = [3, 1, 2];
  cycleSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('cycleSort 钩子被调用', () => {
  let writes = 0;
  let cycles = 0;
  cycleSort([3, 1, 2], {
    onWrite: () => writes++,
    onCycleEnd: () => cycles++,
  });
  assert.ok(writes >= 1, '应至少写一次');
  assert.ok(cycles >= 1, '应至少完成一个循环');
});
