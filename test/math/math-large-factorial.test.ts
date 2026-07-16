import { test } from 'node:test';
import assert from 'node:assert/strict';
import { largeFactorial } from '../../src/algorithms/math/math-large-factorial/impl.ts';

test('10! = 3628800', () => {
  assert.equal(largeFactorial(10), 3628800n);
});

test('0! = 1', () => {
  assert.equal(largeFactorial(0), 1n);
});

test('20! 精确值', () => {
  assert.equal(largeFactorial(20), 2432902008176640000n);
});

test('25! 末尾应有 6 个零', () => {
  const s = largeFactorial(25).toString();
  assert.equal(s.length - s.search(/0+$/), 6);
});

test('50! 大数无溢出', () => {
  const v = largeFactorial(50);
  assert.ok(v > 0n);
  assert.equal(v.toString().length, 65); // 50! 有 65 位
});
