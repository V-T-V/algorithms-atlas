import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalanList } from '../../src/algorithms/math/math-catalan-3/impl.ts';

test('catalan 前 10 项', () => {
  // C0..C9 = 1,1,2,5,14,42,132,429,1430,4862
  const v = catalanList(9);
  assert.deepEqual(
    v.map((x) => Number(x)),
    [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862],
  );
});
