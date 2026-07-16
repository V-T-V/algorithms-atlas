import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  precomputeFactorials,
  nCrSmall,
  nCrLucas,
} from '../../src/algorithms/math/nCr-mod-prime/impl.ts';

test('nCrSmall 小组合数', () => {
  const ctx = precomputeFactorials(20, 1000000007);
  assert.equal(nCrSmall(ctx, 0, 0), 1n);
  assert.equal(nCrSmall(ctx, 5, 2), 10n);
  assert.equal(nCrSmall(ctx, 10, 3), 120n);
  assert.equal(nCrSmall(ctx, 20, 10), 184756n);
});

test('nCrSmall 越界返回 0', () => {
  const ctx = precomputeFactorials(10, 1000000007);
  assert.equal(nCrSmall(ctx, 5, -1), 0n);
  assert.equal(nCrSmall(ctx, 5, 6), 0n);
});

test('nCrLucas n >= p', () => {
  // p=7，n=10, r=2 → Lucas: C(10,2) mod 7
  const ctx = precomputeFactorials(6, 7);
  // C(10,2)=45, 45 mod 7 = 3
  assert.equal(nCrLucas(ctx, 10, 2), 3n);
});

test('nCrLucas 大数', () => {
  // 仅需预计算到 n（n < p 时 Lucas 退化为单次查询）
  const ctx = precomputeFactorials(100, 1000000007);
  // C(100, 50) mod 1e9+7
  const naive = (() => {
    let num = 1n;
    let den = 1n;
    for (let i = 0; i < 50; i++) {
      num *= BigInt(100 - i);
      den *= BigInt(i + 1);
    }
    return Number((num / den) % 1000000007n);
  })();
  assert.equal(Number(nCrLucas(ctx, 100, 50)), naive);
  // 真正的 Lucas：n > p（p=7，n=200, r=4）
  const ctx7 = precomputeFactorials(6, 7);
  // C(200,4) = 64684950；mod 7 = 1
  assert.equal(nCrLucas(ctx7, 200, 4), 1n);
});

test('precomputeFactorials 阶乘性质', () => {
  const ctx = precomputeFactorials(10, 1000000007);
  // fact[i] * invfact[i] ≡ 1
  for (let i = 0; i <= 10; i++) {
    assert.equal((ctx.fact[i]! * ctx.invfact[i]!) % ctx.p, 1n);
  }
});
