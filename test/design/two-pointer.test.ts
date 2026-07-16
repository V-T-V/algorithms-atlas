import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSumSorted } from '../../src/algorithms/design/two-pointer/impl.ts';

test('two-pointer 有序两数之和（单解）', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const r = twoSumSorted(arr, 10);
  assert.deepEqual(r.pair, [0, 8]); // 1 + 9
  // 去重后所有对
  assert.deepEqual(r.allPairs, [
    [0, 8],
    [1, 7],
    [2, 6],
    [3, 5],
  ]);
});

test('two-pointer 无解', () => {
  assert.equal(twoSumSorted([1, 2, 3], 100).pair, null);
  assert.deepEqual(twoSumSorted([1, 2, 3], 100).allPairs, []);
});

test('two-pointer 边界', () => {
  assert.equal(twoSumSorted([], 5).pair, null);
  assert.equal(twoSumSorted([5], 5).pair, null);
  // 两元素恰为解
  assert.deepEqual(twoSumSorted([2, 3], 5).pair, [0, 1]);
});

test('two-pointer 钩子被调用', () => {
  let compares = 0;
  let founds = 0;
  twoSumSorted([1, 2, 3, 4], 5, {
    onCompare: () => compares++,
    onFound: () => founds++,
  });
  assert.ok(compares > 0);
  // [1,2,3,4] target 5 → (1,4),(2,3)
  assert.equal(founds, 2);
});
