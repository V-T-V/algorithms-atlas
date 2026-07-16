import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intToRoman, romanToInt } from '../../src/algorithms/misc/roman-numerals/impl.ts';

test('roman-numerals intToRoman 基本样例', () => {
  assert.equal(intToRoman(1994), 'MCMXCIV');
  assert.equal(intToRoman(58), 'LVIII');
  assert.equal(intToRoman(3), 'III');
  assert.equal(intToRoman(4), 'IV');
  assert.equal(intToRoman(9), 'IX');
  assert.equal(intToRoman(3999), 'MMMCMXCIX');
});

test('roman-numerals romanToInt 基本样例', () => {
  assert.equal(romanToInt('MCMXCIV'), 1994);
  assert.equal(romanToInt('LVIII'), 58);
  assert.equal(romanToInt('III'), 3);
  assert.equal(romanToInt('IV'), 4);
  assert.equal(romanToInt('IX'), 9);
  assert.equal(romanToInt('MMMCMXCIX'), 3999);
});

test('roman-numerals 往返一致（1..3999）', () => {
  for (let n = 1; n <= 3999; n++) {
    const s = intToRoman(n);
    assert.equal(romanToInt(s), n, `n=${n}`);
  }
});

test('roman-numerals 小写输入也可被解析', () => {
  assert.equal(romanToInt('mcmxciv'), 1994);
});

test('roman-numerals 边界值', () => {
  assert.equal(intToRoman(1), 'I');
  assert.equal(intToRoman(3999), 'MMMCMXCIX');
});

test('roman-numerals 越界/非法抛错', () => {
  assert.throws(() => intToRoman(0));
  assert.throws(() => intToRoman(4000));
  assert.throws(() => intToRoman(3.5));
  assert.throws(() => romanToInt('ABC'));
  assert.throws(() => romanToInt(''));
});

test('roman-numerals 钩子被调用（intToRoman）', () => {
  const pairs: Array<[number, string]> = [];
  intToRoman(1994, {
    onSymbol: (v, s) => pairs.push([v, s]),
  });
  // 1994 = M + CM + XC + IV
  assert.deepEqual(pairs, [
    [1000, 'M'],
    [900, 'CM'],
    [90, 'XC'],
    [4, 'IV'],
  ]);
});

test('roman-numerals 钩子被调用（romanToInt，减法判定）', () => {
  const events: Array<[number, string]> = [];
  romanToInt('IV', {
    onSymbol: (v, s) => events.push([v, s]),
  });
  // I 因小于后继 V 被减为 -1，V 加为 5
  assert.deepEqual(events, [
    [-1, 'I'],
    [5, 'V'],
  ]);
});
