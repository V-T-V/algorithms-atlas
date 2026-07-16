import { test } from 'node:test';
import assert from 'node:assert/strict';
import { majorityVote } from '../../src/algorithms/ml/ml-majority-vote/impl.ts';
test('多数投票', () => {
  assert.deepEqual(
    majorityVote([
      [0, 1],
      [0, 1],
      [1, 1],
    ]),
    [0, 1],
  );
});
