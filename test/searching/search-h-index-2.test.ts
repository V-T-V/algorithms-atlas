import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hIndex2,
  type HIndex2Hooks,
} from '../../src/algorithms/searching/search-h-index-2/impl.ts';

test('hIndex2 基本', () => {
  assert.equal(hIndex2([3, 0, 6, 1, 5]), 3);
  assert.equal(hIndex2([1, 1, 3]), 1);
  assert.equal(hIndex2([100]), 1);
});
test('hIndex2 边界', () => {
  assert.equal(hIndex2([]), 0);
  assert.equal(hIndex2([0, 0, 0]), 0);
  assert.equal(hIndex2([6, 6, 6, 6, 6]), 5);
});
test('hIndex2 钩子', () => {
  let c = 0;
  hIndex2([3, 0, 6, 1, 5], { onStep: () => c++ } as HIndex2Hooks);
  assert.ok(c >= 1);
});
