import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robberCircular } from '../../src/algorithms/dp/dp-robber-6/impl.ts';

test('rob 环形', () => {
  assert.equal(robberCircular([2, 3, 2]), 3);
});
test('rob 环形2', () => {
  assert.equal(robberCircular([1, 2, 3, 1]), 4);
});
test('rob 单家', () => {
  assert.equal(robberCircular([5]), 5);
});
test('rob 空', () => {
  assert.equal(robberCircular([]), 0);
});
