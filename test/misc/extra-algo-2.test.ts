import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo2 } from '../../src/algorithms/misc/extra-algo-2/impl.ts';

test('extra-algo-2 basic', () => {
  assert.equal(extraalgo2([1, 2, 3]), 6);
});
