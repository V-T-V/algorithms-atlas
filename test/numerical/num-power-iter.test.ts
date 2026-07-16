import { test } from 'node:test';
import assert from 'node:assert/strict';
import { powerIter } from '../../src/algorithms/numerical/num-power-iter/impl.ts';
test('2^10=1024', () => {
  assert.equal(powerIter(2, 10), 1024);
});
test('x^0=1', () => {
  assert.equal(powerIter(5, 0), 1);
});
