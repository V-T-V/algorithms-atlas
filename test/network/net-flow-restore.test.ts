import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  restoreFlow,
  computeExcess,
  type PreflowEdge,
} from '../../src/algorithms/network/net-flow-restore/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-flow-restore/trace.ts';

test('net-flow-restore 消除中间超额', () => {
  const edges: PreflowEdge[] = [
    { from: 'S', to: 'A', flow: 5, capacity: 5 },
    { from: 'A', to: 'B', flow: 3, capacity: 4 },
    { from: 'B', to: 'T', flow: 3, capacity: 3 },
  ];
  const nodes = ['S', 'A', 'B', 'T'];
  const restored = restoreFlow(edges, nodes, 'S', 'T');
  const excess = computeExcess(restored, nodes, 'S', 'T');
  for (const n of ['A', 'B']) {
    assert.equal(excess.get(n), 0, `节点 ${n} 仍有超额`);
  }
});

test('net-flow-restore 保持汇点流值', () => {
  const edges: PreflowEdge[] = [
    { from: 'S', to: 'A', flow: 5, capacity: 5 },
    { from: 'A', to: 'T', flow: 3, capacity: 3 },
  ];
  const restored = restoreFlow(edges, ['S', 'A', 'T'], 'S', 'T');
  const intoT = restored.filter((e) => e.to === 'T').reduce((s, e) => s + e.flow, 0);
  assert.equal(intoT, 3);
});

test('net-flow-restore 无超额不变', () => {
  const edges: PreflowEdge[] = [
    { from: 'S', to: 'A', flow: 3, capacity: 3 },
    { from: 'A', to: 'T', flow: 3, capacity: 3 },
  ];
  const restored = restoreFlow(edges, ['S', 'A', 'T'], 'S', 'T');
  assert.equal(restored[0]!.flow, 3);
  assert.equal(restored[1]!.flow, 3);
});

test('net-flow-restore trace', () => {
  assert.ok(buildTrace().length >= 2);
});
