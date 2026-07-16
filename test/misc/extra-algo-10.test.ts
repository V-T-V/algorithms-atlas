import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo10 } from '../../src/algorithms/misc/extra-algo-10/impl.ts';

test('extra-algo-10 basic', () => {
  assert.equal(extraalgo10([1, 2, 3]), 6);
});
