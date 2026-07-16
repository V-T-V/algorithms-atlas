import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliverBoxes } from '../../src/algorithms/dp/dp-deliver-boxes/impl.ts';

test('deliver-boxes 基本例', () => {
  // ports=[1,2,1,2,3], maxBoxes=3, maxPorts=2
  // dp[0]=0; dp[1]=2(港1); dp[2]=4(港1,2各一趟2); ...
  // 逐一算：送 [1,2,1] cost 4, [2,3] cost 4 → 8
  assert.equal(deliverBoxes([1, 2, 1, 2, 3], 3, 2), 8);
});

test('deliver-boxes 单港口', () => {
  assert.equal(deliverBoxes([1, 1, 1], 3, 1), 2);
});

test('deliver-boxes 每盒一趟', () => {
  assert.equal(deliverBoxes([1, 2, 3], 1, 1), 6);
});

test('deliver-boxes 单个盒子', () => {
  assert.equal(deliverBoxes([5], 3, 2), 2);
});

test('deliver-boxes 空', () => {
  assert.equal(deliverBoxes([], 3, 2), 0);
});
