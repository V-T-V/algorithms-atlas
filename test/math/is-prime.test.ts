import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrime } from '../../src/algorithms/math/is-prime/impl.ts';

test('isPrime 小素数', () => {
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 97, 101]) {
    assert.equal(isPrime(p), true, `${p} 应为素数`);
  }
});

test('isPrime 合数', () => {
  for (const c of [4, 6, 8, 9, 10, 15, 21, 25, 35, 49, 91, 121, 1000003 * 1000033]) {
    assert.equal(isPrime(c), false, `${c} 应为合数`);
  }
});

test('isPrime 边界', () => {
  assert.equal(isPrime(0), false);
  assert.equal(isPrime(1), false);
  assert.equal(isPrime(2), true);
  assert.equal(isPrime(-7), false);
});

test('isPrime 较大素数', () => {
  assert.equal(isPrime(1000003), true);
  assert.equal(isPrime(1000000007), true);
});

test('isPrime 钩子被调用', () => {
  let trials = 0;
  let results = 0;
  isPrime(97, {
    onTrial: () => trials++,
    onResult: () => results++,
  });
  assert.ok(trials > 0, '应至少试除一次');
  assert.equal(results, 1, 'onResult 恰好一次');
});
