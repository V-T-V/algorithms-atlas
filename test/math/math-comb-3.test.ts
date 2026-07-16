import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Combinatorics } from '../../src/algorithms/math/math-comb-3/impl.ts';

test('comb C(5,2)', () => {
  const c = new Combinatorics(10);
  assert.equal(c.choose(5, 2), 10n);
  assert.equal(c.choose(6, 3), 20n);
});

test('comb 边界', () => {
  const c = new Combinatorics(10);
  assert.equal(c.choose(5, 0), 1n);
  assert.equal(c.choose(5, 5), 1n);
  assert.equal(c.choose(5, 6), 0n);
});
