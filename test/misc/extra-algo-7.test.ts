import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo7 } from '../../src/algorithms/misc/extra-algo-7/impl.ts';

test('extra-algo-7 basic', () => {
  assert.equal(extraalgo7([1, 2, 3]), 6);
});
