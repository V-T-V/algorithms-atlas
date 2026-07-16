import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  missingNumber2,
  type Missing2Hooks,
} from '../../src/algorithms/searching/search-missing-2/impl.ts';

test('missingNumber2 基本', () => {
  assert.equal(missingNumber2([3, 0, 1]), 2);
  assert.equal(missingNumber2([0, 1]), 2);
  assert.equal(missingNumber2([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
});
test('missingNumber2 边界', () => {
  assert.equal(missingNumber2([0]), 1);
  assert.equal(missingNumber2([1]), 0);
});
test('missingNumber2 钩子', () => {
  let c = 0;
  missingNumber2([3, 0, 1], { onSum: () => c++ } as Missing2Hooks);
  assert.ok(c >= 1);
});
