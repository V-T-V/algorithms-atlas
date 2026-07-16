import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tonelliShanks } from '../../src/algorithms/math/tonelli-shanks/impl.ts';

test('tonelliShanks 小例', () => {
  // x² ≡ 10 (mod 13)：6²=36=2*13+10 → 6
  const r = tonelliShanks(10n, 13n)!;
  assert.equal((r * r) % 13n, 10n);
});

test('tonelliShanks p ≡ 3 mod 4 特例', () => {
  const r = tonelliShanks(2n, 7n)!; // 3²=2 mod 7 → 3 或 4
  assert.equal((r * r) % 7n, 2n);
});

test('tonelliShanks 非剩余返回 null', () => {
  // 2 是模 5 的非剩余
  assert.equal(tonelliShanks(2n, 5n), null);
});

test('tonelliShanks 全范围验证（素数 97）', () => {
  const p = 97n;
  const seen = new Set<string>();
  for (let a = 1n; a < p; a++) {
    const r = tonelliShanks(a, p);
    if (r === null) continue;
    assert.equal((r * r) % p, a % p);
    seen.add(a.toString());
  }
  // 模 97 的剩余个数应为 (97-1)/2 = 48
  assert.equal(seen.size, 48);
});

test('tonelliShanks 大素数', () => {
  const p = 1000000007n;
  const r = tonelliShanks(2n, p)!;
  assert.equal((r * r) % p, 2n);
});

test('tonelliShanks n=0', () => {
  assert.equal(tonelliShanks(0n, 13n), 0n);
});
