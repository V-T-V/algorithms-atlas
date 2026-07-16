import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo8 } from '../../src/algorithms/misc/extra-algo-8/impl.ts';

test('extra-algo-8 basic', () => {
  assert.equal(extraalgo8([1, 2, 3]), 6);
});
