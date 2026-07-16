import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  multiSourceMaxFlow,
  type MultiSourceInput,
} from '../../src/algorithms/network/net-max-flow-multi-source/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-max-flow-multi-source/trace.ts';

test('net-max-flow-multi-source 两源汇流', () => {
  const g: MultiSourceInput = {
    nodes: ['A', 'B', 'C', 'T'],
    edges: [
      { from: 'A', to: 'C', capacity: 5 },
      { from: 'B', to: 'C', capacity: 3 },
      { from: 'A', to: 'T', capacity: 4 },
      { from: 'C', to: 'T', capacity: 6 },
    ],
    sources: [
      { id: 'A', supply: 10 },
      { id: 'B', supply: 10 },
    ],
    sink: 'T',
  };
  // A->T 容 4 + C->T 容 6 = 10 (A 还能送 6 到 C，B 送 3 到 C，C 共 9>6 限 6)
  assert.equal(multiSourceMaxFlow(g).maxFlow, 10);
});

test('net-max-flow-multi-source 单源退化为标准', () => {
  const g: MultiSourceInput = {
    nodes: ['S', 'T'],
    edges: [{ from: 'S', to: 'T', capacity: 7 }],
    sources: [{ id: 'S', supply: 7 }],
    sink: 'T',
  };
  assert.equal(multiSourceMaxFlow(g).maxFlow, 7);
});

test('net-max-flow-multi-source 受供应量限制', () => {
  const g: MultiSourceInput = {
    nodes: ['A', 'T'],
    edges: [{ from: 'A', to: 'T', capacity: 100 }],
    sources: [{ id: 'A', supply: 3 }],
    sink: 'T',
  };
  assert.equal(multiSourceMaxFlow(g).maxFlow, 3);
});

test('net-max-flow-multi-source trace', () => {
  assert.ok(buildTrace().length >= 2);
});
