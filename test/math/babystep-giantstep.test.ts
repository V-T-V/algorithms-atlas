import { test } from 'node:test';
import assert from 'node:assert/strict';
import { babyStepGiantStep, _modPow } from '../../src/algorithms/math/babystep-giantstep/impl.ts';

test('bsgs 基本离散对数', () => {
  // 3^4 = 81 ≡ 13 (mod 17)
  const x = babyStepGiantStep(3, 13, 17);
  assert.equal(x, 4);
});

test('bsgs b=1 返回 0', () => {
  assert.equal(babyStepGiantStep(5, 1, 23), 0);
});

test('bsgs 解满足 a^x ≡ b (mod p)', () => {
  const cases: Array<[number, number, number]> = [
    [2, 3, 5],
    [5, 12, 23],
    [3, 7, 11],
  ];
  for (const [a, b, p] of cases) {
    const x = babyStepGiantStep(a, b, p);
    if (x !== null) {
      assert.equal(_modPow(BigInt(a), BigInt(x), BigInt(p)), BigInt(b) % BigInt(p));
    }
  }
});

test('bsgs 无解返回 null', () => {
  // 2 在 mod 7 下生成 {1,2,4}；3 不在其中 → 无解
  assert.equal(babyStepGiantStep(2, 3, 7), null);
});

test('bsgs 大数', () => {
  // 5 是 mod 1000000007 的原根之一；验证 5^x ≡ 5^123 (mod p) 解出 123
  const p = 1000000007n;
  const target = _modPow(5n, 123n, p);
  const x = babyStepGiantStep(5, Number(target), Number(p));
  assert.equal(x, 123);
});

test('bsgs 钩子', () => {
  let baby = 0;
  let giant = 0;
  babyStepGiantStep(3, 13, 17, {
    onBabyStep: () => baby++,
    onGiantStep: () => giant++,
  });
  assert.ok(baby > 0);
  assert.ok(giant > 0);
});
