import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numTilings } from '../../src/algorithms/dp/dp-tiling-3/impl.ts';

test('tiling LC790 n=3', () => {
  assert.equal(numTilings(3), 5);
});

test('tiling LC790 n=1', () => {
  assert.equal(numTilings(1), 1);
});

test('tiling LC790 n=4', () => {
  assert.equal(numTilings(4), 11);
});

test('tiling LC790 n=0', () => {
  assert.equal(numTilings(0), 1);
});
