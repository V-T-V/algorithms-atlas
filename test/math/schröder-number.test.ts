import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schröder } from '../../src/algorithms/math/schröder-number/impl.ts';

test('schröder 已知序列', () => {
  // S(0..6): 1,2,6,22,90,394,1806
  assert.deepEqual(schröder(6), [1n, 2n, 6n, 22n, 90n, 394n, 1806n]);
});

test('schröder 与线性递推一致', () => {
  // S(n) = ((6n-12)S(n-1) - (n-2)S(n-2)) / n, n>=2
  const S = schröder(15);
  for (let n = 2; n <= 15; n++) {
    const expected = (BigInt(6 * n - 12) * S[n - 1]! - BigInt(n - 2) * S[n - 2]!) / BigInt(n);
    assert.equal(S[n], expected, `S(${n})`);
  }
});

test('schröder 边界', () => {
  assert.deepEqual(schröder(0), [1n]);
  assert.deepEqual(schröder(1), [1n, 2n]);
  assert.throws(() => schröder(-1), RangeError);
});
