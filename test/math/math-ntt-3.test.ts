import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multiplyNTT } from '../../src/algorithms/math/math-ntt-3/impl.ts';

test('ntt 多项式乘法', () => {
  // (1+2x+3x)(4+5x+6x) = 4 + 13x + 28x² + 27x³ + 18x⁴
  const r = multiplyNTT([1, 2, 3], [4, 5, 6]);
  assert.deepEqual(
    r.map((x) => Number(x)),
    [4, 13, 28, 27, 18],
  );
});

test('ntt 含 0', () => {
  const r = multiplyNTT([0, 1], [1, 1]);
  assert.deepEqual(
    r.map((x) => Number(x)),
    [0, 1, 1],
  );
});
