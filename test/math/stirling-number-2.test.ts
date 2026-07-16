import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stirlingNumber2 } from '../../src/algorithms/math/stirling-number-2/impl.ts';

test('stirlingNumber2 已知值', () => {
  // S(4,2)=7, S(5,2)=15, S(5,3)=25
  assert.equal(stirlingNumber2(4, 2), 7n);
  assert.equal(stirlingNumber2(5, 2), 15n);
  assert.equal(stirlingNumber2(5, 3), 25n);
  assert.equal(stirlingNumber2(8, 3), 966n);
});

test('stirlingNumber2 边界', () => {
  assert.equal(stirlingNumber2(0, 0), 1n);
  assert.equal(stirlingNumber2(5, 0), 0n);
  assert.equal(stirlingNumber2(0, 5), 0n);
  assert.equal(stirlingNumber2(3, 5), 0n);
});

test('stirlingNumber2 与递推一致', () => {
  // 用递推构造表对照
  const N = 12;
  const dp: bigint[][] = [];
  for (let i = 0; i <= N; i++) {
    const row = new Array<bigint>(N + 1).fill(0n);
    dp.push(row);
    for (let j = 0; j <= i; j++) {
      if (i === 0 && j === 0) row[j] = 1n;
      else if (j === 0) row[j] = 0n;
      else row[j] = BigInt(j) * (dp[i - 1]?.[j] ?? 0n) + (dp[i - 1]?.[j - 1] ?? 0n);
    }
  }
  for (let n = 1; n <= N; n++) {
    for (let k = 1; k <= n; k++) {
      assert.equal(stirlingNumber2(n, k), dp[n]![k]!, `S(${n},${k})`);
    }
  }
});

test('stirlingNumber2 大 n', () => {
  // S(20, 3) = 580606446
  assert.equal(stirlingNumber2(20, 3), 580606446n);
});
