import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPeak2, type Peak2Hooks } from '../../src/algorithms/searching/search-peak-2/impl.ts';

test('findPeak2 是峰值', () => {
  const A1 = [1, 2, 3, 1];
  const p1 = findPeak2(A1);
  assert.equal(A1[p1], 3);
  const A2 = [1, 2, 1, 3, 5, 6, 4];
  const p2 = findPeak2(A2);
  assert.ok(
    (p2 > 0 ? A2[p2]! >= A2[p2 - 1]! : true) &&
      (p2 < A2.length - 1 ? A2[p2]! >= A2[p2 + 1]! : true),
  );
});
test('findPeak2 单调', () => {
  assert.equal(findPeak2([1, 2, 3, 4, 5]), 4);
  assert.equal(findPeak2([5, 4, 3, 2, 1]), 0);
});
test('findPeak2 边界', () => {
  assert.equal(findPeak2([1]), 0);
  assert.equal(findPeak2([1, 2]), 1);
});
test('findPeak2 钩子', () => {
  let c = 0;
  findPeak2([1, 2, 3, 1], { onCompare: () => c++ } as Peak2Hooks);
  assert.ok(c >= 1);
});
