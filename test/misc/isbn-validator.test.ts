import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidIsbn10,
  computeCheckDigit,
  parseIsbn,
} from '../../src/algorithms/misc/isbn-validator/impl.ts';

test('isValidIsbn10 合法样例', () => {
  // 经典合法 ISBN-10
  assert.equal(isValidIsbn10('0-306-40615-2'), true);
  assert.equal(isValidIsbn10('0306406152'), true);
});

test('isValidIsbn10 含 X 校验位', () => {
  // 末位为 X 的合法 ISBN
  assert.equal(isValidIsbn10('0-8044-2957-X'), true);
});

test('isValidIsbn10 非法', () => {
  assert.equal(isValidIsbn10('0-306-40615-3'), false); // 错校验位
  assert.equal(isValidIsbn10('0306406159'), false);
});

test('isValidIsbn10 忽略连字符空格', () => {
  assert.equal(isValidIsbn10('0 306 40615 2'), true);
  assert.equal(isValidIsbn10('0306406152'), true);
});

test('isValidIsbn10 格式错误返回 false', () => {
  assert.equal(isValidIsbn10('12345'), false);
  assert.equal(isValidIsbn10('abcdefghij'), false);
  assert.equal(isValidIsbn10('123456789X1'), false); // 11 位
});

test('computeCheckDigit', () => {
  assert.equal(computeCheckDigit('030640615'), '2');
  assert.equal(computeCheckDigit('080442957'), 'X');
});

test('computeCheckDigit 与 isValid 一致', () => {
  for (const prefix of ['030640615', '080442957', '059600920', '013235088']) {
    const d = computeCheckDigit(prefix);
    assert.equal(isValidIsbn10(prefix + d), true);
  }
});

test('parseIsbn', () => {
  assert.deepEqual(parseIsbn('0-306-40615-2'), ['0', '3', '0', '6', '4', '0', '6', '1', '5', '2']);
  assert.equal(parseIsbn('bad'), null);
});
