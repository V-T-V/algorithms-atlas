import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bridgeArticulation,
  edgeKey,
  type GraphInput,
} from '../../src/algorithms/graph/bridge-articulation/impl.ts';

// 演示图：两个三角环由桥 2-3 相连 → 仅 1 桥 + 2 割点 (2,3)
const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' }, // 桥
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
};

test('bridge-articulation 正确识别桥与割点', () => {
  const { bridges, articulation } = bridgeArticulation(G);
  // 桥：2-3
  assert.deepEqual(bridges, [edgeKey('2', '3')]);
  // 割点：2（删 2 断开三角与 3-4-5）与 3（删 3 断开 4、5）
  assert.deepEqual(articulation, ['2', '3']);
});

test('bridge-articulation 简单链：两端为割点，两条边为桥', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { bridges, articulation } = bridgeArticulation(g);
  assert.deepEqual(bridges.sort(), [edgeKey('A', 'B'), edgeKey('B', 'C')].sort());
  // 中间节点 B 是割点
  assert.deepEqual(articulation, ['B']);
});

test('bridge-articulation 三角环：无桥无割点', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { bridges, articulation } = bridgeArticulation(g);
  assert.deepEqual(bridges, []);
  assert.deepEqual(articulation, []);
});

test('bridge-articulation 星形图：中心为割点（根 ≥2 子树）', () => {
  const g: GraphInput = {
    nodes: ['C', 'A', 'B', 'D'],
    edges: [
      { from: 'C', to: 'A' },
      { from: 'C', to: 'B' },
      { from: 'C', to: 'D' },
    ],
  };
  const { bridges, articulation } = bridgeArticulation(g);
  assert.deepEqual(articulation, ['C']);
  assert.equal(bridges.length, 3);
});

test('bridge-articulation 空图与单点', () => {
  assert.deepEqual(bridgeArticulation({ nodes: [], edges: [] }), {
    bridges: [],
    articulation: [],
  });
  assert.deepEqual(bridgeArticulation({ nodes: ['X'], edges: [] }), {
    bridges: [],
    articulation: [],
  });
});

test('bridge-articulation 钩子被调用', () => {
  const discovered: string[] = [];
  const bridgeEdges: string[] = [];
  const arts: string[] = [];
  bridgeArticulation(G, {
    onDiscover: (v) => discovered.push(v),
    onBridge: (u, v) => bridgeEdges.push(edgeKey(u, v)),
    onArticulation: (u) => arts.push(u),
  });
  assert.equal(discovered.length, 6);
  assert.deepEqual(bridgeEdges, [edgeKey('2', '3')]);
  assert.deepEqual([...arts].sort(), ['2', '3']);
});

test('bridge-articulation low 在回边处更新', () => {
  let updates = 0;
  bridgeArticulation(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }, // 回边触发 low 更新
      ],
    },
    { onUpdateLow: () => updates++ },
  );
  assert.ok(updates >= 1, '回边应触发 low 更新');
});
