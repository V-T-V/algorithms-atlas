import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WaveletTree2 } from '../../src/algorithms/ds/ds-wavelet-2/impl.ts';

test('wavelet 区间第 k 小', () => {
  const wt = new WaveletTree2([5, 2, 8, 1, 9, 3, 7]);
  assert.equal(wt.kth(0, 6, 1), 1);
  assert.equal(wt.kth(0, 6, 4), 5);
  assert.equal(wt.kth(0, 6, 7), 9);
});

test('wavelet 子区间', () => {
  const wt = new WaveletTree2([5, 2, 8, 1, 9, 3, 7]);
  // [5,2,8,1] 排序后 [1,2,5,8]，第 2 小 = 2
  assert.equal(wt.kth(0, 3, 2), 2);
});
