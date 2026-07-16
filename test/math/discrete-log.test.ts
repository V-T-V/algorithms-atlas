import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discreteLog } from '../../src/algorithms/math/discrete-log/impl.ts';

test('discreteLog 基本求解', () => {
  // 3^4 = 81 ≡ 13 mod 17
  assert.equal(discreteLog(3, 13, 17), 4);
  // 2^? ≡ 1 mod 7 → x=0
  assert.equal(discreteLog(2, 1, 7), 0);
  // 5^3 = 125 ≡ 6 mod 119? 用 5 mod 11: 5^?≡3; 5^4=625≡9,5^3=125≡4, 5^1=5,5^2=3 → x=2
  assert.equal(discreteLog(5, 3, 11), 2);
});

test('discreteLog 验证解正确', () => {
  // g=2, m=1000000007（素数），t = 2^12345 mod m
  const g = 2;
  const m = 1000000007;
  let t = 1;
  for (let i = 0; i < 12345; i++) t = (t * g) % m;
  const x = discreteLog(g, t, m);
  assert.ok(x !== null);
  // 验证 g^x mod m = t
  let v = 1;
  for (let i = 0; i < x!; i++) v = (v * g) % m;
  assert.equal(v, t);
});

test('discreteLog 无解返回 null', () => {
  // 2 是 7 的原根，但 3 不是二次剩余？2^x mod7 ∈ {1,2,4}；3 无解
  assert.equal(discreteLog(2, 3, 7), null);
  assert.equal(discreteLog(2, 5, 7), null);
});

test('discreteLog 错误输入', () => {
  assert.throws(() => discreteLog(2, 3, 1), RangeError);
});

test('discreteLog 钩子被调用', () => {
  let babys = 0;
  let giants = 0;
  let results = 0;
  discreteLog(3, 13, 17, {
    onBabyStep: () => babys++,
    onGiantStep: () => giants++,
    onResult: () => results++,
  });
  assert.ok(babys >= 1, '应至少一次 baby step');
  assert.ok(giants >= 1, '应至少一次 giant step');
  assert.equal(results, 1, 'onResult 恰好一次');
});
