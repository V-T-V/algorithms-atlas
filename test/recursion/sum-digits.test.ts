import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sumDigits } from '../../src/algorithms/recursion/sum-digits/impl.ts';

test('sumDigits 基本', () => {
  assert.equal(sumDigits(0), 0);
  assert.equal(sumDigits(5), 5);
  assert.equal(sumDigits(12), 3);
  assert.equal(sumDigits(12345), 15);
  assert.equal(sumDigits(99999), 45);
});

test('sumDigits 大数', () => {
  assert.equal(sumDigits(123456789), 45);
  assert.equal(sumDigits(1000000), 1);
});

test('sumDigits 非法输入抛错', () => {
  assert.throws(() => sumDigits(-1));
  assert.throws(() => sumDigits(1.5));
});
