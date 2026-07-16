import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primitiveRoot } from '../../src/algorithms/math/math-prim-root-3/impl.ts';

test('prim-root mod 7', () => {
  assert.equal(primitiveRoot(7), 3n);
});

test('prim-root mod 11', () => {
  assert.equal(primitiveRoot(11), 2n);
});

test('prim-root mod 2', () => {
  assert.equal(primitiveRoot(2), 1n);
});
