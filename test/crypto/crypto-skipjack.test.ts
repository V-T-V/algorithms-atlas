import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skipjackEncrypt } from '../../src/algorithms/crypto/crypto-skipjack/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-skipjack/trace.ts';

test('skipjack 输出 8 字节', () => {
  const key = Array.from({ length: 10 }, (_, i) => i + 1);
  const ct = skipjackEncrypt(key, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ct.length, 8);
});
test('skipjack 确定性', () => {
  const key = Array.from({ length: 10 }, (_, i) => i + 1);
  assert.deepEqual(
    skipjackEncrypt(key, [1, 2, 3, 4, 5, 6, 7, 8]),
    skipjackEncrypt(key, [1, 2, 3, 4, 5, 6, 7, 8]),
  );
});
test('skipjack trace 非空', () => assert.ok(buildTrace().length > 0));
