import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teaEncrypt, teaDecrypt } from '../../src/algorithms/crypto/crypto-tea-full/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-tea-full/trace.ts';

test('tea 往返一致', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef];
  const ct = teaEncrypt(key, block);
  assert.deepEqual(teaDecrypt(key, ct), block);
});
test('tea 确定性', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [1, 2, 3, 4, 5, 6, 7, 8];
  assert.deepEqual(teaEncrypt(key, block), teaEncrypt(key, block));
});
test('tea trace 非空', () => assert.ok(buildTrace().length > 0));
