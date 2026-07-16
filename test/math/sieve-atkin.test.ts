import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sieveAtkin } from '../../src/algorithms/math/sieve-atkin/impl.ts';

const PRIMES_TO_30 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

test('atkin [2,30] 标准素数', () => {
  assert.deepEqual(sieveAtkin(30), PRIMES_TO_30);
});

test('atkin 边界', () => {
  assert.deepEqual(sieveAtkin(0), []);
  assert.deepEqual(sieveAtkin(1), []);
  assert.deepEqual(sieveAtkin(2), [2]);
  assert.deepEqual(sieveAtkin(3), [2, 3]);
});

test('atkin 与埃氏一致', async () => {
  // 简单复刻埃氏以交叉验证
  const eratosthenes = (n: number): number[] => {
    const isP = new Array(n + 1).fill(true);
    isP[0] = isP[1] = false;
    for (let i = 2; i * i <= n; i++) if (isP[i]) for (let j = i * i; j <= n; j += i) isP[j] = false;
    const r: number[] = [];
    for (let i = 2; i <= n; i++) if (isP[i]) r.push(i);
    return r;
  };
  for (const n of [10, 30, 50, 100, 200]) {
    assert.deepEqual(sieveAtkin(n), eratosthenes(n), `n=${n}`);
  }
});

test('atkin 钩子', () => {
  let flips = 0;
  let results = 0;
  sieveAtkin(20, { onFlip: () => flips++, onResult: () => results++ });
  assert.ok(flips > 0);
  assert.equal(results, 1);
});
