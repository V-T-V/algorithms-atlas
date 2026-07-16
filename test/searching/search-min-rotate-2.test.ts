import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findMinRotated2,
  type MinRotate2Hooks,
} from '../../src/algorithms/searching/search-min-rotate-2/impl.ts';

test('findMinRotated2 基本', () => {
  assert.equal(findMinRotated2([4, 5, 6, 7, 0, 1, 2]), 4);
  assert.equal(findMinRotated2([3, 4, 5, 1, 2]), 3);
  assert.equal(findMinRotated2([11, 13, 15, 17]), 0);
});
test('findMinRotated2 边界', () => {
  assert.equal(findMinRotated2([1]), 0);
  assert.equal(findMinRotated2([2, 1]), 1);
  assert.equal(findMinRotated2([1, 2]), 0);
});
test('findMinRotated2 钩子', () => {
  let c = 0;
  findMinRotated2([4, 5, 6, 7, 0, 1, 2], { onCompare: () => c++ } as MinRotate2Hooks);
  assert.ok(c >= 1);
});
