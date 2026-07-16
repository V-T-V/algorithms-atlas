import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPerfect,
  sumProperDivisors,
  divisorsOf,
  euclidEulerPerfect,
} from '../../src/algorithms/math/perfect-number-math/impl.ts';

test('perfect 6, 28, 496, 8128 是完全数', () => {
  assert.equal(isPerfect(6).isPerfect, true);
  assert.equal(isPerfect(28).isPerfect, true);
  assert.equal(isPerfect(496).isPerfect, true);
  assert.equal(isPerfect(8128).isPerfect, true);
});

test('perfect 12 非完全数', () => {
  // 12 = 1+2+3+4+6 = 16 > 12（盈数）
  assert.equal(isPerfect(12).isPerfect, false);
});

test('perfect 1 非完全数', () => {
  assert.equal(isPerfect(1).isPerfect, false);
});

test('perfect sumProperDivisors', () => {
  assert.equal(sumProperDivisors(6), 6);
  assert.equal(sumProperDivisors(28), 28);
  assert.equal(sumProperDivisors(12), 16);
});

test('perfect divisorsOf', () => {
  assert.deepEqual(divisorsOf(28), [1, 2, 4, 7, 14]);
  assert.deepEqual(divisorsOf(6), [1, 2, 3]);
});

test('perfect Euclid-Euler 生成式', () => {
  // p=2: 2^1·3 = 6
  assert.equal(euclidEulerPerfect(2), 6);
  // p=3: 4·7 = 28
  assert.equal(euclidEulerPerfect(3), 28);
  // p=5: 16·31 = 496
  assert.equal(euclidEulerPerfect(5), 496);
  // p=7: 64·127 = 8128
  assert.equal(euclidEulerPerfect(7), 8128);
  // p=11: 2^11-1 = 2047 = 23·89 非素数 → null
  assert.equal(euclidEulerPerfect(11), null);
});

test('perfect 钩子被调用', () => {
  const ds: number[] = [];
  isPerfect(28, { onDivisor: (d) => ds.push(d) });
  assert.deepEqual(ds, [1, 2, 4, 7, 14]);
});
