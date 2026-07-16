import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twofishEncrypt } from '../../src/algorithms/crypto/crypto-twofish/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-twofish/trace.ts';

test('twofish 输出 16 字节', () => {
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = Array.from({ length: 16 }, (_, i) => i + 1);
  const ct = twofishEncrypt(key, block);
  assert.equal(ct.length, 16);
});
test('twofish 确定性', () => {
  const key = [1, 2];
  const block = Array.from({ length: 16 }, (_, i) => i);
  assert.deepEqual(twofishEncrypt(key, block), twofishEncrypt(key, block));
});
test('twofish trace 非空', () => assert.ok(buildTrace().length > 0));
