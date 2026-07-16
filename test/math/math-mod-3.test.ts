import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow } from '../../src/algorithms/math/math-mod-3/impl.ts';

test('mod-pow 基本例', () => {
  assert.equal(modPow(2n, 10n, 1000n), 24n);
});

test('mod-pow 大指数', () => {
  assert.equal(modPow(3n, 1000n, 1_000_000_007n), 664565495n);
});

test('mod-pow 模 1', () => {
  assert.equal(modPow(7n, 100n, 1n), 0n);
});
