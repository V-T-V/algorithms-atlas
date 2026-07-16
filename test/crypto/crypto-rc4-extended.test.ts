import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc4Process } from '../../src/algorithms/crypto/crypto-rc4-extended/impl.ts';

test('crypto-rc4-extended 加解密往返', () => {
  const data = new TextEncoder().encode('Confidential');
  const key = new TextEncoder().encode('secret');
  const cipher = rc4Process(data, key);
  const plain = rc4Process(cipher, key);
  assert.deepEqual(Array.from(plain), Array.from(data));
});

test('crypto-rc4-extended RFC 6229 测试向量 (key=Key)', () => {
  // 经典 RFC 6229：key="Key"，前 5 字节密钥流 -> [0xEB,0x9F,0x77,0x81,0xB7]
  const stream = rc4Process(new Uint8Array(5), new TextEncoder().encode('Key'));
  // 空明文异或 0 时实际需要全 0；我们用全 0 明文得到的就是密钥流
  assert.deepEqual(Array.from(stream), [0xeb, 0x9f, 0x77, 0x81, 0xb7]);
});

test('crypto-rc4-extended 相同密钥确定性', () => {
  const data = new TextEncoder().encode('abc');
  const key = new TextEncoder().encode('k');
  const a = rc4Process(data, key);
  const b = rc4Process(data, key);
  assert.deepEqual(Array.from(a), Array.from(b));
});
