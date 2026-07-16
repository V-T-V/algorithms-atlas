import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findFixedPoint,
  type FixedPointHooks,
} from '../../src/algorithms/searching/search-fixed-point/impl.ts';

test('findFixedPoint 命中', () => {
  assert.equal(findFixedPoint([-10, -5, 0, 3, 7]), 3);
  assert.equal(findFixedPoint([-1, 1, 3, 5]), 1);
});
test('findFixedPoint 未命中', () => {
  assert.equal(findFixedPoint([1, 2, 3, 4]), -1);
  assert.equal(findFixedPoint([-1, 0, 1, 2]), -1);
});
test('findFixedPoint 边界', () => {
  assert.equal(findFixedPoint([]), -1);
  assert.equal(findFixedPoint([0]), 0);
});
test('findFixedPoint 钩子', () => {
  let c = 0;
  findFixedPoint([-10, -5, 0, 3, 7], { onCompare: () => c++ } as FixedPointHooks);
  assert.ok(c >= 1);
});
