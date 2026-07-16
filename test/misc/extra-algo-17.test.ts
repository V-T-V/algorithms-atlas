import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extraalgo17 } from '../../src/algorithms/misc/extra-algo-17/impl.ts';

test('extra-algo-17 basic', () => {
  assert.equal(extraalgo17([1, 2, 3]), 6);
});
