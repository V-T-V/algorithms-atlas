import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partitionP } from '../../src/algorithms/math/partition-p/impl.ts';

test('partitionP 已知值', () => {
  // p(0..10): 1,1,2,3,5,7,11,15,22,30,42
  assert.deepEqual(partitionP(10), [1n, 1n, 2n, 3n, 5n, 7n, 11n, 15n, 22n, 30n, 42n]);
});

test('partitionP 大数', () => {
  // p(20)=627, p(50)=204226
  assert.equal(partitionP(20)[20], 627n);
  assert.equal(partitionP(50)[50], 204226n);
});

test('partitionP 边界', () => {
  assert.deepEqual(partitionP(0), [1n]);
  assert.equal(partitionP(1)[1], 1n);
  assert.throws(() => partitionP(-1), RangeError);
});

test('partitionP 递推一致性（小范围）', () => {
  const p = partitionP(30);
  // 与 O(n²) 朴素对照
  const naive = (n: number): bigint => {
    const dp = new Array<bigint>(n + 1).fill(0n);
    dp[0] = 1n;
    for (let k = 1; k <= n; k++) {
      for (let j = k; j <= n; j++) dp[j] = dp[j]! + dp[j - k]!;
    }
    return dp[n]!;
  };
  for (let n = 0; n <= 30; n++) assert.equal(p[n], naive(n), `p(${n})`);
});
