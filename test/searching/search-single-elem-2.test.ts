import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  singleNonDuplicate2,
  type SingleElem2Hooks,
} from '../../src/algorithms/searching/search-single-elem-2/impl.ts';

test('singleNonDuplicate2 基本', () => {
  assert.equal(singleNonDuplicate2([1, 1, 2, 3, 3, 4, 4, 8, 8]), 2);
  assert.equal(singleNonDuplicate2([3, 3, 7, 7, 10, 11, 11]), 10);
  assert.equal(singleNonDuplicate2([1]), 1);
});
test('singleNonDuplicate2 钩子', () => {
  let c = 0;
  singleNonDuplicate2([1, 1, 2, 3, 3, 4, 4, 8, 8], { onCompare: () => c++ } as SingleElem2Hooks);
  assert.ok(c >= 1);
});
