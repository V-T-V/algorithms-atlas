import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestDag, type GraphInput } from '../../src/algorithms/graph/shortest-dag/impl.ts';

const G: GraphInput = {
  nodes: ['s', 'a', 'b', 'c', 't'],
  edges: [
    { from: 's', to: 'a', weight: 2 },
    { from: 's', to: 'b', weight: 6 },
    { from: 'a', to: 'b', weight: 1 },
    { from: 'a', to: 'c', weight: 3 },
    { from: 'b', to: 'c', weight: -2 },
    { from: 'c', to: 't', weight: 4 },
  ],
  source: 's',
};

test('shortest-dag 含负权最短路', () => {
  const { dist, hasCycle } = shortestDag(G);
  assert.equal(hasCycle, false);
  assert.equal(dist.get('s'), 0);
  assert.equal(dist.get('a'), 2);
  assert.equal(dist.get('b'), 3); // s→a→b = 3
  assert.equal(dist.get('c'), 1); // s→a→b→c = 2+1-2 = 1
  assert.equal(dist.get('t'), 5); // +4
});

test('shortest-dag 拓扑序合法', () => {
  const { topoOrder, hasCycle } = shortestDag(G);
  assert.equal(hasCycle, false);
  const pos = new Map(topoOrder.map((n, i) => [n, i] as const));
  // 每条边的起点必须在终点之前
  for (const e of G.edges) {
    assert.ok((pos.get(e.from) ?? -1) < (pos.get(e.to) ?? -1));
  }
});

test('shortest-dag 检测环', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'A', weight: 1 },
    ],
    source: 'A',
  };
  const { hasCycle } = shortestDag(g);
  assert.equal(hasCycle, true);
});

test('shortest-dag 不可达为 ∞', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'X'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
    source: 'A',
  };
  const { dist } = shortestDag(g);
  assert.equal(dist.get('X'), Infinity);
  assert.equal(dist.get('B'), 1);
});

test('shortest-dag 钩子被调用', () => {
  const visits: string[] = [];
  let topoCalled = false;
  let doneCalled = false;
  shortestDag(G, {
    onTopoOrder: () => {
      topoCalled = true;
    },
    onVisit: (u) => visits.push(u),
    onDone: () => {
      doneCalled = true;
    },
  });
  assert.ok(topoCalled);
  assert.equal(visits.length, 5);
  assert.ok(doneCalled);
});
