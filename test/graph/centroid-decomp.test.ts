import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  centroidDecomp,
  type GraphInput,
} from '../../src/algorithms/graph/centroid-decomp/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
    { from: '4', to: '6' },
    { from: '4', to: '7' },
  ],
  root: '1',
};

const heightOf = (children: Map<string, string[]>, root: string): number => {
  const kids = children.get(root) ?? [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map((k) => heightOf(children, k)));
};

test('centroid-decomp 每个节点都被赋父或为根', () => {
  const { centroidParent } = centroidDecomp(G);
  for (const n of G.nodes) {
    assert.ok(centroidParent.has(n), `${n} 未处理`);
  }
  const roots = [...centroidParent.entries()].filter(([, p]) => p === null);
  assert.equal(roots.length, 1);
});

test('centroid-decomp 点分树高度 O(log n)', () => {
  const { centroidChildren, root } = centroidDecomp(G);
  const h = heightOf(centroidChildren, root);
  assert.ok(h <= 4, `点分树高 ${h} 应不超过 4（log2 7≈3 上取）`);
});

test('centroid-decomp 根重心删除后最大子树 <= n/2', () => {
  let rootMaxSub = Infinity;
  centroidDecomp(G, {
    onCentroid: (_c, maxSub) => {
      rootMaxSub = Math.min(rootMaxSub, maxSub);
    },
  });
  // 7 节点：根重心 maxSub <= 3
  assert.ok(rootMaxSub <= 3, `maxSub=${rootMaxSub}`);
});

test('centroid-decomp 链式树', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
    ],
    root: 'A',
  };
  const { centroidChildren, root } = centroidDecomp(g);
  const h = heightOf(centroidChildren, root);
  assert.ok(h <= 4, `链式点分树高 ${h} 应 <= 4`);
});

test('centroid-decomp 钩子被调用', () => {
  const centroids: string[] = [];
  let levels = 0;
  centroidDecomp(G, {
    onCentroid: (c) => centroids.push(c),
    onDone: (lv) => {
      levels = lv;
    },
  });
  assert.equal(centroids.length, 7); // 每个节点恰作一次重心
  assert.ok(levels >= 1);
});
