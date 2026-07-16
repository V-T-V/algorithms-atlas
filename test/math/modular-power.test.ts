import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modularPower } from '../../src/algorithms/math/modular-power/impl.ts';

test('modularPower 边界', () => {
  assert.equal(modularPower(5, 0, 7), 1);
  assert.equal(modularPower(0, 0, 7), 1);
  assert.equal(modularPower(7, 1, 100), 7);
});

test('modularPower 正确性', () => {
  assert.equal(modularPower(2, 10, 1000), 24); // 1024 mod 1000
  assert.equal(modularPower(2, 13, 1000), 192); // 8192 mod 1000
  assert.equal(modularPower(7, 256, 13), 9);
  // 交叉校验 BigInt
  const big = 123456789n ** 5n % 1000000007n;
  assert.equal(modularPower(123456789, 5, 1000000007), Number(big));
});

test('modularPower 负底数规范化', () => {
  assert.equal(modularPower(-2, 3, 5), 2); // (-2)^3 = -8 ≡ 2 (mod 5)
  assert.equal(modularPower(-1, 1000000, 1000), 1);
});

test('modularPower 错误输入', () => {
  assert.throws(() => modularPower(2, -1, 5), RangeError);
  assert.throws(() => modularPower(2, 3, 0), RangeError);
  assert.throws(() => modularPower(2, 3, -5), RangeError);
});

test('modularPower 钩子计数', () => {
  let bits = 0;
  let squares = 0;
  let mults = 0;
  modularPower(2, 13, 1000, {
    onBit: () => bits++,
    onSquare: () => squares++,
    onMultiply: () => mults++,
  });
  // 13 = 1101₂ → 4 位, 3 次平方, 3 次累乘
  assert.equal(bits, 4);
  assert.equal(squares, 3);
  assert.equal(mults, 3);
});
