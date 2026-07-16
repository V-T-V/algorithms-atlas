import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marsEncrypt } from '../../src/algorithms/crypto/crypto-mars/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-mars/trace.ts';

test('mars 输出 16 字节', () => {
  const ct = marsEncrypt(
    [1, 2, 3, 4],
    Array.from({ length: 16 }, (_, i) => i + 1),
  );
  assert.equal(ct.length, 16);
});
test('mars 确定性', () => {
  assert.deepEqual(
    marsEncrypt(
      [1, 2, 3, 4],
      Array.from({ length: 16 }, (_, i) => i + 1),
    ),
    marsEncrypt(
      [1, 2, 3, 4],
      Array.from({ length: 16 }, (_, i) => i + 1),
    ),
  );
});
test('mars trace 非空', () => assert.ok(buildTrace().length > 0));
