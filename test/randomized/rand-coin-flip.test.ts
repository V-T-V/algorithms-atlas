import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flipCoins } from '../../src/algorithms/randomized/rand-coin-flip/impl.ts';
test('值为 0 或 1', () => {
  const xs = flipCoins(5, 500);
  assert.ok(xs.every((x) => x === 0 || x === 1));
});
