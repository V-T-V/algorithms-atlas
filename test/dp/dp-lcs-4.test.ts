import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lengthOfLCS } from '../../src/algorithms/dp/dp-lcs-4/impl.ts';

test('lcs 经典', () => {
  assert.equal(lengthOfLCS('ABCBDAB'.split(''), 'BDCABA'.split('')), 4);
});
test('lcs 全不同', () => {
  assert.equal(lengthOfLCS('ABC'.split(''), 'DEF'.split('')), 0);
});
test('lcs 空', () => {
  assert.equal(lengthOfLCS([], 'AB'.split('')), 0);
});
