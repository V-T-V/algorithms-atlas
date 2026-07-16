import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ripemd160 } from '../../src/algorithms/crypto/crypto-ripemd160/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ripemd160/trace.ts';

test('ripemd160("abc") 已知值', () => {
  // RIPEMD-160("abc") = 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
  const h = ripemd160([97, 98, 99])
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  assert.equal(h, '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc');
});
test('ripemd160("") 已知值', () => {
  // RIPEMD-160("") = 9c1185a5c5e9fc54612808977ee8f548b2258d31
  const h = ripemd160([])
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  assert.equal(h, '9c1185a5c5e9fc54612808977ee8f548b2258d31');
});
test('ripemd160 trace 非空', () => assert.ok(buildTrace().length > 0));
