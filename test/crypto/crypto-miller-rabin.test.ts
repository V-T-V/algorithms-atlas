import { test } from 'node:test';
import assert from 'node:assert/strict';
import { millerRabin } from '../../src/algorithms/crypto/crypto-miller-rabin/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-miller-rabin/trace.ts';
test('mr 素数判定', () => {
  assert.equal(millerRabin(97, [2, 3]), true);
  assert.equal(millerRabin(221, [2, 3, 5]), false);
});
test('mr trace 非空', () => assert.ok(buildTrace().length > 0));
