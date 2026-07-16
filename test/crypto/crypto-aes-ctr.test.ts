import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctrCrypt } from '../../src/algorithms/crypto/crypto-aes-ctr/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-aes-ctr/trace.ts';

test('ctr 加密解密互逆', () => {
  const key = Array.from({ length: 16 }, () => 7);
  const nonce = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  const pt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const ct = ctrCrypt(key, nonce, pt);
  const dec = ctrCrypt(key, nonce, ct);
  assert.deepEqual(dec, pt);
});
test('ctr trace 非空', () => assert.ok(buildTrace().length > 0));
