import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxFlowWithLowerBound } from '../../src/algorithms/network/net-flow-with-lower-bound/impl.ts';

test('maxFlowWithLowerBound 可行时返回正值', () => {
  const f = maxFlowWithLowerBound({
    n: 4,
    edges: [
      { from: 0, to: 1, low: 1, cap: 3 },
      { from: 0, to: 2, low: 1, cap: 2 },
      { from: 1, to: 3, low: 1, cap: 3 },
      { from: 2, to: 3, low: 1, cap: 2 },
    ],
    s: 0,
    t: 3,
  });
  assert.ok(f > 0);
});

test('maxFlowWithLowerBound 不可行返回 -1', () => {
  // 下界总和超过汇点排放能力
  const f = maxFlowWithLowerBound({
    n: 3,
    edges: [
      { from: 0, to: 1, low: 5, cap: 5 },
      { from: 1, to: 2, low: 0, cap: 1 },
    ],
    s: 0,
    t: 2,
  });
  assert.equal(f, -1);
});

test('maxFlowWithLowerBound 钩子被调用', () => {
  let called = false;
  maxFlowWithLowerBound(
    {
      n: 4,
      edges: [
        { from: 0, to: 1, low: 1, cap: 2 },
        { from: 1, to: 3, low: 1, cap: 2 },
      ],
      s: 0,
      t: 3,
    },
    { onFeasible: () => (called = true) },
  );
  assert.ok(called);
});
