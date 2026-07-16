import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stirling2 } from '../../src/algorithms/math/math-stirling-3/impl.ts';

test('stirling S(4,2)=7', () => {
  assert.equal(stirling2(4, 2), 7n);
});

test('stirling S(5,3)=25', () => {
  assert.equal(stirling2(5, 3), 25n);
});

test('stirling S(n,1)=1', () => {
  assert.equal(stirling2(6, 1), 1n);
});

test('stirling S(n,n)=1', () => {
  assert.equal(stirling2(6, 6), 1n);
});
