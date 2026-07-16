import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  nodeCapMaxFlow,
  type NodeCapInput,
} from '../../src/algorithms/network/net-max-flow-node/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-max-flow-node/trace.ts';

test('net-max-flow-node 节点容量限制流', () => {
  // S->A (cap 5 边, A 节点 cap 2) -> T；S->B (cap 5) -> T。瓶颈在 A 节点 = 2，加 B 路 5 = 7
  const g: NodeCapInput = {
    nodes: [
      { id: 'S', capacity: 10 },
      { id: 'A', capacity: 2 },
      { id: 'B', capacity: 10 },
      { id: 'T', capacity: 10 },
    ],
    edges: [
      { from: 'S', to: 'A', capacity: 5 },
      { from: 'S', to: 'B', capacity: 5 },
      { from: 'A', to: 'T', capacity: 5 },
      { from: 'B', to: 'T', capacity: 5 },
    ],
    source: 'S',
    sink: 'T',
  };
  assert.equal(nodeCapMaxFlow(g).maxFlow, 7);
});

test('net-max-flow-node 仅边容量（节点 cap 大）', () => {
  const g: NodeCapInput = {
    nodes: [
      { id: 'S', capacity: 100 },
      { id: 'T', capacity: 100 },
    ],
    edges: [{ from: 'S', to: 'T', capacity: 8 }],
    source: 'S',
    sink: 'T',
  };
  assert.equal(nodeCapMaxFlow(g).maxFlow, 8);
});

test('net-max-flow-node 节点容量为 0 则阻断', () => {
  const g: NodeCapInput = {
    nodes: [
      { id: 'S', capacity: 100 },
      { id: 'M', capacity: 0 },
      { id: 'T', capacity: 100 },
    ],
    edges: [
      { from: 'S', to: 'M', capacity: 10 },
      { from: 'M', to: 'T', capacity: 10 },
    ],
    source: 'S',
    sink: 'T',
  };
  assert.equal(nodeCapMaxFlow(g).maxFlow, 0);
});

test('net-max-flow-node trace', () => {
  assert.ok(buildTrace().length >= 2);
});
