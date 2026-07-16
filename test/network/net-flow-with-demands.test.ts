import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  maxFlowWithDemands,
  type LowerBoundFlowInput,
} from '../../src/algorithms/network/net-flow-with-demands/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-flow-with-demands/trace.ts';

test('net-flow-with-demands 简单链可行', () => {
  const g: LowerBoundFlowInput = {
    nodes: ['S', 'A', 'T'],
    edges: [
      { from: 'S', to: 'A', lower: 1, upper: 5 },
      { from: 'A', to: 'T', lower: 2, upper: 4 },
    ],
    source: 'S',
    sink: 'T',
  };
  const r = maxFlowWithDemands(g);
  assert.equal(r.feasible, true);
  // 最大流受 A->T 上界 4 限制
  assert.equal(r.maxFlow, 4);
});

test('net-flow-with-demands 下界不可达不可行', () => {
  const g: LowerBoundFlowInput = {
    nodes: ['S', 'T'],
    edges: [{ from: 'S', to: 'T', lower: 5, upper: 3 }],
    source: 'S',
    sink: 'T',
  };
  const r = maxFlowWithDemands(g);
  assert.equal(r.feasible, false);
});

test('net-flow-with-demands 下界即上界', () => {
  const g: LowerBoundFlowInput = {
    nodes: ['S', 'T'],
    edges: [{ from: 'S', to: 'T', lower: 3, upper: 3 }],
    source: 'S',
    sink: 'T',
  };
  const r = maxFlowWithDemands(g);
  assert.equal(r.feasible, true);
  assert.equal(r.maxFlow, 3);
});

test('net-flow-with-demands trace', () => {
  assert.ok(buildTrace().length >= 2);
});
