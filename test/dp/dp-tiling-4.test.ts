import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominoTiling } from '../../src/algorithms/dp/dp-tiling-4/impl.ts';

test('tiling 斐波那契', () => {
  assert.equal(dominoTiling(0), 1);
  assert.equal(dominoTiling(1), 1);
  assert.equal(dominoTiling(2), 2);
  assert.equal(dominoTiling(6), 13);
});
