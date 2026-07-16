import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ideaEncrypt } from '../../src/algorithms/crypto/crypto-idea/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-idea/trace.ts';

test('idea 输出 8 字节', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const ct = ideaEncrypt(key, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ct.length, 8);
});
test('idea 确定性', () => {
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  assert.deepEqual(
    ideaEncrypt(key, [1, 2, 3, 4, 5, 6, 7, 8]),
    ideaEncrypt(key, [1, 2, 3, 4, 5, 6, 7, 8]),
  );
});
test('idea trace 非空', () => assert.ok(buildTrace().length > 0));
