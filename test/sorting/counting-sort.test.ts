import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countingSort } from '../../src/algorithms/sorting/counting-sort/impl.ts';

test('countingSort 基本排序', () => {
  assert.deepEqual(countingSort([]), []);
  assert.deepEqual(countingSort([1]), [1]);
  assert.deepEqual(countingSort([2, 1]), [1, 2]);
  assert.deepEqual(countingSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('countingSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(countingSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(countingSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(countingSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('countingSort 不修改原数组', () => {
  const input = [3, 1, 2];
  countingSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('countingSort 全相同元素', () => {
  assert.deepEqual(countingSort([4, 4, 4, 4]), [4, 4, 4, 4]);
});

test('countingSort 稳定性（按对象序保持相对顺序）', () => {
  // 计数排序逆序收集保证稳定：同值先出现者落点更靠前
  const input = [2, 1, 2, 1, 2];
  // 期望：所有 1 在前、所有 2 在后
  assert.deepEqual(countingSort(input), [1, 1, 2, 2, 2]);
});

test('countingSort 钩子被调用', () => {
  let range = 0;
  let tally = 0;
  let prefix = 0;
  let collect = 0;
  countingSort([3, 1, 2], {
    onRange: () => range++,
    onTally: () => tally++,
    onPrefix: () => prefix++,
    onCollect: () => collect++,
  });
  assert.equal(range, 1, '应计算一次值域');
  assert.equal(tally, 3, '应统计 3 个元素');
  assert.equal(prefix, 1, '应做一次前缀和');
  assert.equal(collect, 3, '应收集 3 个元素到输出');
});
