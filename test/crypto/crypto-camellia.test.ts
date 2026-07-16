import { test } from 'node:test';
import assert from 'node:assert/strict';
import { camelliaEncrypt } from '../../src/algorithms/crypto/crypto-camellia/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-camellia/trace.ts';

test('camellia 输出 8 字节', () => {
  const ct = camelliaEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ct.length, 8);
});
test('camellia 确定性', () => {
  assert.deepEqual(
    camelliaEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
    camelliaEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
  );
});
test('camellia trace 非空', () => assert.ok(buildTrace().length > 0));
