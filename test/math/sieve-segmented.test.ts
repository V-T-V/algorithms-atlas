import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sieveSegmented } from '../../src/algorithms/math/sieve-segmented/impl.ts';

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

test('segmented [50,100] 标准', () => {
  const primes = sieveSegmented(50, 100);
  const expected: number[] = [];
  for (let i = 50; i <= 100; i++) if (isPrime(i)) expected.push(i);
  assert.deepEqual(primes, expected);
});

test('segmented 大区间', () => {
  const primes = sieveSegmented(1_000_000, 1_000_100);
  const expected: number[] = [];
  for (let i = 1_000_000; i <= 1_000_100; i++) if (isPrime(i)) expected.push(i);
  assert.deepEqual(primes, expected);
});

test('segmented 包含 2', () => {
  const primes = sieveSegmented(1, 10);
  assert.deepEqual(primes, [2, 3, 5, 7]);
});

test('segmented 边界', () => {
  assert.deepEqual(sieveSegmented(10, 5), []); // L>R
  assert.deepEqual(sieveSegmented(0, 1), []); // R<2
});

test('segmented 单点素数', () => {
  assert.deepEqual(sieveSegmented(97, 97), [97]);
});

test('segmented 钩子', () => {
  let marks = 0;
  let results = 0;
  sieveSegmented(20, 40, { onMark: () => marks++, onResult: () => results++ });
  assert.ok(marks > 0);
  assert.equal(results, 1);
});
