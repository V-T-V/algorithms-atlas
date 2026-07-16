import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo3 } from '../../src/algorithms/misc/extra-algo-3/impl.ts';

test('extra-algo-3 basic', () => {
  assert.equal(extraalgo3([1, 2, 3]), 6);
});
