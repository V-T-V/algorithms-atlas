import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bipartiteCheck,
  type BipartiteCheckInput,
} from '../../src/algorithms/graph/bipartite-check/impl.ts';

test('bipartite-check 偶环是二分图', () => {
  const g: BipartiteCheckInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
    ],
  };
  const r = bipartiteCheck(g);
  assert.equal(r.bipartite, true);
  assert.equal(r.conflictEdge, null);
  // 每条边两端颜色不同
  for (const e of g.edges) {
    assert.notEqual(r.colors.get(e.from), r.colors.get(e.to), `边 ${e.from}-${e.to} 两端同色`);
  }
});

test('bipartite-check 奇环不是二分图', () => {
  const g: BipartiteCheckInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const r = bipartiteCheck(g);
  assert.equal(r.bipartite, false);
  assert.ok(r.conflictEdge, '应有冲突边');
});

test('bipartite-check 完全二分图 K2,3', () => {
  const g: BipartiteCheckInput = {
    nodes: ['A', 'B', 'X', 'Y', 'Z'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'A', to: 'Y' },
      { from: 'A', to: 'Z' },
      { from: 'B', to: 'X' },
      { from: 'B', to: 'Y' },
      { from: 'B', to: 'Z' },
    ],
  };
  assert.equal(bipartiteCheck(g).bipartite, true);
});

test('bipartite-check 单点', () => {
  const r = bipartiteCheck({ nodes: ['A'], edges: [] });
  assert.equal(r.bipartite, true);
  assert.equal(r.colors.get('A'), 0);
});

test('bipartite-check 多连通分量', () => {
  // 两个独立偶环 → 整体二分
  const g: BipartiteCheckInput = {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'C', to: 'D' },
      { from: 'E', to: 'F' },
    ],
  };
  assert.equal(bipartiteCheck(g).bipartite, true);
});

test('bipartite-check 含奇环的多分量', () => {
  // 一个偶环 + 一个奇环 → 非二分
  const g: BipartiteCheckInput = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'C' },
    ],
  };
  assert.equal(bipartiteCheck(g).bipartite, false);
});

test('bipartite-check 钩子被调用', () => {
  const colored: string[] = [];
  let doneBip = null;
  const g: BipartiteCheckInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  bipartiteCheck(g, {
    onColor: (node) => colored.push(node),
    onDone: (bip) => {
      doneBip = bip;
    },
  });
  assert.ok(colored.length >= 2, '至少染色了若干节点');
  assert.equal(doneBip, false);
});
