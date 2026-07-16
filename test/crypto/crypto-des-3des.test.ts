import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  desEncrypt,
  desDecrypt,
  tripleDesEncrypt,
  tripleDesDecrypt,
} from '../../src/algorithms/crypto/crypto-des-3des/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-des-3des/trace.ts';

test('des 单分组往返', () => {
  const key = [0x12, 0x34];
  const block = [0x41, 0x42, 0x43, 0x44];
  const ct = desEncrypt(key, block);
  assert.deepEqual(desDecrypt(key, ct), block);
});
test('3des 往返', () => {
  const k1 = [0xab, 0xcd];
  const k2 = [0x12, 0x34];
  const block = [0x01, 0x02, 0x03, 0x04];
  const ct = tripleDesEncrypt(k1, k2, block);
  assert.deepEqual(tripleDesDecrypt(k1, k2, ct), block);
});
test('des trace 非空', () => assert.ok(buildTrace().length > 0));
