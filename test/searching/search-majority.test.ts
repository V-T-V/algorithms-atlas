import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  majorityElement,
  type MajorityHooks,
} from '../../src/algorithms/searching/search-majority/impl.ts';

test('majorityElement 基本', () => {
  assert.equal(majorityElement([2, 2, 1, 1, 1, 2, 2]), 2);
  assert.equal(majorityElement([3, 3, 4]), 3);
  assert.equal(majorityElement([1]), 1);
});
test('majorityElement 钩子', () => {
  let c = 0;
  majorityElement([2, 2, 1], { onVote: () => c++ } as MajorityHooks);
  assert.ok(c >= 1);
});
