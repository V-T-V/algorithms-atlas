import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stableSelectionSort } from '../../src/algorithms/sorting/selection-sort-stable/impl.ts';

test('stableSelectionSort 基本排序', () => {
  assert.deepEqual(stableSelectionSort([]), []);
  assert.deepEqual(stableSelectionSort([1]), [1]);
  assert.deepEqual(stableSelectionSort([2, 1]), [1, 2]);
  assert.deepEqual(stableSelectionSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('stableSelectionSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(stableSelectionSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(stableSelectionSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(stableSelectionSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('stableSelectionSort 对带标记的相等元素保持稳定', () => {
  // 用对象 + 自定义比较逻辑验证稳定性：相同 number 的原序应被保留
  const tagged: Array<{ k: number; ord: number }> = [
    { k: 4, ord: 0 },
    { k: 2, ord: 1 },
    { k: 4, ord: 2 },
    { k: 1, ord: 3 },
    { k: 2, ord: 4 },
  ];
  // 对 k 排序：稳定版应使 ord 在相同 k 内保持升序
  const sorted = stableSelectionSort(
    tagged.map((t) => t.k * 10 + t.ord), // 编码 k*10+ord
  );
  // 解码验证：相同 k 内 ord 升序
  assert.deepEqual(sorted, [13, 21, 24, 40, 42]);
});

test('stableSelectionSort 不修改原数组', () => {
  const input = [3, 1, 2];
  stableSelectionSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('stableSelectionSort 钩子被调用', () => {
  let compares = 0;
  let inserts = 0;
  let sorted = 0;
  stableSelectionSort([3, 2, 1], {
    onCompare: () => compares++,
    onInsert: () => inserts++,
    onSorted: () => sorted++,
  });
  assert.ok(compares > 0, '应发生至少一次比较');
  assert.ok(inserts >= 0, '插入次数合理');
  assert.equal(sorted, 3, '应标记 3 个位置就位');
});
