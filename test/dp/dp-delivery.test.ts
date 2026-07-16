import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliveryCourier } from '../../src/algorithms/dp/dp-delivery/impl.ts';

test('delivery 起点在端点 = 区间长度', () => {
  // [1,2,3] start 1: range 2 + 0 = 2
  assert.equal(deliveryCourier({ positions: [1, 2, 3], start: 1 }).minDist, 2);
});

test('delivery 起点在中点 = 区间长度 + 到端点距离', () => {
  // [-10,-5,0,5,10] start 0: 20 + 10 = 30
  assert.equal(deliveryCourier({ positions: [-10, -5, 0, 5, 10], start: 0 }).minDist, 30);
});

test('delivery 起点在另一端', () => {
  assert.equal(deliveryCourier({ positions: [-10, -5, 0, 5, 10], start: -10 }).minDist, 20);
  assert.equal(deliveryCourier({ positions: [-10, -5, 0, 5, 10], start: 10 }).minDist, 20);
});

test('delivery 单点 = 0', () => {
  assert.equal(deliveryCourier({ positions: [5], start: 5 }).minDist, 0);
});

test('delivery 起点恰为中点 [1,2,3] start 2', () => {
  // range 2 + min(1,1) = 3
  assert.equal(deliveryCourier({ positions: [1, 2, 3], start: 2 }).minDist, 3);
});

test('delivery 钩子被调用', () => {
  let calls = 0;
  deliveryCourier({ positions: [1, 2, 3], start: 1 }, { onExpand: () => calls++ });
  assert.ok(calls > 0);
});
