import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numWaysPaintFence } from '../../src/algorithms/dp/dp-paint-fence-2/impl.ts';

test('paint-fence LC276 例1', () => {
  assert.equal(numWaysPaintFence(3, 2), 6);
});

test('paint-fence LC276 例2', () => {
  assert.equal(numWaysPaintFence(1, 1), 1);
});

test('paint-fence n=2', () => {
  assert.equal(numWaysPaintFence(2, 3), 9);
});

test('paint-fence n=0', () => {
  assert.equal(numWaysPaintFence(0, 3), 0);
});
