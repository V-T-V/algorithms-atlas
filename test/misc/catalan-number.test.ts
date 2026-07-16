import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalanNumber, catalanSequence } from '../../src/algorithms/misc/catalan-number/impl.ts';

test('catalanNumber 前 10 项', () => {
  const expected = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862];
  for (let i = 0; i < expected.length; i++) {
    assert.equal(catalanNumber(i), expected[i], `C(${i})`);
  }
});

test('catalanNumber C(0)=1', () => {
  assert.equal(catalanNumber(0), 1);
});

test('catalanNumber 全程整数（无小数）', () => {
  for (let n = 0; n <= 20; n++) {
    const v = catalanNumber(n);
    assert.equal(Number.isInteger(v), true, `C(${n})=${v}`);
  }
});

test('catalanNumber 与组合数公式一致', () => {
  // C(n) = C(2n,n)/(n+1)
  const binom = (nn: number, kk: number): number => {
    kk = Math.min(kk, nn - kk);
    let r = 1;
    for (let i = 0; i < kk; i++) r = (r * (nn - i)) / (i + 1);
    return Math.round(r);
  };
  for (let n = 0; n <= 15; n++) {
    assert.equal(catalanNumber(n), Math.round(binom(2 * n, n) / (n + 1)), `C(${n})`);
  }
});

test('catalanSequence', () => {
  assert.deepEqual(catalanSequence(6), [1, 1, 2, 5, 14, 42]);
  assert.deepEqual(catalanSequence(0), []);
});

test('catalanNumber 非法输入抛错', () => {
  assert.throws(() => catalanNumber(-1));
  assert.throws(() => catalanNumber(1.5));
});
