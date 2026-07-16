import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  convertBase,
  parseToDecimal,
  generateFromDecimal,
  charToValue,
} from '../../src/algorithms/misc/base-conversion/impl.ts';

test('base-conversion 255 base10 → FF base16', () => {
  assert.equal(convertBase('255', 10, 16), 'FF');
});

test('base-conversion 1010 base2 → A base16', () => {
  assert.equal(convertBase('1010', 2, 16), 'A');
});

test('base-conversion FF base16 → 255 base10', () => {
  assert.equal(convertBase('FF', 16, 10), '255');
});

test('base-conversion 往返一致（多种进制）', () => {
  for (const [s, b] of [
    ['255', 10],
    ['1010', 2],
    ['DEADBEEF', 16],
    ['Z', 36],
    ['10010110', 2],
  ] as const) {
    const decimal = parseToDecimal(s, b);
    assert.equal(generateFromDecimal(decimal, b), s, `s=${s},b=${b}`);
  }
});

test('base-conversion 36 进制边界', () => {
  assert.equal(parseToDecimal('10', 36), 36);
  assert.equal(parseToDecimal('Z', 36), 35);
  assert.equal(generateFromDecimal(35, 36), 'Z');
});

test('base-conversion 0 的处理', () => {
  assert.equal(convertBase('0', 10, 2), '0');
  assert.equal(convertBase('0', 2, 16), '0');
});

test('base-conversion 小写输入兼容', () => {
  assert.equal(convertBase('ff', 16, 10), '255');
});

test('base-conversion 非法字符抛错', () => {
  assert.throws(() => convertBase('12', 2, 10)); // '2' 非二进制
  assert.throws(() => convertBase('GG', 16, 10)); // 'G' 非十六进制
  assert.throws(() => convertBase('', 10, 2));
});

test('base-conversion 进制越界抛错', () => {
  assert.throws(() => convertBase('10', 1, 10));
  assert.throws(() => convertBase('10', 37, 10));
  assert.throws(() => convertBase('10', 10, 0));
});

test('base-conversion charToValue', () => {
  assert.equal(charToValue('0'), 0);
  assert.equal(charToValue('9'), 9);
  assert.equal(charToValue('A'), 10);
  assert.equal(charToValue('Z'), 35);
  assert.equal(charToValue('a'), 10); // 小写
  assert.equal(charToValue('!'), -1);
});

test('base-conversion 钩子被调用', () => {
  const parseDigits: number[] = [];
  const genChars: string[] = [];
  convertBase('255', 10, 16, {
    onParse: (_i, _ch, value, _decimal) => {
      parseDigits.push(value);
    },
    onGenerate: (_step, _rem, ch, _quotient) => {
      genChars.push(ch);
    },
  });
  assert.deepEqual(parseDigits, [2, 5, 5]);
  assert.deepEqual(genChars, ['F', 'F']);
});
