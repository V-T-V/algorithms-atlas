import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo19 } from '../../src/algorithms/misc/extra-algo-19/impl.ts';

test('extra-algo-19 basic', () => {
  assert.equal(extraalgo19([1, 2, 3]), 6);
});
