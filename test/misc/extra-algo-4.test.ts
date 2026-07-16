import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo4 } from '../../src/algorithms/misc/extra-algo-4/impl.ts';

test('extra-algo-4 basic', () => {
  assert.equal(extraalgo4([1, 2, 3]), 6);
});
