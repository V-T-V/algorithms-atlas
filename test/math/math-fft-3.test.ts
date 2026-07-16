import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multiplyFFT } from '../../src/algorithms/math/math-fft-3/impl.ts';

test('fft 多项式乘法', () => {
  const r = multiplyFFT([1, 2, 3], [4, 5, 6]);
  assert.deepEqual(r, [4, 13, 28, 27, 18]);
});

test('fft 大系数', () => {
  const r = multiplyFFT([100, 200], [300, 400]);
  // 30000 + 100000x + 80000x²
  assert.deepEqual(r, [30000, 100000, 80000]);
});
