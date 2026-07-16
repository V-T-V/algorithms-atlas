import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shacal1Encrypt } from '../../src/algorithms/crypto/crypto-shacal/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-shacal/trace.ts';

test('shacal 输出 20 字节', () => {
  const key = Array.from({ length: 64 }, (_, i) => i + 1);
  const block = Array.from({ length: 20 }, (_, i) => i + 1);
  const ct = shacal1Encrypt(key, block);
  assert.equal(ct.length, 20);
});
test('shacal 确定性', () => {
  const key = Array.from({ length: 64 }, (_, i) => i + 1);
  const block = Array.from({ length: 20 }, (_, i) => i + 1);
  assert.deepEqual(shacal1Encrypt(key, block), shacal1Encrypt(key, block));
});
test('shacal trace 非空', () => assert.ok(buildTrace().length > 0));
