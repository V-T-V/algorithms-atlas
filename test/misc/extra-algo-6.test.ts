import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo6 } from '../../src/algorithms/misc/extra-algo-6/impl.ts';

test('extra-algo-6 basic', () => {
  assert.equal(extraalgo6([1, 2, 3]), 6);
});
