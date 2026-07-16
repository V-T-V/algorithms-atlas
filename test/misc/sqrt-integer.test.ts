import { test } from 'node:test';
import assert from 'node:assert/strict';
import { integerSqrt, integerSqrtBinary } from '../../src/algorithms/misc/sqrt-integer/impl.ts';

test('integerSqrt 完全平方数', () => {
  for (let r = 0; r <= 1000; r++) {
    assert.equal(integerSqrt(r * r), r, `r=${r}`);
  }
});

test('integerSqrt 非完全平方数（下取整）', () => {
  assert.equal(integerSqrt(0), 0);
  assert.equal(integerSqrt(1), 1);
  assert.equal(integerSqrt(2), 1);
  assert.equal(integerSqrt(3), 1);
  assert.equal(integerSqrt(8), 2);
  assert.equal(integerSqrt(15), 3);
  assert.equal(integerSqrt(99), 9);
  assert.equal(integerSqrt(100), 10);
  assert.equal(integerSqrt(101), 10);
  assert.equal(integerSqrt(152399025), 12345); // 12345²=152399025
});

test('integerSqrt 满足 r² <= n < (r+1)²', () => {
  for (let n = 0; n <= 5000; n++) {
    const r = integerSqrt(n);
    assert.ok(r * r <= n, `n=${n} r=${r}: r²>n`);
    assert.ok((r + 1) * (r + 1) > n, `n=${n} r=${r}: (r+1)²<=n`);
  }
});

test('integerSqrt 与二分法一致', () => {
  for (let n = 0; n <= 10000; n++) {
    assert.equal(integerSqrt(n), integerSqrtBinary(n), `n=${n}`);
  }
});

test('integerSqrt 大数', () => {
  assert.equal(integerSqrt(10 ** 12), 10 ** 6);
  assert.equal(integerSqrt(2 ** 30), 32768); // √(2^30)=2^15
});

test('integerSqrt 非法输入抛错', () => {
  assert.throws(() => integerSqrt(-1));
  assert.throws(() => integerSqrt(2.5));
});
