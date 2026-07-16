import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  undirectedMaxFlow,
  type UndirectedFlowInput,
} from '../../src/algorithms/network/net-max-flow-undirected/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-max-flow-undirected/trace.ts';

test('net-max-flow-undirected 简单三角', () => {
  const g: UndirectedFlowInput = {
    nodes: ['S', 'A', 'T'],
    edges: [
      { from: 'S', to: 'A', capacity: 5 },
      { from: 'A', to: 'T', capacity: 5 },
    ],
    source: 'S',
    sink: 'T',
  };
  assert.equal(undirectedMaxFlow(g).maxFlow, 5);
});

test('net-max-flow-undirected 平行路径', () => {
  const g: UndirectedFlowInput = {
    nodes: ['S', 'A', 'B', 'T'],
    edges: [
      { from: 'S', to: 'A', capacity: 3 },
      { from: 'S', to: 'B', capacity: 2 },
      { from: 'A', to: 'B', capacity: 4 },
      { from: 'A', to: 'T', capacity: 2 },
      { from: 'B', to: 'T', capacity: 3 },
    ],
    source: 'S',
    sink: 'T',
  };
  // S 出口 5，T 入口 5，最大流 5
  assert.equal(undirectedMaxFlow(g).maxFlow, 5);
});

test('net-max-flow-undirected 直连', () => {
  const g: UndirectedFlowInput = {
    nodes: ['S', 'T'],
    edges: [{ from: 'S', to: 'T', capacity: 9 }],
    source: 'S',
    sink: 'T',
  };
  assert.equal(undirectedMaxFlow(g).maxFlow, 9);
});

test('net-max-flow-undirected trace', () => {
  assert.ok(buildTrace().length >= 2);
});
