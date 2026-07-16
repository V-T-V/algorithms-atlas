import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fractionationEncrypt } from '../../src/algorithms/crypto/crypto-fractionation/impl.ts';

test('crypto-fractionation 单字母 E', () => {
  // E -> '.'，补 '.' => '..' => '1'
  assert.equal(fractionationEncrypt('E'), '1');
});

test('crypto-fractionation 单字母 T', () => {
  // T -> '-'，补 '.' => '-.' => '4'
  assert.equal(fractionationEncrypt('T'), '4');
});

test('crypto-fractionation 多字母输出为数字', () => {
  const out = fractionationEncrypt('HI');
  // H='....' I='..' => morse '../../....'？实际 H + '/' + I = '....' + '/' + '..' = '../../../..'
  // 补 '.' 后长度 8：'../../../...'
  // 两两配对：'..'(1) '..'(1) '/.'(7) '..'(1) => 1171
  assert.equal(out, '1171');
  assert.match(out, /^[1-9]+$/);
});
