import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minCut, type GraphInput } from '../../src/algorithms/network/min-cut/impl.ts';

// 经典 4 节点图：最小割 = 2，一侧 {A}
const G: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

test('min-cut 经典图最小割 = 2', () => {
  const r = minCut(G);
  assert.equal(r.cutValue, 2);
  // 一侧应为 {A} 或其补集 {B,C,D}，二者皆正确
  const ok = r.side.join(',') === 'A' || r.side.join(',') === 'B,C,D';
  assert.ok(ok, `一侧应为 {A} 或 {B,C,D}，实际 side=${r.side.join(',')}`);
});

test('min-cut 两侧互为补集', () => {
  const r = minCut(G);
  const all = new Set(G.nodes);
  const side = new Set(r.side);
  const other = new Set(r.otherSide);
  assert.deepEqual([...side].sort(), [...all].filter((x) => side.has(x)).sort());
  assert.deepEqual([...other].sort(), [...all].filter((x) => !side.has(x)).sort());
  // 并集 = 全部节点
  const union = new Set([...side, ...other]);
  assert.equal(union.size, G.nodes.length);
});

test('min-cut 割边权值和等于 cutValue', () => {
  const r = minCut(G);
  const sideSet = new Set(r.side);
  let sum = 0;
  for (const e of G.edges) {
    if (sideSet.has(e.from) !== sideSet.has(e.to)) sum += e.weight;
  }
  assert.equal(sum, r.cutValue);
});

test('min-cut 简单桥图', () => {
  // 两个三角形由一条权 5 的桥相连；三角形内边权 3 → 孤立单点需 6，故最小割 = 5（割桥）
  const g: GraphInput = {
    nodes: ['a', 'b', 'c', 'x', 'y', 'z'],
    edges: [
      { from: 'a', to: 'b', weight: 3 },
      { from: 'b', to: 'c', weight: 3 },
      { from: 'a', to: 'c', weight: 3 },
      { from: 'c', to: 'x', weight: 5 }, // 桥
      { from: 'x', to: 'y', weight: 3 },
      { from: 'y', to: 'z', weight: 3 },
      { from: 'x', to: 'z', weight: 3 },
    ],
  };
  const r = minCut(g);
  assert.equal(r.cutValue, 5);
});

test('min-cut 完全图 K4（边权 1）最小割 = 3', () => {
  const nodes = ['a', 'b', 'c', 'd'];
  const edges: Array<{ from: string; to: string; weight: number }> = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push({ from: nodes[i]!, to: nodes[j]!, weight: 1 });
    }
  }
  const r = minCut({ nodes, edges });
  // K_n 边权 1 的最小割 = n-1（孤立一个点需要割 n-1 条边）
  assert.equal(r.cutValue, 3);
  // 一侧应恰为单个节点
  assert.equal(r.side.length, 1);
});

test('min-cut 平行边累加', () => {
  // A-B 两条权 1 边 + 一条权 2：割 {A} 需割 1+1=2，割桥需 2，最小割 = 2
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
    ],
  };
  const r = minCut(g);
  assert.equal(r.cutValue, 2);
});

test('min-cut 空图 / 单节点', () => {
  assert.equal(minCut({ nodes: [], edges: [] }).cutValue, 0);
  assert.equal(minCut({ nodes: ['s'], edges: [] }).cutValue, 0);
});

test('min-cut 不连通图最小割 = 0', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'C', to: 'D', weight: 4 },
    ],
  };
  const r = minCut(g);
  assert.equal(r.cutValue, 0, '不连通分量间割为 0');
});

test('min-cut 钩子被调用', () => {
  let improves = 0;
  let contracts = 0;
  minCut(G, {
    onImprove: () => improves++,
    onContract: () => contracts++,
  });
  assert.ok(contracts > 0, '应发生至少一次收缩');
  assert.ok(improves > 0, '应至少更新一次最优割');
});
