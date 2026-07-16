import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo15 } from '../../src/algorithms/misc/extra-algo-15/impl.ts';

test('extra-algo-15 basic', () => {
  assert.equal(extraalgo15([1, 2, 3]), 6);
});
