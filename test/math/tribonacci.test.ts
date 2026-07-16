import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tribonacci } from '../../src/algorithms/math/tribonacci/impl.ts';

test('tribonacci 已知序列', () => {
  // T(0..10): 0,0,1,1,2,4,7,13,24,44,81
  const expected = [0n, 0n, 1n, 1n, 2n, 4n, 7n, 13n, 24n, 44n, 81n];
  for (let n = 0; n <= 10; n++) assert.equal(tribonacci(n), expected[n], `T(${n})`);
});

test('tribonacci 与朴素递推一致', () => {
  const a: bigint[] = [0n, 0n, 1n];
  for (let n = 3; n <= 100; n++) {
    a.push(a[n - 1]! + a[n - 2]! + a[n - 3]!);
  }
  for (let n = 0; n <= 100; n++) {
    assert.equal(tribonacci(n), a[n]!, `T(${n})`);
  }
});

test('tribonacci 大数', () => {
  // T(30) = 15902591
  assert.equal(tribonacci(30), 15902591n);
});

test('tribonacci 边界', () => {
  assert.equal(tribonacci(0), 0n);
  assert.equal(tribonacci(1), 0n);
  assert.equal(tribonacci(2), 1n);
  assert.throws(() => tribonacci(-1), RangeError);
});
