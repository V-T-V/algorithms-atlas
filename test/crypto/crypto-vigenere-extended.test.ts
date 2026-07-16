import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  vigenereExtendedEncrypt,
  vigenereExtendedDecrypt,
} from '../../src/algorithms/crypto/crypto-vigenere-extended/impl.ts';

test('crypto-vigenere-extended 加解密往返', () => {
  const s = 'ATTACK AT 1200';
  const key = 'LEMON';
  assert.equal(vigenereExtendedDecrypt(vigenereExtendedEncrypt(s, key), key), s);
});

test('crypto-vigenere-extended 含数字', () => {
  // 0(26) + A(0) = 26 mod 36 = '0'
  assert.equal(vigenereExtendedEncrypt('0', 'A'), '0');
  // 0(26) + B(1) = 27 -> '1'
  assert.equal(vigenereExtendedEncrypt('0', 'B'), '1');
});

test('crypto-vigenere-extended 非法字符保留', () => {
  // A+K=K，空格保留不推进密钥，B+K=L，! 保留
  assert.equal(vigenereExtendedEncrypt('A B!', 'K'), 'K L!');
});

test('crypto-vigenere-extended 空密钥抛错', () => {
  assert.throws(() => vigenereExtendedEncrypt('A', ''));
});
