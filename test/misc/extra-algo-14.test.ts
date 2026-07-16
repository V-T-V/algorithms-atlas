import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo14 } from '../../src/algorithms/misc/extra-algo-14/impl.ts';

test('extra-algo-14 basic', () => {
  assert.equal(extraalgo14([1, 2, 3]), 6);
});
