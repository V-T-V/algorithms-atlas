import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo11 } from '../../src/algorithms/misc/extra-algo-11/impl.ts';

test('extra-algo-11 basic', () => {
  assert.equal(extraalgo11([1, 2, 3]), 6);
});
