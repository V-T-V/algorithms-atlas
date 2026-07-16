import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ofbCrypt } from '../../src/algorithms/crypto/crypto-aes-ofb-2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-aes-ofb-2/trace.ts';

test('ofb 加密解密互逆', () => {
  const key = Array.from({ length: 16 }, () => 3);
  const iv = Array.from({ length: 16 }, (_, i) => i);
  const pt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const ct = ofbCrypt(key, iv, pt);
  assert.deepEqual(ofbCrypt(key, iv, ct), pt);
});
test('ofb trace 非空', () => assert.ok(buildTrace().length > 0));
