import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blowfishEncryptBlock } from '../../src/algorithms/crypto/crypto-blowfish-full/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-blowfish-full/trace.ts';

test('blowfish full 输出 8 字节', () => {
  const key = [0x01, 0x23, 0x45, 0x67, 0x89];
  const block = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef];
  const ct = blowfishEncryptBlock(key, block);
  assert.equal(ct.length, 8);
});
test('blowfish full 确定性', () => {
  const key = [0xaa, 0xbb];
  const block = [1, 2, 3, 4, 5, 6, 7, 8];
  assert.deepEqual(blowfishEncryptBlock(key, block), blowfishEncryptBlock(key, block));
});
test('blowfish full trace 非空', () => assert.ok(buildTrace().length > 0));
