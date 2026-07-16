import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  digitalRoot,
  digitalRootFormula,
  digitSum,
} from '../../src/algorithms/misc/digit-root/impl.ts';

test('digitalRoot 基本', () => {
  assert.equal(digitalRoot(0), 0);
  assert.equal(digitalRoot(5), 5);
  assert.equal(digitalRoot(38), 2); // 3+8=11, 1+1=2
  assert.equal(digitalRoot(9875), 2); // 9+8+7+5=29, 2+9=11, 1+1=2
});

test('digitalRoot 一位数直接返回', () => {
  for (let i = 0; i < 10; i++) assert.equal(digitalRoot(i), i);
});

test('digitalRoot 9 的倍数返回 9', () => {
  for (const m of [9, 18, 27, 99, 999, 1233]) {
    assert.equal(digitalRoot(m), 9, `m=${m}`);
  }
});

test('digitalRootFormula 与迭代一致', () => {
  for (let n = 0; n <= 1000; n++) {
    assert.equal(digitalRootFormula(n), digitalRoot(n), `n=${n}`);
  }
});

test('digitalRootFormula 大数', () => {
  assert.equal(digitalRootFormula(123456789), 9);
  assert.equal(digitalRootFormula(10 ** 12), 1);
});

test('digitSum 基本正确', () => {
  assert.equal(digitSum(0), 0);
  assert.equal(digitSum(12), 3);
  assert.equal(digitSum(999), 27);
});

test('digitalRoot 非法输入抛错', () => {
  assert.throws(() => digitalRoot(-1));
  assert.throws(() => digitalRoot(1.5));
});
