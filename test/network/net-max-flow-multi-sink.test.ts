import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  multiSinkMaxFlow,
  type MultiSinkInput,
} from '../../src/algorithms/network/net-max-flow-multi-sink/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-max-flow-multi-sink/trace.ts';

test('net-max-flow-multi-sink 两汇分流', () => {
  const g: MultiSinkInput = {
    nodes: ['S', 'A', 'B', 'C'],
    edges: [
      { from: 'S', to: 'A', capacity: 6 },
      { from: 'S', to: 'B', capacity: 4 },
      { from: 'A', to: 'C', capacity: 5 },
      { from: 'B', to: 'C', capacity: 3 },
    ],
    source: 'S',
    sinks: [
      { id: 'A', demand: 10 },
      { id: 'C', demand: 10 },
    ],
  };
  // S->A=6 (A 是汇) + S->B->C=3 (C 是汇，经 B) = 9
  assert.equal(multiSinkMaxFlow(g).maxFlow, 9);
});

test('net-max-flow-multi-sink 单汇退化', () => {
  const g: MultiSinkInput = {
    nodes: ['S', 'T'],
    edges: [{ from: 'S', to: 'T', capacity: 7 }],
    source: 'S',
    sinks: [{ id: 'T', demand: 7 }],
  };
  assert.equal(multiSinkMaxFlow(g).maxFlow, 7);
});

test('net-max-flow-multi-sink 受需求限制', () => {
  const g: MultiSinkInput = {
    nodes: ['S', 'T'],
    edges: [{ from: 'S', to: 'T', capacity: 100 }],
    source: 'S',
    sinks: [{ id: 'T', demand: 3 }],
  };
  assert.equal(multiSinkMaxFlow(g).maxFlow, 3);
});

test('net-max-flow-multi-sink trace', () => {
  assert.ok(buildTrace().length >= 2);
});
