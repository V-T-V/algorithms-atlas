import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gostEncrypt } from '../../src/algorithms/crypto/crypto-gost/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-gost/trace.ts';

test('gost 输出 4 字节', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const ct = gostEncrypt(key, [0x12, 0x34, 0x56, 0x78]);
  assert.equal(ct.length, 4);
});
test('gost 确定性', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  assert.deepEqual(gostEncrypt(key, [1, 2, 3, 4]), gostEncrypt(key, [1, 2, 3, 4]));
});
test('gost trace 非空', () => assert.ok(buildTrace().length > 0));
