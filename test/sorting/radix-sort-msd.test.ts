import { test } from 'node:test';
import assert from 'node:assert/strict';
import { msdRadixSort, digitAt } from '../../src/algorithms/sorting/radix-sort-msd/impl.ts';

test('msdRadixSort 基本排序', () => {
  assert.deepEqual(msdRadixSort([]), []);
  assert.deepEqual(msdRadixSort([1]), [1]);
  assert.deepEqual(msdRadixSort([2, 1]), [1, 2]);
  assert.deepEqual(
    msdRadixSort([329, 457, 657, 839, 436, 720, 355]),
    [329, 355, 436, 457, 657, 720, 839],
  );
});

test('msdRadixSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(msdRadixSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(msdRadixSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(msdRadixSort([30, 3, 300, 33, 3]), [3, 3, 30, 33, 300]);
});

test('msdRadixSort 大规模随机', () => {
  const big = Array.from({ length: 200 }, () => Math.floor(Math.random() * 100000));
  const sorted = msdRadixSort(big);
  const ref = [...big].sort((a, b) => a - b);
  assert.deepEqual(sorted, ref);
});

test('digitAt 取指定位', () => {
  assert.equal(digitAt(329, 0), 9);
  assert.equal(digitAt(329, 1), 2);
  assert.equal(digitAt(329, 2), 3);
  assert.equal(digitAt(329, 3), 0); // 超出高位补 0
  assert.equal(digitAt(0, 5), 0);
});

test('msdRadixSort 不修改原数组', () => {
  const input = [30, 1, 2];
  msdRadixSort(input);
  assert.deepEqual(input, [30, 1, 2]);
});

test('msdRadixSort 钩子被调用', () => {
  let enters = 0;
  let collects = 0;
  msdRadixSort([329, 457, 657], {
    onEnterRange: () => enters++,
    onCollect: () => collects++,
  });
  assert.ok(enters >= 1, '应至少进入一次分桶');
  assert.ok(collects >= 1, '应至少回写一次');
});
