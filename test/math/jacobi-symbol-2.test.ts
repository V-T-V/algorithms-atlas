import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jacobi } from '../../src/algorithms/math/jacobi-symbol-2/impl.ts';
import { legendre } from '../../src/algorithms/math/legendre-symbol/impl.ts';

test('jacobi 素数模数与 Legendre 一致', () => {
  for (const p of [3n, 5n, 7n, 11n, 13n, 23n, 101n]) {
    for (let a = 1n; a < p; a++) {
      assert.equal(jacobi(a, p), legendre(a, p), `J(${a},${p})`);
    }
  }
});

test('jacobi 合数模数', () => {
  // J(2, 15)：2 模 15。15 ≡ 7 mod 8 → J(2,15)=1
  assert.equal(jacobi(2n, 15n), 1);
  // J(7, 15)：15 = 3·5, J(7,3)=J(1,3)=1, J(7,5)=J(2,5)=-1 → -1
  assert.equal(jacobi(7n, 15n), -1);
});

test('jacobi gcd != 1 返回 0', () => {
  assert.equal(jacobi(3n, 9n), 0);
  assert.equal(jacobi(6n, 15n), 0);
});

test('jacobi 大数与连乘 Legendre 一致', () => {
  // J(a, mn) = J(a,m)·J(a,n)（m,n 奇）
  const m = 15n;
  const n = 21n;
  for (const a of [2n, 4n, 8n, 13n]) {
    const expected = jacobi(a, m) * jacobi(a, n);
    assert.equal(jacobi(a, m * n), expected);
  }
});

test('jacobi 错误输入', () => {
  assert.throws(() => jacobi(3, 4), RangeError); // n 偶
  assert.throws(() => jacobi(3, 0), RangeError);
});
