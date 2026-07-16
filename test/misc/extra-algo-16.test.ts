import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo16 } from '../../src/algorithms/misc/extra-algo-16/impl.ts';

test('extra-algo-16 basic', () => {
  assert.equal(extraalgo16([1, 2, 3]), 6);
});
