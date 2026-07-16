import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crt } from '../../src/algorithms/math/math-crt-3/impl.ts';

test('crt 经典韩信点兵', () => {
  const r = crt([2, 3, 2], [3, 5, 7]);
  assert.equal(r.remainder, 23n);
  assert.equal(r.modulus, 105n);
});

test('crt 非互素可解', () => {
  const r = crt([1, 4], [3, 6]);
  // x≡1 mod 3, x≡4 mod 6 → x≡4 mod 6
  assert.ok(r.remainder !== null);
  assert.equal((((r.remainder! - 1n) % 3n) + 3n) % 3n, 0n);
  assert.equal((((r.remainder! - 4n) % 6n) + 6n) % 6n, 0n);
});

test('crt 无解', () => {
  const r = crt([0, 1], [4, 6]);
  // gcd(4,6)=2 不整分 (1-0)
  assert.equal(r.remainder, null);
});
