import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfsBipartite, type GraphInput } from '../../src/algorithms/graph/bfs-bipartite/impl.ts';

test('bfs-bipartite 偶环是二分图', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '0' },
    ],
  };
  const { bipartite } = bfsBipartite(g);
  assert.equal(bipartite, true);
});

test('bfs-bipartite 奇环非二分图', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '0' },
    ],
  };
  const { bipartite } = bfsBipartite(g);
  assert.equal(bipartite, false);
});

test('bfs-bipartite 树是二分图', () => {
  const g: GraphInput = {
    nodes: ['r', 'a', 'b', 'c', 'd'],
    edges: [
      { from: 'r', to: 'a' },
      { from: 'r', to: 'b' },
      { from: 'a', to: 'c' },
      { from: 'a', to: 'd' },
    ],
  };
  const { bipartite, coloring } = bfsBipartite(g);
  assert.equal(bipartite, true);
  // r 与其子 a/b 不同色
  assert.notEqual(coloring.get('r'), coloring.get('a'));
});

test('bfs-bipartite 空图是二分图', () => {
  const { bipartite } = bfsBipartite({ nodes: [], edges: [] });
  assert.equal(bipartite, true);
});

test('bfs-bipartite 钩子染色数', () => {
  const visited: string[] = [];
  bfsBipartite(
    {
      nodes: ['0', '1', '2', '3'],
      edges: [
        { from: '0', to: '1' },
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '0' },
      ],
    },
    { onVisit: (v) => visited.push(v) },
  );
  assert.equal(visited.length, 4);
});
