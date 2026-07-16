import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modPow } from '../../src/algorithms/numerical/num-modular-exp/impl.ts';
test('2^10 mod 1000 = 24', () => {
  assert.equal(modPow(2, 10, 1000), 24);
});
test('3^0 mod 7 = 1', () => {
  assert.equal(modPow(3, 0, 7), 1);
});
