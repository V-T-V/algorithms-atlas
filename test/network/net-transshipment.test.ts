import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  transshipment,
  type TransshipmentInput,
} from '../../src/algorithms/network/net-transshipment/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-transshipment/trace.ts';

test('net-transshipment 选最便宜路径', () => {
  // 0->1->3: 1+2=3; 0->2->3: 4+1=5; 最便宜走 0->1->3，10 单位共 30
  const input: TransshipmentInput = {
    n: 4,
    balance: [10, 0, 0, -10],
    edges: [
      { from: 0, to: 1, cap: 10, cost: 1 },
      { from: 0, to: 2, cap: 10, cost: 4 },
      { from: 1, to: 3, cap: 10, cost: 2 },
      { from: 2, to: 3, cap: 10, cost: 1 },
      { from: 1, to: 2, cap: 10, cost: 1 },
    ],
  };
  const r = transshipment(input);
  assert.equal(r.totalFlow, 10);
  assert.equal(r.totalCost, 30);
});

test('net-transshipment 直达', () => {
  const input: TransshipmentInput = {
    n: 2,
    balance: [5, -5],
    edges: [{ from: 0, to: 1, cap: 10, cost: 3 }],
  };
  const r = transshipment(input);
  assert.equal(r.totalCost, 15);
});

test('net-transshipment 容量限制分流', () => {
  // 主路径容 4，需运 6，溢出走贵路径
  const input: TransshipmentInput = {
    n: 3,
    balance: [6, -6, 0],
    edges: [
      { from: 0, to: 2, cap: 4, cost: 1 },
      { from: 2, to: 1, cap: 4, cost: 1 },
      { from: 0, to: 1, cap: 6, cost: 10 },
    ],
  };
  const r = transshipment(input);
  // 4 单位走 0->2->1 (费 2×4=8) + 2 单位直达 (费 10×2=20) = 28
  assert.equal(r.totalFlow, 6);
  assert.equal(r.totalCost, 28);
});

test('net-transshipment 平衡需求', () => {
  const input: TransshipmentInput = {
    n: 2,
    balance: [3, -3],
    edges: [{ from: 0, to: 1, cap: 5, cost: 2 }],
  };
  const r = transshipment(input);
  assert.equal(r.totalFlow, 3);
});

test('net-transshipment trace', () => {
  assert.ok(buildTrace().length >= 2);
});
