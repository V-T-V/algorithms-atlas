import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo13 } from '../../src/algorithms/misc/extra-algo-13/impl.ts';

test('extra-algo-13 basic', () => {
  assert.equal(extraalgo13([1, 2, 3]), 6);
});
