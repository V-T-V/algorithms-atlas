import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gcdRecursive,
  extGcdRecursive,
} from '../../src/algorithms/recursion/gcd-recursive/impl.ts';

test('gcdRecursive 基本样例', () => {
  assert.equal(gcdRecursive(252, 105), 21);
  assert.equal(gcdRecursive(54, 24), 6);
  assert.equal(gcdRecursive(48, 18), 6);
  assert.equal(gcdRecursive(1071, 462), 21);
});

test('gcdRecursive 特殊情况', () => {
  assert.equal(gcdRecursive(0, 0), 0);
  assert.equal(gcdRecursive(5, 0), 5);
  assert.equal(gcdRecursive(0, 7), 7);
  assert.equal(gcdRecursive(7, 7), 7);
  assert.equal(gcdRecursive(13, 17), 1); // 互素
});

test('gcdRecursive 交换律', () => {
  assert.equal(gcdRecursive(105, 252), gcdRecursive(252, 105));
});

test('gcdRecursive 与线性组合一致（贝祖等式）', () => {
  const { g, x, y } = extGcdRecursive(252, 105);
  assert.equal(g, 21);
  assert.equal(252 * x + 105 * y, 21);
});

test('gcdRecursive 非法输入抛错', () => {
  assert.throws(() => gcdRecursive(-1, 5));
  assert.throws(() => gcdRecursive(1.5, 2));
});
