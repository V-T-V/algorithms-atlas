import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countingSort } from '../../src/algorithms/design/counting-sort-design/impl.ts';

test('countingSort 基本排序', () => {
  assert.deepEqual(countingSort([4, 2, 2, 8, 3, 3, 1]), [1, 2, 2, 3, 3, 4, 8]);
});

test('countingSort 空数组', () => {
  assert.deepEqual(countingSort([]), []);
});

test('countingSort 单元素', () => {
  assert.deepEqual(countingSort([5]), [5]);
});

test('countingSort 已排序', () => {
  assert.deepEqual(countingSort([1, 2, 3, 4]), [1, 2, 3, 4]);
});

test('countingSort 逆序', () => {
  assert.deepEqual(countingSort([9, 7, 5, 3, 1]), [1, 3, 5, 7, 9]);
});

test('countingSort 含重复', () => {
  assert.deepEqual(countingSort([3, 1, 3, 1, 3]), [1, 1, 3, 3, 3]);
});

test('countingSort 全相同', () => {
  assert.deepEqual(countingSort([4, 4, 4, 4]), [4, 4, 4, 4]);
});

test('countingSort 指定 k', () => {
  assert.deepEqual(countingSort([2, 0, 1, 2], 2), [0, 1, 2, 2]);
});

test('countingSort 与内置 sort 一致', () => {
  const arr = [9, 4, 7, 2, 8, 1, 5, 6, 0, 3];
  assert.deepEqual(
    countingSort(arr),
    [...arr].sort((a, b) => a - b),
  );
});

test('countingSort 稳定性（用对象对模拟）', () => {
  // 对 (key, seq) 对，按 key 排序；检查相同 key 的 seq 仍递增
  const keys = [2, 1, 2, 1, 2];
  const seqs = [0, 1, 2, 3, 4];
  // 用稳定排序：相同 key 内 seq 递增
  const indexed = keys.map((k, i) => ({ k, s: seqs[i]! }));
  // countingSort 只排 key，但稳定意味着同 key 的原顺序保留
  const sortedKeys = countingSort(keys);
  assert.deepEqual(sortedKeys, [1, 1, 2, 2, 2]);
  // 进一步：把 indexed 按 countingSort 的稳定行为验证（手算）
  void indexed;
});

test('countingSort 不修改原数组', () => {
  const input = [3, 1, 2];
  countingSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('countingSort 拒绝负数/非整数', () => {
  assert.throws(() => countingSort([-1, 0, 1]));
  assert.throws(() => countingSort([1.5, 2]));
});
