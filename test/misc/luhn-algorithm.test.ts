import { test } from 'node:test';
import assert from 'node:assert/strict';
import { luhnCheck, parseDigits } from '../../src/algorithms/misc/luhn-algorithm/impl.ts';

test('luhn-algorithm 有效卡号 4532015112830366', () => {
  assert.equal(luhnCheck([4, 5, 3, 2, 0, 1, 5, 1, 1, 2, 8, 3, 0, 3, 6, 6]), true);
});

test('luhn-algorithm 无效卡号 1234567890123456', () => {
  assert.equal(luhnCheck([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]), false);
});

test('luhn-algorithm 接受字符串输入', () => {
  assert.equal(luhnCheck('4532015112830366'), true);
  assert.equal(luhnCheck('4532 0151 1283 0366'), true);
  assert.equal(luhnCheck('1234567890123456'), false);
});

test('luhn-algorithm 经典样例 79927398713 有效', () => {
  assert.equal(luhnCheck('79927398713'), true);
});

test('luhn-algorithm 改一位即失效', () => {
  // 79927398713 有效，把末位 3 改成 0 → 无效
  assert.equal(luhnCheck('79927398710'), false);
});

test('luhn-algorithm American Express 测试号 378282246310005 有效', () => {
  assert.equal(luhnCheck('378282246310005'), true);
});

test('luhn-algorithm 空输入无效', () => {
  assert.equal(luhnCheck([]), false);
  assert.equal(luhnCheck(''), false);
});

test('luhn-algorithm parseDigits 处理空格与连字符', () => {
  assert.deepEqual(parseDigits('4532-0151 1283'), [4, 5, 3, 2, 0, 1, 5, 1, 1, 2, 8, 3]);
  assert.equal(parseDigits('12a3'), null);
});

test('luhn-algorithm 钩子被调用', () => {
  let sumCalled = false;
  let result = null;
  luhnCheck([7, 9, 9, 2, 7, 3, 9, 8, 7, 1, 3], {
    onSum: () => {
      sumCalled = true;
    },
    onResult: (v) => {
      result = v;
    },
  });
  assert.equal(sumCalled, true);
  assert.equal(result, true);
});

test('luhn-algorithm 加倍逻辑正确', () => {
  const processed: Array<[number, number, boolean]> = [];
  luhnCheck([7, 9, 9, 2, 7, 3, 9, 8, 7, 1, 3], {
    onDigit: (i, digit, eff, doubled) => processed.push([digit, eff, doubled]),
  });
  // 从右数：第 1 位（末位 index 10）不翻倍；第 2 位(index 9)翻倍...
  // index 9: digit 1, doubled, eff 2
  assert.deepEqual(processed[9], [1, 2, true]);
  // index 8: digit 7, not doubled, eff 7
  assert.deepEqual(processed[8], [7, 7, false]);
});
