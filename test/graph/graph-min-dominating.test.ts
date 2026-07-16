import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minDominatingSetGreedy } from '../../src/algorithms/graph/graph-min-dominating/impl.ts';

const isDominating = (
  set: string[],
  nodes: readonly string[],
  edges: ReadonlyArray<{ from: string; to: string }>,
): boolean => {
  const adj = new Map<string, Set<string>>();
  for (const n of nodes) adj.set(n, new Set([n]));
  for (const e of edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
  }
  const sset = new Set(set);
  for (const n of nodes) {
    let ok = false;
    for (const nb of adj.get(n) ?? []) if (sset.has(nb)) ok = true;
    if (!ok) return false;
  }
  return true;
};

test('dominating-set 路径合法', () => {
  const G = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
    ],
  };
  const s = minDominatingSetGreedy(G);
  assert.ok(isDominating(s, G.nodes, G.edges));
});

test('dominating-set 星形 1 点足矣', () => {
  const G = {
    nodes: ['C', 'L1', 'L2', 'L3'],
    edges: [
      { from: 'C', to: 'L1' },
      { from: 'C', to: 'L2' },
      { from: 'C', to: 'L3' },
    ],
  };
  const s = minDominatingSetGreedy(G);
  assert.ok(isDominating(s, G.nodes, G.edges));
  assert.equal(s.length, 1);
});

test('dominating-set 单节点', () => {
  const s = minDominatingSetGreedy({ nodes: ['A'], edges: [] });
  assert.deepEqual(s, ['A']);
});

test('dominating-set 三角形', () => {
  const G = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
    ],
  };
  const s = minDominatingSetGreedy(G);
  assert.equal(s.length, 1);
});
