import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schröder } from '../../src/algorithms/math/schroder-number/impl.ts';

test('schröder 已知序列', () => {
  // S(0..6): 1,2,6,22,90,394,1806
  assert.deepEqual(schröder(6), [1n, 2n, 6n, 22n, 90n, 394n, 1806n]);
});

test('schröder 与线性递推一致', () => {
  // 大 Schröder 数（OEIS A006318）的 D-finite 线性递推：
  //   (n+1)·S(n) = 3(2n-1)·S(n-1) - (n-2)·S(n-2)，n>=2
  //   即 S(n) = (3(2n-1)·S(n-1) - (n-2)·S(n-2)) / (n+1)
  const S = schröder(15);
  for (let n = 2; n <= 15; n++) {
    const expected =
      (BigInt(3 * (2 * n - 1)) * S[n - 1]! - BigInt(n - 2) * S[n - 2]!) / BigInt(n + 1);
    assert.equal(S[n], expected, `S(${n})`);
  }
});

test('schröder 边界', () => {
  assert.deepEqual(schröder(0), [1n]);
  assert.deepEqual(schröder(1), [1n, 2n]);
  assert.throws(() => schröder(-1), RangeError);
});
