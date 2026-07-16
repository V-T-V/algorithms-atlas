import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  keywordEncrypt,
  keywordDecrypt,
  buildKeywordTable,
} from '../../src/algorithms/crypto/crypto-keyword-cipher/impl.ts';

test('crypto-keyword-cipher 替换表构造', () => {
  // ZEBRA 去重 + C D F G H I J K L M N O P Q S T U V W X Y
  const t = buildKeywordTable('ZEBRA');
  assert.equal(t.length, 26);
  assert.equal(t[0], 'Z');
  assert.equal(t.join(''), 'ZEBRACDFGHIJKLMNOPQSTUVWXY');
});

test('crypto-keyword-cipher 加解密往返', () => {
  const s = 'Hello World!';
  const kw = 'Secret';
  assert.equal(keywordDecrypt(keywordEncrypt(s, kw), kw), s);
});

test('crypto-keyword-cipher 非字母保留', () => {
  assert.equal(keywordEncrypt('A1!', 'K'), 'K1!');
});
