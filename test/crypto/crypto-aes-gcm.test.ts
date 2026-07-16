import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gcmEncrypt } from '../../src/algorithms/crypto/crypto-aes-gcm/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-aes-gcm/trace.ts';

test('gcm 密文长度 = 明文长度', () => {
  const key = Array.from({ length: 16 }, (_, i) => i);
  const iv = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const pt = Array.from({ length: 40 }, (_, i) => i);
  const { ciphertext, tag } = gcmEncrypt(key, iv, pt);
  assert.equal(ciphertext.length, pt.length);
  assert.equal(tag.length, 16);
});
test('gcm 同输入同输出（确定性）', () => {
  const key = Array.from({ length: 16 }, () => 0);
  const iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const pt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const a = gcmEncrypt(key, iv, pt);
  const b = gcmEncrypt(key, iv, pt);
  assert.deepEqual(a.ciphertext, b.ciphertext);
  assert.deepEqual(a.tag, b.tag);
});
test('gcm trace 非空', () => assert.ok(buildTrace().length > 0));
