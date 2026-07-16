import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  circulationFeasible,
  type BoundEdge,
} from '../../src/algorithms/network/net-circulation-feasible/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-circulation-feasible/trace.ts';

test('net-circulation-feasible 三角环可行', () => {
  const edges: BoundEdge[] = [
    { from: 'A', to: 'B', lower: 1, upper: 4 },
    { from: 'B', to: 'C', lower: 2, upper: 5 },
    { from: 'C', to: 'A', lower: 1, upper: 4 },
  ];
  const r = circulationFeasible(['A', 'B', 'C'], edges);
  assert.equal(r.feasible, true);
});

test('net-circulation-feasible 下界超过上界不可行', () => {
  const edges: BoundEdge[] = [
    { from: 'A', to: 'B', lower: 5, upper: 4 },
    { from: 'B', to: 'A', lower: 0, upper: 10 },
  ];
  const r = circulationFeasible(['A', 'B'], edges);
  assert.equal(r.feasible, false);
});

test('net-circulation-feasible 不平衡无法满足', () => {
  // A 总出下界 3，入下界 1；无法仅用给定边上界平衡
  const edges: BoundEdge[] = [
    { from: 'A', to: 'B', lower: 3, upper: 3 },
    { from: 'C', to: 'A', lower: 1, upper: 1 },
    { from: 'B', to: 'C', lower: 0, upper: 1 },
  ];
  const r = circulationFeasible(['A', 'B', 'C'], edges);
  // A 出 3 入最多 1+1=2，不可行
  assert.equal(r.feasible, false);
});

test('net-circulation-feasible 环流守恒', () => {
  const edges: BoundEdge[] = [
    { from: 'A', to: 'B', lower: 1, upper: 4 },
    { from: 'B', to: 'C', lower: 2, upper: 5 },
    { from: 'C', to: 'A', lower: 1, upper: 4 },
  ];
  const r = circulationFeasible(['A', 'B', 'C'], edges);
  assert.equal(r.feasible, true);
  for (const n of ['A', 'B', 'C']) {
    const inflow = r.circulation.filter((c) => c.to === n).reduce((s, c) => s + c.flow, 0);
    const outflow = r.circulation.filter((c) => c.from === n).reduce((s, c) => s + c.flow, 0);
    assert.equal(inflow, outflow, `节点 ${n} 不守恒`);
  }
});

test('net-circulation-feasible trace', () => {
  assert.ok(buildTrace().length >= 2);
});
