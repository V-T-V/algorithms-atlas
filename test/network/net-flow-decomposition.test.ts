import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  decomposeFlow,
  type FlowEdge,
} from '../../src/algorithms/network/net-flow-decomposition/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-flow-decomposition/trace.ts';

test('net-flow-decomposition 路径流之和等于总流', () => {
  const edges: FlowEdge[] = [
    { from: 'S', to: 'A', flow: 3 },
    { from: 'S', to: 'B', flow: 2 },
    { from: 'A', to: 'B', flow: 1 },
    { from: 'A', to: 'T', flow: 2 },
    { from: 'B', to: 'T', flow: 3 },
  ];
  const decomp = decomposeFlow(edges, 'S', 'T', ['S', 'A', 'B', 'T']);
  const pathTotal = decomp.filter((p) => !p.isCycle).reduce((s, p) => s + p.amount, 0);
  assert.equal(pathTotal, 5); // S 出流 3+2=5
});

test('net-flow-decomposition 路径起止正确', () => {
  const edges: FlowEdge[] = [
    { from: 'S', to: 'A', flow: 4 },
    { from: 'A', to: 'T', flow: 4 },
  ];
  const decomp = decomposeFlow(edges, 'S', 'T', ['S', 'A', 'T']);
  const paths = decomp.filter((p) => !p.isCycle);
  assert.equal(paths.length, 1);
  assert.equal(paths[0]!.nodes[0], 'S');
  assert.equal(paths[0]!.nodes[paths[0]!.nodes.length - 1], 'T');
  assert.equal(paths[0]!.amount, 4);
});

test('net-flow-decomposition 含环流', () => {
  // A->B->A 形成环流，与 S->T 主路径无关
  const edges: FlowEdge[] = [
    { from: 'S', to: 'T', flow: 2 },
    { from: 'A', to: 'B', flow: 3 },
    { from: 'B', to: 'A', flow: 3 },
  ];
  const decomp = decomposeFlow(edges, 'S', 'T', ['S', 'T', 'A', 'B']);
  const cycles = decomp.filter((p) => p.isCycle);
  assert.ok(cycles.length >= 1);
  assert.equal(cycles[0]!.amount, 3);
});

test('net-flow-decomposition 无流返回空', () => {
  const decomp = decomposeFlow([], 'S', 'T', ['S', 'T']);
  assert.equal(decomp.length, 0);
});

test('net-flow-decomposition trace', () => {
  assert.ok(buildTrace().length >= 2);
});
