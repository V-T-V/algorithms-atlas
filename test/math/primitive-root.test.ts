import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minPrimitiveRoot,
  allPrimitiveRoots,
  isPrimitiveRoot,
  distinctPrimeFactors,
  isPrime,
  powModBig,
} from '../../src/algorithms/math/primitive-root/impl.ts';

test('已知最小原根', () => {
  // 经典小素数的最小原根
  // 2→1, 3→2, 5→2, 7→3, 11→2, 13→2, 17→3, 19→2, 23→5
  assert.equal(minPrimitiveRoot(2), 1);
  assert.equal(minPrimitiveRoot(3), 2);
  assert.equal(minPrimitiveRoot(5), 2);
  assert.equal(minPrimitiveRoot(7), 3);
  assert.equal(minPrimitiveRoot(11), 2);
  assert.equal(minPrimitiveRoot(13), 2);
  assert.equal(minPrimitiveRoot(17), 3);
  assert.equal(minPrimitiveRoot(19), 2);
  assert.equal(minPrimitiveRoot(23), 5);
});

test('998244353 的最小原根是 3', () => {
  assert.equal(minPrimitiveRoot(998244353), 3);
});

test('isPrimitiveRoot 判定', () => {
  // 7 的原根是 3, 5
  assert.equal(isPrimitiveRoot(3, 7), true);
  assert.equal(isPrimitiveRoot(5, 7), true);
  assert.equal(isPrimitiveRoot(2, 7), false); // 2^3=8≡1 mod 7
  assert.equal(isPrimitiveRoot(1, 7), false);
  // 3 是 998244353 的原根
  assert.equal(isPrimitiveRoot(3, 998244353), true);
  assert.equal(isPrimitiveRoot(2, 998244353), false);
});

test('原根个数 = φ(p-1)', () => {
  // φ(n) 简单实现
  const phi = (n: number): number => {
    let r = n;
    let m = n;
    for (let p = 2; p * p <= m; p++) {
      if (m % p === 0) {
        while (m % p === 0) m = Math.floor(m / p);
        r -= Math.floor(r / p);
      }
    }
    if (m > 1) r -= Math.floor(r / m);
    return r;
  };
  for (const p of [7, 11, 13, 17, 23, 97]) {
    const roots = allPrimitiveRoots(p);
    assert.equal(roots.length, phi(p - 1), `p=${p}`);
    // 每个都应是原根
    for (const g of roots) assert.equal(isPrimitiveRoot(g, p), true);
  }
});

test('所有原根生成全部非零剩余', () => {
  // g^1..g^(p-1) 应取遍 1..p-1
  for (const p of [7, 11, 13]) {
    const g = minPrimitiveRoot(p);
    const set = new Set<number>();
    let cur = 1n;
    for (let k = 1; k < p; k++) {
      cur = (cur * BigInt(g)) % BigInt(p);
      set.add(Number(cur));
    }
    assert.equal(set.size, p - 1, `g=${g} of p=${p} 应生成全部非零剩余`);
  }
});

test('distinctPrimeFactors / isPrime 工具', () => {
  assert.deepEqual(distinctPrimeFactors(12), [2, 3]); // 12 = 2^2·3
  assert.deepEqual(distinctPrimeFactors(7), [7]);
  assert.deepEqual(distinctPrimeFactors(60), [2, 3, 5]);
  // p-1 = 998244352 = 2^23 · 7 · 17
  assert.deepEqual(distinctPrimeFactors(998244352), [2, 7, 17]);
  assert.equal(isPrime(998244353), true);
  assert.equal(isPrime(15), false);
});

test('非素数抛错', () => {
  assert.throws(() => minPrimitiveRoot(15), RangeError);
  assert.throws(() => minPrimitiveRoot(1), RangeError);
});

test('powModBig 工具', () => {
  assert.equal(powModBig(2n, 10n, 1000n), 24n); // 1024 mod 1000
  assert.equal(powModBig(3n, 5n, 100n), 43n); // 243 mod 100 = 43
});

test('primitive-root 钩子被调用', () => {
  let candidate = 0;
  let check = 0;
  let found = 0;
  let lastFound = -1;
  minPrimitiveRoot(11, {
    onCandidate: () => candidate++,
    onCheck: () => check++,
    onFound: (g) => {
      found++;
      lastFound = g;
    },
  });
  assert.ok(candidate >= 1, '应尝试至少一个候选');
  assert.ok(check >= 1, '应执行至少一次验证');
  assert.equal(found, 1);
  assert.equal(lastFound, 2);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/math/primitive-root/trace.ts');
  // 用小素数以免太慢
  const frames = buildTrace({ p: 23 });
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
});
