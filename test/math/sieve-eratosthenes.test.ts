import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sieveEratosthenes } from '../../src/algorithms/math/sieve-eratosthenes/impl.ts';

// 辅助：朴素素性判定，用于交叉校验
function isPrime(x: number): boolean {
  if (x < 2) return false;
  for (let d = 2; d * d <= x; d++) if (x % d === 0) return false;
  return true;
}

test('sieveEratosthenes 边界', () => {
  assert.deepEqual(sieveEratosthenes(0), []);
  assert.deepEqual(sieveEratosthenes(1), []);
  assert.deepEqual(sieveEratosthenes(2), [2]);
});

test('sieveEratosthenes 经典区间', () => {
  assert.deepEqual(sieveEratosthenes(30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  assert.deepEqual(sieveEratosthenes(20), [2, 3, 5, 7, 11, 13, 17, 19]);
});

test('sieveEratosthenes 与朴素判定一致', () => {
  for (const n of [50, 97, 100, 200]) {
    const expected: number[] = [];
    for (let i = 2; i <= n; i++) if (isPrime(i)) expected.push(i);
    assert.deepEqual(sieveEratosthenes(n), expected, `mismatch at n=${n}`);
  }
});

test('sieveEratosthenes 钩子被调用', () => {
  let primes = 0;
  let marks = 0;
  sieveEratosthenes(30, {
    onPrime: () => primes++,
    onMarkComposite: () => marks++,
  });
  assert.equal(primes, 10, '2..30 共 10 个素数');
  assert.ok(marks > 0, '应标记合数');
});
