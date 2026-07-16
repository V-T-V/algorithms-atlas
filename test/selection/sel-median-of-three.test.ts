import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  medianOfThree,
  medianOfThreeOfArray,
} from '../../src/algorithms/selection/sel-median-of-three/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-median-of-three/trace.ts';

test('sel-median-of-three 基本中位数', () => {
  const r = medianOfThree([1, 2, 3, 4, 5], 0, 4);
  assert.equal(r.median, 3); // 1,3,5 -> 3
});

test('sel-median-of-three 不同顺序', () => {
  const r = medianOfThree([5, 4, 3, 2, 1], 0, 4);
  assert.equal(r.median, 3); // 5,3,1 -> 3
});

test('sel-median-of-three 小数组回退', () => {
  const r = medianOfThreeOfArray([2, 1]);
  assert.equal(r.median, 1);
});

test('sel-median-of-three trace', () => {
  assert.ok(buildTrace().length > 2);
});
