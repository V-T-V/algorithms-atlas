import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerSieveFull } from '../../src/algorithms/math/sieve-euler-full/impl.ts';

test('eulerSieveFull n=30', () => {
  const { primes, lpf } = eulerSieveFull(30);
  assert.deepEqual(primes, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  // lpf 检查
  assert.equal(lpf[2], 2);
  assert.equal(lpf[12], 2);
  assert.equal(lpf[15], 3);
  assert.equal(lpf[25], 5);
  assert.equal(lpf[29], 29);
});

test('eulerSieveFull 与朴素筛一致（100）', () => {
  const { primes } = eulerSieveFull(100);
  const composite = new Array(101).fill(false);
  const expected: number[] = [];
  for (let i = 2; i <= 100; i++) {
    if (!composite[i]) {
      expected.push(i);
      for (let j = i * i; j <= 100; j += i) composite[j] = true;
    }
  }
  assert.deepEqual(primes, expected);
});

test('eulerSieveFull lpf 一致性', () => {
  const { lpf } = eulerSieveFull(1000);
  for (let i = 2; i <= 1000; i++) {
    // lpf[i] 应是 i 的最小质因子
    let p = 2;
    while (i % p !== 0) p++;
    assert.equal(lpf[i], p, `lpf[${i}]`);
  }
});

test('eulerSieveFull 边界', () => {
  assert.deepEqual(eulerSieveFull(1).primes, []);
  assert.deepEqual(eulerSieveFull(2).primes, [2]);
  assert.deepEqual(eulerSieveFull(0).primes, []);
});

test('eulerSieveFull 钩子', () => {
  let primeCount = 0;
  let markCount = 0;
  eulerSieveFull(50, {
    onPrime: () => primeCount++,
    onMark: () => markCount++,
  });
  // 每个合数被标记恰好一次 → markCount = 合数个数
  assert.equal(markCount, 50 - 2 - 15 + 1); // [2,50] 共49个数，15个素数
});
