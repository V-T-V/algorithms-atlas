import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abs } from '../../src/algorithms/bitwise/abs/impl.ts';

test('abs 基本行为', () => {
  assert.equal(abs(0), 0);
  assert.equal(abs(1), 1);
  assert.equal(abs(-1), 1);
  assert.equal(abs(42), 42);
  assert.equal(abs(-42), 42);
});

test('abs 非负数不变，负数取反', () => {
  for (let i = -100; i <= 100; i++) assert.equal(abs(i), Math.abs(i));
});

test('abs 与 Math.abs 在 32 位范围内一致', () => {
  const samples = [123456, -123456, 2147483647, -2147483647];
  for (const x of samples) assert.equal(abs(x), Math.abs(x));
});

test('abs INT_MIN 溢出（按位运算逻辑返回自身）', () => {
  assert.equal(abs(-2147483648), -2147483648);
});

test('abs 截断到 32 位整数', () => {
  // 超出 32 位的浮点会被 |0 截断
  assert.equal(abs(2147483647.9), 2147483647);
});

test('abs 钩子被调用', () => {
  let signCalls = 0;
  let resultCalls = 0;
  abs(-9, {
    onSign: (x, mask) => {
      signCalls++;
      assert.equal(x, -9);
      assert.equal(mask, -1);
    },
    onResult: (xored, result) => {
      resultCalls++;
      assert.equal(xored, 8); // -9 ^ -1 = 8
      assert.equal(result, 9);
    },
  });
  assert.equal(signCalls, 1);
  assert.equal(resultCalls, 1);
});
