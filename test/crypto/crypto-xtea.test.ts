import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  xteaEncryptBlock,
  xteaDecryptBlock,
} from '../../src/algorithms/crypto/crypto-xtea/impl.ts';

test('crypto-xtea 加解密往返', () => {
  const block = { v0: 0xdeadbeef, v1: 0xcafebabe };
  const key = [0x1a2b3c4d, 0x5e6f7081, 0x9293a4b5, 0xc6d7e8f9] as const;
  const enc = xteaEncryptBlock(block, key);
  const dec = xteaDecryptBlock(enc, key);
  assert.equal(dec.v0 >>> 0, block.v0 >>> 0);
  assert.equal(dec.v1 >>> 0, block.v1 >>> 0);
});

test('crypto-xtea 加密改变明文', () => {
  const key = [0, 0, 0, 0] as const;
  const a = xteaEncryptBlock({ v0: 0, v1: 0 }, key);
  const b = xteaEncryptBlock({ v0: 1, v1: 0 }, key);
  assert.notEqual(a.v0, b.v0);
});

test('crypto-xtea 不同密钥不同密文', () => {
  const block = { v0: 1, v1: 2 };
  const a = xteaEncryptBlock(block, [1, 2, 3, 4]);
  const b = xteaEncryptBlock(block, [5, 6, 7, 8]);
  assert.notEqual(a.v0, b.v0);
});
