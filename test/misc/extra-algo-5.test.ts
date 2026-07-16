import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo5 } from '../../src/algorithms/misc/extra-algo-5/impl.ts';

test('extra-algo-5 basic', () => {
  assert.equal(extraalgo5([1, 2, 3]), 6);
});
