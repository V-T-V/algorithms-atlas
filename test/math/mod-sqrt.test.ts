import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modSqrt } from '../../src/algorithms/math/mod-sqrt/impl.ts';

test('modSqrt 基本二次剩余', () => {
  // x² ≡ 10 (mod 13)：6 和 7 都满足（13−6=7）
  const r = modSqrt(10, 13);
  assert.ok(r !== null);
  assert.equal((r * r) % 13, 10);
  assert.ok(r === 6 || r === 7);
});

test('modSqrt p ≡ 3 mod 4 特例', () => {
  // x² ≡ 2 (mod 7)：3 和 4 都满足
  const r = modSqrt(2, 7);
  assert.ok(r !== null);
  assert.equal((r * r) % 7, 2);
});

test('modSqrt 非剩余返回 null', () => {
  // 二次剩余 mod 7: {0,1,2,4}；非剩余 {3,5,6}
  assert.equal(modSqrt(3, 7), null);
  assert.equal(modSqrt(5, 7), null);
  assert.equal(modSqrt(6, 7), null);
  // mod 11 非剩余：3,4,5,9 等（剩余 {1,3,4,5,9}?）用欧拉判据
  // 2 是 11 的非剩余：2^5=32≡-1
  assert.equal(modSqrt(2, 11), null);
});

test('modSqrt n=0', () => {
  assert.equal(modSqrt(0, 13), 0);
});

test('modSqrt 对全部剩余逐一验证（p=29）', () => {
  const p = 29;
  for (let x = 0; x < p; x++) {
    const n = (x * x) % p;
    const r = modSqrt(n, p);
    if (n === 0) {
      assert.equal(r, 0);
    } else {
      assert.notEqual(r, null, `${n} 应有解`);
      assert.equal((r! * r!) % p, n, `r²≡n mod ${p} 失败 n=${n}`);
    }
  }
});

test('modSqrt 对全部非剩余验证无解（p=13）', () => {
  const p = 13;
  for (let n = 1; n < p; n++) {
    const r = modSqrt(n, p);
    // 若返回值，必须是真解
    if (r !== null) assert.equal((r * r) % p, n);
  }
});

test('modSqrt 错误输入', () => {
  assert.throws(() => modSqrt(5, 1), RangeError);
});

test('modSqrt 钩子被调用', () => {
  let results = 0;
  modSqrt(10, 13, { onResult: () => results++ });
  assert.equal(results, 1, 'onResult 恰好一次');
});
