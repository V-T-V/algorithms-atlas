import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shellSort, knuthGaps } from '../../src/algorithms/sorting/shell-sort/impl.ts';

test('shellSort 基本排序', () => {
  assert.deepEqual(shellSort([]), []);
  assert.deepEqual(shellSort([1]), [1]);
  assert.deepEqual(shellSort([2, 1]), [1, 2]);
  assert.deepEqual(shellSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('shellSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(shellSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(shellSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(shellSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('shellSort 不修改原数组', () => {
  const input = [3, 1, 2];
  shellSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('knuthGaps 返回降序的 Knuth 序列', () => {
  // n=40 → 1,4,13,40 均被纳入，降序为 13,4,1（40 不小于 n，排除）
  assert.deepEqual(knuthGaps(40), [13, 4, 1]);
  // n=1 时无 gap
  assert.deepEqual(knuthGaps(1), []);
});

test('shellSort 钩子被调用', () => {
  let gaps = 0;
  let compares = 0;
  let shifts = 0;
  shellSort([5, 2, 8, 1, 9, 3], {
    onGap: () => gaps++,
    onCompare: () => compares++,
    onShift: () => shifts++,
  });
  assert.ok(gaps >= 1, '应至少触发一个 gap');
  assert.ok(compares > 0, '应发生至少一次比较');
  assert.ok(shifts >= 0, '右移次数应非负');
});

test('shellSort 单元素或已有序时也应正常', () => {
  assert.deepEqual(shellSort([7]), [7]);
  assert.deepEqual(shellSort([1, 2, 3]), [1, 2, 3]);
});
