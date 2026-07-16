import { test } from 'node:test';
import assert from 'node:assert/strict';
import { md4 } from '../../src/algorithms/crypto/crypto-md4/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-md4/trace.ts';

test('md4("abc") 已知值', () => {
  // RFC 1320 测试向量: MD4("abc") = a448017aaf21d8525fc10ae87aa6729d
  const h = md4([97, 98, 99])
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  assert.equal(h, 'a448017aaf21d8525fc10ae87aa6729d');
});
test('md4 空串已知值', () => {
  // MD4("") = 31d6cfe0d16ae931b73c59d7e0c089c0
  const h = md4([])
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  assert.equal(h, '31d6cfe0d16ae931b73c59d7e0c089c0');
});
test('md4 trace 非空', () => assert.ok(buildTrace().length > 0));
