import { test } from 'node:test';
import assert from 'node:assert/strict';
import { motzkin } from '../../src/algorithms/math/motzkin-number/impl.ts';

test('motzkin 已知序列', () => {
  // M(0..10): 1,1,2,4,9,21,51,127,323,835,2188
  assert.deepEqual(motzkin(10), [1n, 1n, 2n, 4n, 9n, 21n, 51n, 127n, 323n, 835n, 2188n]);
});

test('motzkin 与线性递推一致', () => {
  const M = motzkin(20);
  // 用 M(n)=((2n+1)M(n-1)+(3n-3)M(n-2))/(n+2) 对照
  for (let n = 2; n <= 20; n++) {
    const expected =
      (BigInt(2 * n + 1) * M[n - 1]! + BigInt(3 * n - 3) * M[n - 2]!) / BigInt(n + 2);
    assert.equal(M[n], expected, `M(${n})`);
  }
});

test('motzkin 边界', () => {
  assert.deepEqual(motzkin(0), [1n]);
  assert.deepEqual(motzkin(1), [1n, 1n]);
  assert.throws(() => motzkin(-1), RangeError);
});
