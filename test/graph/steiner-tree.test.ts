import { test } from 'node:test';
import assert from 'node:assert/strict';
import { steinerTree, type GraphInput } from '../../src/algorithms/graph/steiner-tree/impl.ts';

test('steiner-tree 对角终点，最优 2', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'A', weight: 1 },
      { from: 'A', to: 'C', weight: 3 },
    ],
  };
  const { cost } = steinerTree(g, ['A', 'C']);
  assert.equal(cost, 2); // A-B-C 或 A-D-C
});

test('steiner-tree 全部为终点 = MST', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 4 },
    ],
  };
  const { cost } = steinerTree(g, ['A', 'B', 'C']);
  assert.equal(cost, 3); // A-B + B-C
});

test('steiner-tree 三终点用中转更优', () => {
  // 中心 O 连接 A、B、C 各权 1；A-B、B-C、C-A 各权 10
  // 终点 A、B、C：最优 = O-A + O-B + O-C = 3
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'O'],
    edges: [
      { from: 'A', to: 'O', weight: 1 },
      { from: 'B', to: 'O', weight: 1 },
      { from: 'C', to: 'O', weight: 1 },
      { from: 'A', to: 'B', weight: 10 },
      { from: 'B', to: 'C', weight: 10 },
      { from: 'C', to: 'A', weight: 10 },
    ],
  };
  const { cost, edges } = steinerTree(g, ['A', 'B', 'C']);
  assert.equal(cost, 3);
  // 树应包含中转点 O
  const usedNodes = new Set<string>();
  for (const e of edges) {
    usedNodes.add(e.from);
    usedNodes.add(e.to);
  }
  assert.ok(usedNodes.has('O'));
});

test('steiner-tree 单终点代价 0', () => {
  const g: GraphInput = { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B', weight: 5 }] };
  assert.equal(steinerTree(g, ['A']).cost, 0);
});

test('steiner-tree 空终点', () => {
  const g: GraphInput = { nodes: ['A'], edges: [] };
  assert.equal(steinerTree(g, []).cost, 0);
});

test('steiner-tree 钩子', () => {
  let inits = 0;
  steinerTree(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'A', to: 'C', weight: 3 },
      ],
    },
    ['A', 'C'],
    { onInit: () => inits++ },
  );
  assert.equal(inits, 1);
});
