import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countPrimes, isPrimeSimple } from '../../src/algorithms/misc/misc-count-primes/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-count-primes/trace.ts';

test('count-primes n=10 = 4', () => {
  assert.equal(countPrimes(10), 4);
});

test('count-primes n=0 = 0', () => {
  assert.equal(countPrimes(0), 0);
});

test('count-primes n=1 = 0', () => {
  assert.equal(countPrimes(1), 0);
});

test('count-primes n=2 = 0', () => {
  assert.equal(countPrimes(2), 0);
});

test('count-primes 与暴力一致', () => {
  for (let n = 0; n <= 100; n++) {
    let brute = 0;
    for (let i = 2; i < n; i++) if (isPrimeSimple(i)) brute++;
    assert.equal(countPrimes(n), brute, `n=${n}`);
  }
});

test('count-primes n=100 = 25', () => {
  assert.equal(countPrimes(100), 25);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
