import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo20 } from '../../src/algorithms/misc/extra-algo-20/impl.ts';

test('extra-algo-20 basic', () => {
  assert.equal(extraalgo20([1, 2, 3]), 6);
});
