import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotN } from '../../src/algorithms/crypto/crypto-rot-n/impl.ts';

test('crypto-rot-n ROT13 自反', () => {
  const s = 'Hello, World!';
  assert.equal(rotN(rotN(s, 13), 13), s);
});

test('crypto-rot-n ROT13 标准示例', () => {
  assert.equal(rotN('Hello', 13), 'Uryyb');
});

test('crypto-rot-n ROT5 非字母保留', () => {
  assert.equal(rotN('Ab1!', 5), 'Fg1!');
});
