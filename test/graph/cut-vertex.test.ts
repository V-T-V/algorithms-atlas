import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cutVertex, type GraphInput } from '../../src/algorithms/graph/cut-vertex/impl.ts';

// 演示图：两个三角环由桥 2-3 相连 → 割点 2, 3
const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

test('cut-vertex 正确识别割点', () => {
  const { cutVertices } = cutVertex(G);
  assert.deepEqual(cutVertices, ['2', '3']);
});

test('cut-vertex 简单链：中间节点为割点', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.deepEqual(cutVertex(g).cutVertices, ['B']);
});

test('cut-vertex 三角环：无割点', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.deepEqual(cutVertex(g).cutVertices, []);
});

test('cut-vertex 星形图：中心为割点（根 ≥2 子树）', () => {
  const g: GraphInput = {
    nodes: ['C', 'A', 'B', 'D'],
    edges: [
      { from: 'C', to: 'A' },
      { from: 'C', to: 'B' },
      { from: 'C', to: 'D' },
    ],
  };
  assert.deepEqual(cutVertex(g).cutVertices, ['C']);
});

test('cut-vertex 空图与单点', () => {
  assert.deepEqual(cutVertex({ nodes: [], edges: [] }), { cutVertices: [] });
  assert.deepEqual(cutVertex({ nodes: ['X'], edges: [] }), { cutVertices: [] });
});

test('cut-vertex 钩子被调用', () => {
  const discovered: string[] = [];
  const cuts: string[] = [];
  cutVertex(G, {
    onDiscover: (v) => discovered.push(v),
    onCutVertex: (u) => cuts.push(u),
  });
  assert.equal(discovered.length, 6);
  assert.deepEqual([...cuts].sort(), ['2', '3']);
});
