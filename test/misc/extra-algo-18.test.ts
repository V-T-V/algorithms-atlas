import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo18 } from '../../src/algorithms/misc/extra-algo-18/impl.ts';

test('extra-algo-18 basic', () => {
  assert.equal(extraalgo18([1, 2, 3]), 6);
});
