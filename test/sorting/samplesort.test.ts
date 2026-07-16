import { test } from 'node:test';
import assert from 'node:assert/strict';
import { samplesort } from '../../src/algorithms/sorting/samplesort/impl.ts';

test('samplesort 基本排序', () => {
  assert.deepEqual(samplesort([]), []);
  assert.deepEqual(samplesort([1]), [1]);
  assert.deepEqual(samplesort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(samplesort([9, 3, 7, 1, 8, 2, 6, 5, 4, 0]), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('samplesort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(samplesort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(samplesort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(samplesort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('samplesort 不修改原数组', () => {
  const input = [3, 1, 2];
  samplesort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('samplesort 不同 k 值均正确', () => {
  const big = Array.from({ length: 50 }, (_, i) => (i * 37) % 50);
  for (const k of [2, 3, 5]) {
    const expected = [...big].sort((x, y) => x - y);
    assert.deepEqual(samplesort(big, k), expected);
  }
});

test('samplesort 钩子触发主元/划分', () => {
  let pivotsCalled = 0;
  let partitionCalled = 0;
  // 需超过插入阈值 16 才会进入采样主元阶段
  const input = Array.from({ length: 25 }, (_, i) => ((24 - i) * 3) % 25);
  samplesort(input, 3, {
    onPivots: () => pivotsCalled++,
    onPartition: () => partitionCalled++,
  });
  assert.ok(pivotsCalled >= 1);
  assert.ok(partitionCalled >= 1);
});
