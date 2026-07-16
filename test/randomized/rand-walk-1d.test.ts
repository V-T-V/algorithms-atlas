import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomWalk1D } from '../../src/algorithms/randomized/rand-walk-1d/impl.ts';
test('起始为 0', () => {
  const w = randomWalk1D(10, 42);
  assert.equal(w[0], 0);
});
test('长度为 steps+1', () => {
  assert.equal(randomWalk1D(50, 1).length, 51);
});
test('末值与步数同奇偶', () => {
  const w = randomWalk1D(20, 5);
  assert.ok(Math.abs(w[20]!) % 2 === 20 % 2);
});
