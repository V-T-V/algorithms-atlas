import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo1 } from '../../src/algorithms/misc/extra-algo-1/impl.ts';

test('extra-algo-1 basic', () => {
  assert.equal(extraalgo1([1, 2, 3]), 6);
});
