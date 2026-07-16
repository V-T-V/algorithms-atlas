import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btNumberOfPatterns } from '../../src/algorithms/backtracking/bt-number-of-patterns/impl.ts';

test('bt-number-of-patterns m=1,n=1', () => {
  assert.equal(btNumberOfPatterns(1, 1), 9);
});

test('bt-number-of-patterns m=1,n=2', () => {
  assert.equal(btNumberOfPatterns(1, 2), 9 + 56);
});

test('bt-number-of-patterns 单调', () => {
  assert.ok(btNumberOfPatterns(1, 9) >= btNumberOfPatterns(1, 2));
});

test('bt-number-of-patterns 已知值 m=1,n=9 = 389497', () => {
  assert.equal(btNumberOfPatterns(1, 9), 389497);
});
