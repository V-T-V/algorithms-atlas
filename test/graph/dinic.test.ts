import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dinic, type FlowNetworkInput } from '../../src/algorithms/graph/dinic/impl.ts';

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

test('dinic 正确最大流值', () => {
  const r = dinic(G);
  assert.equal(r.maxFlow, 5);
});

test('dinic 流量守恒（源点流出 = 汇点流入 = 最大流）', () => {
  const r = dinic(G);
  // 源点 s 流出之和
  const outOfS = G.edges
    .filter((e) => e.from === 's')
    .reduce((acc, e) => acc + (r.flows.get(`${e.from}>${e.to}`) ?? 0), 0);
  const intoT = G.edges
    .filter((e) => e.to === 't')
    .reduce((acc, e) => acc + (r.flows.get(`${e.from}>${e.to}`) ?? 0), 0);
  assert.equal(outOfS, r.maxFlow);
  assert.equal(intoT, r.maxFlow);
});

test('dinic 每条边流量不超过容量', () => {
  const r = dinic(G);
  for (const e of G.edges) {
    const f = r.flows.get(`${e.from}>${e.to}`) ?? 0;
    assert.ok(f >= 0 && f <= e.capacity, `${e.from}>${e.to} flow ${f} exceeds cap ${e.capacity}`);
  }
});

test('dinic 内部中间节点守恒', () => {
  const r = dinic(G);
  for (const n of G.nodes) {
    if (n === 's' || n === 't') continue;
    let inFlow = 0;
    let outFlow = 0;
    for (const e of G.edges) {
      if (e.to === n) inFlow += r.flows.get(`${e.from}>${e.to}`) ?? 0;
      if (e.from === n) outFlow += r.flows.get(`${e.from}>${e.to}`) ?? 0;
    }
    assert.equal(inFlow, outFlow, `节点 ${n} 流量不守恒`);
  }
});

test('dinic 源等于汇', () => {
  const r = dinic({ nodes: ['x'], edges: [], source: 'x', sink: 'x' });
  assert.equal(r.maxFlow, 0);
});

test('dinic 不连通（汇不可达）流为 0', () => {
  const g: FlowNetworkInput = {
    nodes: ['s', 't'],
    edges: [],
    source: 's',
    sink: 't',
  };
  assert.equal(dinic(g).maxFlow, 0);
});

test('dinic 钩子被调用', () => {
  const augments: Array<{ path: string[]; flow: number }> = [];
  let doneFlow = -1;
  let bfsPhases = 0;
  dinic(G, {
    onBfsStart: () => {
      bfsPhases++;
    },
    onAugment: (path, flow) => augments.push({ path, flow }),
    onDone: (mf) => {
      doneFlow = mf;
    },
  });
  assert.equal(doneFlow, 5);
  const totalAugmented = augments.reduce((acc, a) => acc + a.flow, 0);
  assert.equal(totalAugmented, 5, '增广路推送之和应等于最大流');
  assert.ok(bfsPhases >= 1, '至少一次 BFS 分层');
  assert.ok(augments.length >= 1, '至少一次增广');
});
