import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  subsetXorSum,
  subsetXorSumNaive,
} from '../../src/algorithms/bitwise/bitwise-subset-xor/impl.ts';

test('subsetXorSum 与朴素法一致', () => {
  for (const arr of [[1, 3], [5, 1, 6], [1, 2, 3, 4], [10], [0, 0], [7, 7, 7]]) {
    assert.equal(subsetXorSum(arr), subsetXorSumNaive(arr), `[${arr.join(',')}]`);
  }
});

test('subsetXorSum 经典例子', () => {
  // [1,3] 子集异或：0,1,3,2 → 和 6
  assert.equal(subsetXorSum([1, 3]), 6);
  // [5,1,6]：5,1,6,5^1=4,5^6=3,1^6=7,5^1^6=2 → 和 28
  assert.equal(subsetXorSum([5, 1, 6]), 28);
});

test('subsetXorSum 边界', () => {
  assert.equal(subsetXorSum([]), 0);
  assert.equal(subsetXorSum([7]), 7);
});

test('subsetXorSum 钩子逐位触发', () => {
  let bits = 0;
  subsetXorSum([1, 3], { onBit: () => bits++ });
  assert.ok(bits >= 1);
});
