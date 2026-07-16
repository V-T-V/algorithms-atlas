import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jacobi } from '../../src/algorithms/math/jacobi-symbol/impl.ts';

test('jacobi 基本值', () => {
  // J(1, n) = 1
  assert.equal(jacobi(1, 3), 1);
  assert.equal(jacobi(1, 15), 1);
  // gcd != 1 → 0
  assert.equal(jacobi(3, 9), 0);
  assert.equal(jacobi(5, 15), 0);
  // 二次剩余/非剩余
  assert.equal(jacobi(2, 7), 1); // 2 是 7 的二次剩余？3²=9≡2 → 是
  assert.equal(jacobi(3, 7), -1); // 3 不是 7 的二次剩余
});

test('jacobi 与勒让德一致（n 为素数）', () => {
  // n=7 素数：J(a,7) = (a/7)
  // 二次剩余 mod 7: 1,2,4
  for (const a of [1, 2, 4]) assert.equal(jacobi(a, 7), 1, `J(${a},7)=1`);
  for (const a of [3, 5, 6]) assert.equal(jacobi(a, 7), -1, `J(${a},7)=-1`);
});

test('jacobi 处理负 a', () => {
  // J(-1, n) = (-1)^((n-1)/2)
  assert.equal(jacobi(-1, 3), -1); // n=3≡3 mod 4
  assert.equal(jacobi(-1, 5), 1); // n=5≡1 mod 4
});

test('jacobi 错误输入', () => {
  assert.throws(() => jacobi(2, 8), RangeError); // n 偶
  assert.throws(() => jacobi(2, 0), RangeError);
  assert.throws(() => jacobi(2, -3), RangeError);
});

test('jacobi 钩子被调用', () => {
  let steps = 0;
  let results = 0;
  jacobi(1001, 9907, {
    onStep: () => steps++,
    onResult: () => results++,
  });
  assert.ok(steps >= 1, '应至少化简一轮');
  assert.equal(results, 1, 'onResult 恰好一次');
});
