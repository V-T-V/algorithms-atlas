import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modSqrt } from '../../src/algorithms/math/math-mod-sqrt-3/impl.ts';

test('mod-sqrt 2 mod 7', () => {
  const r = modSqrt(2, 7);
  assert.ok(r !== null);
  assert.equal((r! * r!) % 7n, 2n);
});

test('mod-sqrt p≡3 mod 4 快速', () => {
  const r = modSqrt(4n, 11n);
  // 9²=81 ≡ 4 mod 11
  assert.ok(r !== null);
  assert.equal((r! * r!) % 11n, 4n);
});

test('mod-sqrt 非剩余无解', () => {
  // 2 是 7 的二次剩余（3²=2），改测 3 mod 7：3,5,6,9,4 列举 → 3 非剩余
  assert.equal(modSqrt(3, 7), null);
});
