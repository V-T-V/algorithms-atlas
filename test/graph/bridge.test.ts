import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bridge, edgeKey, type GraphInput } from '../../src/algorithms/graph/bridge/impl.ts';

// 演示图：两个三角环由桥 2-3 相连 → 仅 1 桥
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

test('bridge 正确识别桥', () => {
  const { bridges } = bridge(G);
  assert.deepEqual(bridges, [edgeKey('2', '3')]);
});

test('bridge 简单链：所有边均为桥', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { bridges } = bridge(g);
  assert.deepEqual(bridges.sort(), [edgeKey('A', 'B'), edgeKey('B', 'C')].sort());
});

test('bridge 三角环：无桥', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.deepEqual(bridge(g).bridges, []);
});

test('bridge 空图与单点', () => {
  assert.deepEqual(bridge({ nodes: [], edges: [] }), { bridges: [] });
  assert.deepEqual(bridge({ nodes: ['X'], edges: [] }), { bridges: [] });
});

test('bridge 重边形成非桥', () => {
  // A-B 两条平行边：删一条仍连通，故无桥
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'B' },
    ],
  };
  assert.deepEqual(bridge(g).bridges, []);
});

test('bridge 钩子被调用', () => {
  const discovered: string[] = [];
  const bridgeEdges: string[] = [];
  bridge(G, {
    onDiscover: (v) => discovered.push(v),
    onBridge: (u, v) => bridgeEdges.push(edgeKey(u, v)),
  });
  assert.equal(discovered.length, 6);
  assert.deepEqual(bridgeEdges, [edgeKey('2', '3')]);
});
