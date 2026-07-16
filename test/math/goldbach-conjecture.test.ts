import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  goldbach,
  goldbachPartitionCount,
} from '../../src/algorithms/math/goldbach-conjecture/impl.ts';

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

test('goldbach 找到的两数都是素数且和为 n', () => {
  for (const n of [4, 10, 28, 100, 1000]) {
    const { found, pair } = goldbach(n);
    assert.equal(found, true);
    assert.ok(pair);
    assert.equal(pair![0] + pair![1], n);
    assert.ok(isPrime(pair![0]) && isPrime(pair![1]));
  }
});

test('goldbach 4 = 2+2', () => {
  assert.deepEqual(goldbach(4).pair, [2, 2]);
});

test('goldbach 6 = 3+3', () => {
  assert.deepEqual(goldbach(6).pair, [3, 3]);
});

test('goldbach 奇数/小数无解', () => {
  assert.equal(goldbach(7).found, false);
  assert.equal(goldbach(2).found, false);
});

test('goldbach 分拆数非负', () => {
  for (const n of [4, 10, 50, 100]) {
    assert.ok(goldbachPartitionCount(n) >= 1);
  }
});

test('goldbach 钩子', () => {
  let tries = 0;
  goldbach(10, { onTry: () => tries++ });
  assert.ok(tries > 0);
});
