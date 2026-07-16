import { test } from 'node:test';
import assert from 'node:assert/strict';
import { range } from '../../src/algorithms/numerical/num-range/impl.ts';
test('极差', () => {
  assert.equal(range([3, 1, 4, 1, 5]), 4);
});
