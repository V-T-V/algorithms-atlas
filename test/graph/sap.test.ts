import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sap, type FlowNetworkInput } from '../../src/algorithms/graph/sap/impl.ts';

const G: FlowNetworkInput = {
  nodes: ['s', 'a', 'b', 'c', 'd', 't'],
  edges: [
    { from: 's', to: 'a', capacity: 3 },
    { from: 's', to: 'b', capacity: 2 },
    { from: 'a', to: 'b', capacity: 1 },
    { from: 'a', to: 'c', capacity: 3 },
    { from: 'b', to: 'c', capacity: 2 },
    { from: 'c', to: 'd', capacity: 4 },
    { from: 'd', to: 't', capacity: 5 },
    { from: 'b', to: 't', capacity: 1 },
  ],
  source: 's',
  sink: 't',
};

test('sap 与 dinic 一致的最大流 = 5', () => {
  const { maxFlow } = sap(G);
  assert.equal(maxFlow, 5);
});

test('sap 单链', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 'm', 't'],
    edges: [
      { from: 's', to: 'm', capacity: 4 },
      { from: 'm', to: 't', capacity: 3 },
    ],
    source: 's',
    sink: 't',
  };
  assert.equal(sap(g).maxFlow, 3);
});

test('sap 源汇相同', () => {
  const g: FlowNetworkInput = { nodes: ['s'], edges: [], source: 's', sink: 's' };
  assert.equal(sap(g).maxFlow, 0);
});

test('sap 不可达', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 't'],
    edges: [],
    source: 's',
    sink: 't',
  };
  assert.equal(sap(g).maxFlow, 0);
});

test('sap 流量守恒（中间点流入=流出）', () => {
  const { flows } = sap(G);
  const inFlow = new Map<string, number>();
  const outFlow = new Map<string, number>();
  for (const e of G.edges) {
    const f = flows.get(`${e.from}>${e.to}`) ?? 0;
    inFlow.set(e.to, (inFlow.get(e.to) ?? 0) + f);
    outFlow.set(e.from, (outFlow.get(e.from) ?? 0) + f);
  }
  for (const n of G.nodes) {
    if (n === G.source || n === G.sink) continue;
    assert.equal(inFlow.get(n) ?? 0, outFlow.get(n) ?? 0, `flow conservation at ${n}`);
  }
});

test('sap 钩子被调用', () => {
  const augments: number[] = [];
  let doneFlow = -1;
  sap(G, {
    onAugment: (_p, f) => augments.push(f),
    onDone: (mf) => {
      doneFlow = mf;
    },
  });
  assert.ok(augments.length >= 1);
  const sum = augments.reduce((a, b) => a + b, 0);
  assert.equal(sum, 5);
  assert.equal(doneFlow, 5);
});
