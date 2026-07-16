import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo12 } from '../../src/algorithms/misc/extra-algo-12/impl.ts';

test('extra-algo-12 basic', () => {
  assert.equal(extraalgo12([1, 2, 3]), 6);
});
