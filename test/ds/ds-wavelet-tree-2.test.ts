import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WaveletTree } from '../../src/algorithms/ds/ds-wavelet-tree-2/impl.ts';

test('区间第 1 小（最小）', () => {
  const t = new WaveletTree([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.kth(0, 7, 1), 1);
});

test('区间第 n 小（最大）', () => {
  const t = new WaveletTree([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.kth(0, 7, 8), 9);
});

test('区间第 k 小', () => {
  const t = new WaveletTree([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.kth(0, 7, 4), 3); // 排序后 1,1,2,3,4,5,6,9
});

test('子区间 k 小', () => {
  const t = new WaveletTree([5, 3, 8, 1, 9]);
  // 前 3 个 [5,3,8] 第 2 小 = 5
  assert.equal(t.kth(0, 2, 2), 5);
});

test('单元素', () => {
  const t = new WaveletTree([42]);
  assert.equal(t.kth(0, 0, 1), 42);
});

test('rank 频率查询', () => {
  const t = new WaveletTree([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(t.rank(0, 7, 1), 2); // 1 出现 2 次
  assert.equal(t.rank(0, 7, 5), 1);
  assert.equal(t.rank(0, 7, 99), 0);
});
