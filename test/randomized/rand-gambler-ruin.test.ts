import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gamblerRuin } from '../../src/algorithms/randomized/rand-gambler-ruin/impl.ts';
test('终止于 0 或 N', () => {
  const res = gamblerRuin(5, 10, 42);
  assert.equal(res.win, true);
  assert.ok(res.steps > 0);
});
test('i=0 已破产', () => {
  assert.equal(gamblerRuin(0, 10, 1).win, false);
});
