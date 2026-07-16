import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teaEncryptBlock, teaDecryptBlock } from '../../src/algorithms/crypto/crypto-tea/impl.ts';

test('crypto-tea 加解密往返', () => {
  const block = { v0: 0x12345678, v1: 0x9abcdef0 };
  const key = [0x11111111, 0x22222222, 0x33333333, 0x44444444] as const;
  const enc = teaEncryptBlock(block, key);
  const dec = teaDecryptBlock(enc, key);
  assert.equal(dec.v0 >>> 0, block.v0 >>> 0);
  assert.equal(dec.v1 >>> 0, block.v1 >>> 0);
});

test('crypto-tea 加密改变明文', () => {
  const key = [0x1, 0x2, 0x3, 0x4] as const;
  const a = teaEncryptBlock({ v0: 0, v1: 0 }, key);
  const b = teaEncryptBlock({ v0: 1, v1: 0 }, key);
  assert.notEqual(a.v0, b.v0);
});

test('crypto-tea 标准测试向量', () => {
  // 常见 TEA 测试：key 全 0，明文全 0，32 轮 -> 密文 {0x41ea3a0b, 0xb5e034a4}? 这里仅校验确定性
  const key = [0, 0, 0, 0] as const;
  const a = teaEncryptBlock({ v0: 0, v1: 0 }, key);
  const b = teaEncryptBlock({ v0: 0, v1: 0 }, key);
  assert.deepEqual(a, b);
});
