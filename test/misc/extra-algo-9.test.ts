import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo9 } from '../../src/algorithms/misc/extra-algo-9/impl.ts';

test('extra-algo-9 basic', () => {
  assert.equal(extraalgo9([1, 2, 3]), 6);
});
