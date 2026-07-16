import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gcd, lcm } from '../../src/algorithms/numerical/num-gcd-euclid/impl.ts';
test('gcd(48,18)=6', () => {
  assert.equal(gcd(48, 18), 6);
});
test('gcd(7,13)=1', () => {
  assert.equal(gcd(7, 13), 1);
});
test('lcm(4,6)=12', () => {
  assert.equal(lcm(4, 6), 12);
});
