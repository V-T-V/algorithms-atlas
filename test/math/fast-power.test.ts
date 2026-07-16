import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fastPower, fastPowerRecursive } from '../../src/algorithms/math/fast-power/impl.ts';

test('fastPower 边界', () => {
  assert.equal(fastPower(5, 0), 1); // 任意数的 0 次幂
  assert.equal(fastPower(0, 0), 1);
  assert.equal(fastPower(7, 1), 7);
});

test('fastPower 与 JS ** 一致（精确整数）', () => {
  for (const [b, e] of [
    [2, 10],
    [3, 7],
    [5, 5],
    [1, 100],
    [12, 4],
  ] as const) {
    assert.equal(fastPower(b, e), b ** e, `${b}^${e}`);
  }
});

test('fastPower 模幂正确', () => {
  assert.equal(fastPower(2, 10, 1000), 24); // 1024 mod 1000
  assert.equal(fastPower(2, 13, 1000), 192); // 8192 mod 1000
  assert.equal(fastPower(7, 256, 13), 9); // 大指数取小模
  // 与 BigInt 交叉校验
  const big = 123456789n ** 5n % 1000000007n;
  assert.equal(fastPower(123456789, 5, 1000000007), Number(big));
});

test('fastPower 底数为负时先规范化', () => {
  assert.equal(fastPower(-2, 3, 5), 2); // (-2)^3 = -8 ≡ -8+10 = 2 (mod 5)
  assert.equal(fastPower(-1, 1000000, 1000), 1);
});

test('fastPower 与递归版一致', () => {
  for (const [b, e] of [
    [2, 13],
    [3, 9],
    [10, 6],
  ] as const) {
    assert.equal(fastPower(b, e), fastPowerRecursive(b, e));
    assert.equal(fastPower(b, e, 97), fastPowerRecursive(b, e, 97));
  }
});

test('fastPower 负指数抛错', () => {
  assert.throws(() => fastPower(2, -1), RangeError);
});

test('fastPower 钩子被调用', () => {
  let bits = 0;
  let squares = 0;
  let mults = 0;
  fastPower(2, 13, 1000, {
    onBit: () => bits++,
    onSquare: () => squares++,
    onMultiply: () => mults++,
  });
  // exp=13=1101₂ 有 4 位；square 在非最后一步触发 → 3 次；bit1 共 3 个 → multiply 3 次
  assert.equal(bits, 4, '位数应等于指数二进制位数');
  assert.equal(squares, 3, '平方次数 = 位数 - 1');
  assert.equal(mults, 3, '累乘次数 = 二进制中 1 的个数');
});
