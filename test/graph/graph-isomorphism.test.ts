import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  graphIsomorphism,
  type GraphInput,
} from '../../src/algorithms/graph/graph-isomorphism/impl.ts';

test('iso 两个三角形同构', () => {
  const g1: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const g2: GraphInput = {
    nodes: ['X', 'Y', 'Z'],
    edges: [
      { from: 'X', to: 'Y' },
      { from: 'Y', to: 'Z' },
      { from: 'Z', to: 'X' },
    ],
  };
  const { isomorphic, mapping } = graphIsomorphism(g1, g2);
  assert.equal(isomorphic, true);
  assert.ok(mapping);
  // 验证映射保持邻接
  const a2 = new Set(g2.edges.flatMap((e) => [`${e.from},${e.to}`, `${e.to},${e.from}`]));
  for (const e of g1.edges) {
    const m1 = mapping![e.from]!;
    const m2 = mapping![e.to]!;
    assert.ok(a2.has(`${m1},${m2}`), `${m1},${m2} 应相邻`);
  }
});

test('iso 不同构（三角形 vs 路径）', () => {
  const g1: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const g2: GraphInput = {
    nodes: ['X', 'Y', 'Z'],
    edges: [
      { from: 'X', to: 'Y' },
      { from: 'Y', to: 'Z' },
    ],
  };
  assert.equal(graphIsomorphism(g1, g2).isomorphic, false);
});

test('iso 顶点数不同', () => {
  const g1: GraphInput = { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B' }] };
  const g2: GraphInput = { nodes: ['X', 'Y', 'Z'], edges: [{ from: 'X', to: 'Y' }] };
  assert.equal(graphIsomorphism(g1, g2).isomorphic, false);
});

test('iso 自同构（同图）', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(graphIsomorphism(g, g).isomorphic, true);
});

test('iso 边数不同', () => {
  const g1: GraphInput = { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }] };
  const g2: GraphInput = {
    nodes: ['X', 'Y', 'Z'],
    edges: [
      { from: 'X', to: 'Y' },
      { from: 'Y', to: 'Z' },
    ],
  };
  assert.equal(graphIsomorphism(g1, g2).isomorphic, false);
});

test('iso 空图同构', () => {
  assert.equal(
    graphIsomorphism({ nodes: [], edges: [] }, { nodes: [], edges: [] }).isomorphic,
    true,
  );
});

test('iso 钩子', () => {
  let res = 0;
  graphIsomorphism(
    { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B' }] },
    { nodes: ['X', 'Y'], edges: [{ from: 'X', to: 'Y' }] },
    { onResult: () => res++ },
  );
  assert.equal(res, 1);
});
