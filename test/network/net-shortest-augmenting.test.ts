import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shortestAugmentingPath,
  type SapEdge,
} from '../../src/algorithms/network/net-shortest-augmenting/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-shortest-augmenting/trace.ts';

const G = {
  nodes: ['S', 'A', 'B', 'C', 'T'],
  edges: [
    { from: 'S', to: 'A', cap: 10 },
    { from: 'S', to: 'B', cap: 10 },
    { from: 'A', to: 'B', cap: 2 },
    { from: 'A', to: 'C', cap: 4 },
    { from: 'A', to: 'T', cap: 8 },
    { from: 'B', to: 'C', cap: 9 },
    { from: 'C', to: 'T', cap: 10 },
  ] as SapEdge[],
};

test('net-shortest-augmenting 正确最大流', () => {
  assert.equal(shortestAugmentingPath(G.nodes, G.edges, 'S', 'T'), 18);
});

test('net-shortest-augmenting CLRS 经典 = 23', () => {
  const edges: SapEdge[] = [
    { from: 's', to: 'v1', cap: 16 },
    { from: 's', to: 'v2', cap: 13 },
    { from: 'v1', to: 'v3', cap: 12 },
    { from: 'v2', to: 'v1', cap: 4 },
    { from: 'v2', to: 'v4', cap: 14 },
    { from: 'v3', to: 'v2', cap: 9 },
    { from: 'v3', to: 't', cap: 20 },
    { from: 'v4', to: 'v3', cap: 7 },
    { from: 'v4', to: 't', cap: 4 },
  ];
  assert.equal(shortestAugmentingPath(['s', 'v1', 'v2', 'v3', 'v4', 't'], edges, 's', 't'), 23);
});

test('net-shortest-augmenting 不连通返回 0', () => {
  assert.equal(
    shortestAugmentingPath(['s', 'a', 't'], [{ from: 's', to: 'a', cap: 5 }], 's', 't'),
    0,
  );
});

test('net-shortest-augmenting 钩子记录轮次', () => {
  let rounds = 0;
  let total = -1;
  shortestAugmentingPath(G.nodes, G.edges, 'S', 'T', {
    onAugment: () => {
      rounds++;
    },
    onDone: (mf) => {
      total = mf;
    },
  });
  assert.ok(rounds > 0);
  assert.equal(total, 18);
});

test('net-shortest-augmenting 直连', () => {
  assert.equal(shortestAugmentingPath(['s', 't'], [{ from: 's', to: 't', cap: 7 }], 's', 't'), 7);
});

test('net-shortest-augmenting trace', () => {
  assert.ok(buildTrace().length >= 2);
});
