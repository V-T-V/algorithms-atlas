import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxFlow, type FlowGraphInput } from '../../src/algorithms/graph/graph-max-flow-3/impl.ts';

test('max-flow 经典例', () => {
  const g: FlowGraphInput = {
    nodes: ['s', 'A', 'B', 'C', 'D', 't'],
    edges: [
      { from: 's', to: 'A', capacity: 10 },
      { from: 's', to: 'B', capacity: 10 },
      { from: 'A', to: 'C', capacity: 4 },
      { from: 'A', to: 'D', capacity: 2 },
      { from: 'B', to: 'C', capacity: 9 },
      { from: 'B', to: 'D', capacity: 6 },
      { from: 'C', to: 't', capacity: 10 },
      { from: 'D', to: 't', capacity: 10 },
    ],
    source: 's',
    sink: 't',
  };
  assert.equal(maxFlow(g), 19);
});

test('max-flow 简单链', () => {
  const g: FlowGraphInput = {
    nodes: ['s', 'A', 't'],
    edges: [
      { from: 's', to: 'A', capacity: 5 },
      { from: 'A', to: 't', capacity: 3 },
    ],
    source: 's',
    sink: 't',
  };
  assert.equal(maxFlow(g), 3);
});
