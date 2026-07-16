import { test } from 'node:test';
import assert from 'node:assert/strict';
import { factorialMod } from '../../src/algorithms/math/factorial-mod/impl.ts';

test('factorialMod 小阶乘', () => {
  assert.equal(factorialMod(0, 1000), 1);
  assert.equal(factorialMod(1, 1000), 1);
  assert.equal(factorialMod(5, 1000), 120);
  assert.equal(factorialMod(10, 100000), 28800); // 10! = 3628800; mod 100000 = 28800
});

test('factorialMod 与 BigInt 交叉校验', () => {
  const m = 1000000007n;
  for (const n of [20, 50, 100, 1000]) {
    let big = 1n;
    for (let i = 1; i <= n; i++) big = (big * BigInt(i)) % m;
    assert.equal(factorialMod(n, Number(m)), Number(big), `${n}! mod m`);
  }
});

test('factorialMod n >= 素数 m 时为 0', () => {
  assert.equal(factorialMod(7, 7), 0);
  assert.equal(factorialMod(100, 97), 0);
});

test('factorialMod 错误输入', () => {
  assert.throws(() => factorialMod(-1, 5), RangeError);
  assert.throws(() => factorialMod(5, 0), RangeError);
});

test('factorialMod 钩子被调用', () => {
  let steps = 0;
  let results = 0;
  factorialMod(5, 1000, {
    onStep: () => steps++,
    onResult: () => results++,
  });
  assert.ok(steps >= 5, '应至少 5 步');
  assert.equal(results, 1, 'onResult 恰好一次');
});
