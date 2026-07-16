import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multiply } from '../../src/algorithms/bitwise/multiply/impl.ts';

test('multiply 基本行为', () => {
  assert.equal(multiply(0, 5), 0);
  assert.equal(multiply(5, 0), 0);
  assert.equal(multiply(1, 1), 1);
  assert.equal(multiply(13, 11), 143);
  assert.equal(multiply(7, 8), 56);
});

test('multiply 含零与负数', () => {
  assert.equal(multiply(-3, 4), -12);
  assert.equal(multiply(3, -4), -12);
  assert.equal(multiply(-3, -4), 12);
  assert.equal(multiply(0, -7), 0);
});

test('multiply 与原生 * 在 32 位范围一致', () => {
  const cases: Array<[number, number]> = [
    [123, 456],
    [1024, 64],
    [65535, 65535],
    [-1000, 500],
    [2147483647, 1],
  ];
  for (const [a, b] of cases) assert.equal(multiply(a, b), (a * b) | 0, `${a}*${b}`);
});

test('multiply 钩子被调用', () => {
  const bits: Array<0 | 1> = [];
  const r = multiply(13, 11, {
    onBit: (_step, bit) => bits.push(bit),
  });
  assert.equal(r, 143);
  // 11 = 0b1011 -> 从低位到高位: 1,1,0,1
  assert.deepEqual(bits, [1, 1, 0, 1]);
});
