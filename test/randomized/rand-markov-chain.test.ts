import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markovChain } from '../../src/algorithms/randomized/rand-markov-chain/impl.ts';
test('长度为 steps+1', () => {
  const s = markovChain(
    [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    0,
    20,
    42,
  );
  assert.equal(s.length, 21);
});
test('状态合法', () => {
  const s = markovChain(
    [
      [0, 1],
      [1, 0],
    ],
    0,
    10,
    5,
  );
  assert.ok(s.every((x) => x === 0 || x === 1));
});
