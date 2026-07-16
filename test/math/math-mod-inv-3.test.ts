import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modInverse } from '../../src/algorithms/math/math-mod-inv-3/impl.ts';

test('mod-inv 3 mod 11', () => {
  const inv = modInverse(3, 11);
  assert.equal(inv, 4n);
  assert.equal((3n * inv!) % 11n, 1n);
});

test('mod-inv 大素数', () => {
  const inv = modInverse(7n, 1_000_000_007n);
  assert.ok(inv !== null);
  assert.equal((7n * inv!) % 1_000_000_007n, 1n);
});

test('mod-inv a=0 无逆元', () => {
  assert.equal(modInverse(0, 7), null);
});
