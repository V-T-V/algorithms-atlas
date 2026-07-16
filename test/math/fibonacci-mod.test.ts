import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibMod } from '../../src/algorithms/math/fibonacci-mod/impl.ts';

test('fib-mod 小值 F(0..10)', () => {
  const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  for (let i = 0; i < expected.length; i++) {
    assert.equal(fibMod(i, 1000000).value, expected[i]);
  }
});

test('fib-mod 取模生效', () => {
  // F(100) = 354224848179261915075, mod 1000 = 75
  assert.equal(fibMod(100, 1000).value, 75);
});

test('fib-mod 接受 BigInt 指数', () => {
  // F(10) via BigInt
  assert.equal(fibMod(10n, 1000).value, 55);
});

test('fib-mod 超大指数不溢出', () => {
  // F(1e18) mod 1e9+7 — 主要验证不抛错、为合法模值
  const v = fibMod(10n ** 18n, 1_000_000_007).value;
  assert.ok(v >= 0 && v < 1_000_000_007);
});

test('fib-mod n=0 = 0, n=1 = 1', () => {
  assert.equal(fibMod(0, 1000).value, 0);
  assert.equal(fibMod(1, 1000).value, 1);
});

test('fib-mod mod=2 周期', () => {
  // F mod 2 周期 3：0,1,1,0,1,1,...
  assert.equal(fibMod(3, 2).value, 0);
  assert.equal(fibMod(4, 2).value, 1);
  assert.equal(fibMod(6, 2).value, 0);
});

test('fib-mod 钩子被调用', () => {
  let calls = 0;
  fibMod(10, 1000, { onMultiply: () => calls++ });
  assert.ok(calls > 0);
});
