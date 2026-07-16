import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isArmstrongNumber, digitCount } from '../../src/algorithms/misc/armstrong-number/impl.ts';

test('isArmstrongNumber 三位水仙花数', () => {
  assert.equal(isArmstrongNumber(153), true);
  assert.equal(isArmstrongNumber(370), true);
  assert.equal(isArmstrongNumber(371), true);
  assert.equal(isArmstrongNumber(407), true);
});

test('isArmstrongNumber 四位水仙花数', () => {
  assert.equal(isArmstrongNumber(9474), true);
  assert.equal(isArmstrongNumber(1634), true);
});

test('isArmstrongNumber 非水仙花数', () => {
  assert.equal(isArmstrongNumber(154), false);
  assert.equal(isArmstrongNumber(100), false);
  assert.equal(isArmstrongNumber(123), false);
});

test('isArmstrongNumber 单位与边界', () => {
  // 0..9 全是 Armstrong 数（1 次方）
  for (let i = 0; i <= 9; i++) assert.equal(isArmstrongNumber(i), true);
  assert.equal(isArmstrongNumber(0), true);
});

test('digitCount 正确', () => {
  assert.equal(digitCount(0), 1);
  assert.equal(digitCount(5), 1);
  assert.equal(digitCount(99), 2);
  assert.equal(digitCount(100), 3);
  assert.equal(digitCount(12345), 5);
});

test('isArmstrongNumber 非法输入抛错', () => {
  assert.throws(() => isArmstrongNumber(-1));
  assert.throws(() => isArmstrongNumber(1.5));
});
