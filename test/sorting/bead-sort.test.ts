import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beadSort } from '../../src/algorithms/sorting/bead-sort/impl.ts';

test('beadSort 基本排序', () => {
  assert.deepEqual(beadSort([]), []);
  assert.deepEqual(beadSort([1]), [1]);
  assert.deepEqual(beadSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(beadSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('beadSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(beadSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(beadSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(beadSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('beadSort 含零', () => {
  assert.deepEqual(beadSort([0, 3, 0, 1]), [0, 0, 1, 3]);
});

test('beadSort 不修改原数组', () => {
  const input = [3, 1, 2];
  beadSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('beadSort 钩子被调用', () => {
  let drops = 0;
  let reads = 0;
  beadSort([4, 2, 5], {
    onDrop: () => drops++,
    onReadRow: () => reads++,
  });
  assert.equal(drops, 3, '每个元素撒一次珠子');
  assert.equal(reads, 3, '每行读一次');
});
