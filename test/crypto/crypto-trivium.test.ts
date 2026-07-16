import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trivium } from '../../src/algorithms/crypto/crypto-trivium/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-trivium/trace.ts';
test('trivium 输出位数', () =>
  assert.equal(
    trivium([0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 16).length,
    16,
  ));
test('trivium bit 为 0/1', () => {
  for (const b of trivium([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 5))
    assert.ok(b === 0 || b === 1);
});
test('trivium trace 非空', () => assert.ok(buildTrace().length > 0));
