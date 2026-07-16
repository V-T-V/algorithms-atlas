import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmentedSieve } from '../../src/algorithms/math/segmented-sieve/impl.ts';

test('segmentedSieve 小区间', () => {
  assert.deepEqual(segmentedSieve(50, 100), [53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
});

test('segmentedSieve 从 2 开始', () => {
  assert.deepEqual(segmentedSieve(2, 30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test('segmentedSieve 大区间与素性测试一致', () => {
  const got = segmentedSieve(1000000, 1000500);
  const isPrime = (x: number): boolean => {
    if (x < 2) return false;
    for (let d = 2; d * d <= x; d++) if (x % d === 0) return false;
    return true;
  };
  const naive: number[] = [];
  for (let x = 1000000; x <= 1000500; x++) if (isPrime(x)) naive.push(x);
  assert.deepEqual(got, naive);
});

test('segmentedSieve 空区间', () => {
  assert.deepEqual(segmentedSieve(10, 5), []);
});

test('segmentedSieve 钩子', () => {
  let segCount = 0;
  segmentedSieve(50, 100, { onSegment: () => segCount++ });
  assert.ok(segCount >= 1);
});
