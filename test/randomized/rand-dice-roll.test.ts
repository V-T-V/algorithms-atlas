import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rollDice } from '../../src/algorithms/randomized/rand-dice-roll/impl.ts';
test('值在 1..6', () => {
  const xs = rollDice(1, 1000);
  assert.ok(xs.every((x) => x >= 1 && x <= 6));
});
