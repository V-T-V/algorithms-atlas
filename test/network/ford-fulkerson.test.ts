import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fordFulkerson,
  type FlowNetworkInput,
} from '../../src/algorithms/network/ford-fulkerson/impl.ts';

const G: FlowNetworkInput = {
  nodes: ['S', 'A', 'B', 'C', 'T'],
  edges: [
    { from: 'S', to: 'A', capacity: 10 },
    { from: 'S', to: 'B', capacity: 10 },
    { from: 'A', to: 'B', capacity: 2 },
    { from: 'A', to: 'C', capacity: 4 },
    { from: 'A', to: 'T', capacity: 8 },
    { from: 'B', to: 'C', capacity: 9 },
    { from: 'C', to: 'T', capacity: 10 },
  ],
  source: 'S',
  sink: 'T',
};

test('fordFulkerson 正确最大流', () => {
  const r = fordFulkerson(G);
  assert.equal(r.maxFlow, 18);
});

test('fordFulkerson 守恒（中间节点流入=流出）', () => {
  const r = fordFulkerson(G);
  for (const node of ['A', 'B', 'C']) {
    const inflow = r.flows.filter((f) => f.to === node).reduce((s, f) => s + f.flow, 0);
    const outflow = r.flows.filter((f) => f.from === node).reduce((s, f) => s + f.flow, 0);
    assert.equal(inflow, outflow, `节点 ${node} 流量不守恒`);
  }
});

test('fordFulkerson 容量约束', () => {
  const r = fordFulkerson(G);
  for (const f of r.flows) {
    assert.ok(f.flow >= 0 && f.flow <= f.capacity, `边 ${f.from}→${f.to} 流量 ${f.flow} 越界`);
  }
});

test('fordFulkerson 经典示例（CLRS）', () => {
  // CLRS 第 26 章 classic max flow = 23
  const clrs: FlowNetworkInput = {
    nodes: ['s', 'v1', 'v2', 'v3', 'v4', 't'],
    edges: [
      { from: 's', to: 'v1', capacity: 16 },
      { from: 's', to: 'v2', capacity: 13 },
      { from: 'v1', to: 'v3', capacity: 12 },
      { from: 'v2', to: 'v1', capacity: 4 },
      { from: 'v2', to: 'v4', capacity: 14 },
      { from: 'v3', to: 'v2', capacity: 9 },
      { from: 'v3', to: 't', capacity: 20 },
      { from: 'v4', to: 'v3', capacity: 7 },
      { from: 'v4', to: 't', capacity: 4 },
    ],
    source: 's',
    sink: 't',
  };
  assert.equal(fordFulkerson(clrs).maxFlow, 23);
});

test('fordFulkerson 平行边', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 't'],
    edges: [
      { from: 's', to: 't', capacity: 3 },
      { from: 's', to: 't', capacity: 5 },
    ],
    source: 's',
    sink: 't',
  };
  assert.equal(fordFulkerson(g).maxFlow, 8);
});

test('fordFulkerson 不连通返回 0', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 'a', 't'],
    edges: [{ from: 's', to: 'a', capacity: 5 }],
    source: 's',
    sink: 't',
  };
  assert.equal(fordFulkerson(g).maxFlow, 0);
});

test('fordFulkerson 钩子被调用', () => {
  let augments = 0;
  let noPath = 0;
  let total = -1;
  fordFulkerson(G, {
    onAugment: (_p, _b, t) => {
      augments++;
      total = t;
    },
    onNoPath: (t) => {
      noPath++;
      total = t;
    },
  });
  assert.ok(augments > 0, '应有增广');
  assert.equal(noPath, 1);
  assert.equal(total, 18);
});
