import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solovayStrassen } from '../../src/algorithms/randomized/rand-solovay-strassen/impl.ts';
test('17 是素数', () => {
  assert.equal(solovayStrassen(17, [2, 3, 5]), true);
});
