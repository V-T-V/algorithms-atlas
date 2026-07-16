import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bellmanFord,
  reconstructPath,
  type GraphInput,
} from '../../src/algorithms/graph/bellman-ford/impl.ts';

const distOf = (r: ReturnType<typeof bellmanFord>, id: string): number =>
  r.dist.get(id) ?? Infinity;

/** 无环、含负权但无负环的有向图。 */
const DAG_NEG: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: -3 },
    { from: 'C', to: 'D', weight: 2 },
  ],
  directed: true,
};

test('bellman-ford 含负权（无负环）正确最短距离', () => {
  const r = bellmanFord(DAG_NEG, 'A');
  assert.equal(r.hasNegativeCycle, false);
  assert.equal(distOf(r, 'A'), 0);
  assert.equal(distOf(r, 'B'), 4);
  assert.equal(distOf(r, 'C'), 1); // A→B→C = 4 + (-3) = 1
  assert.equal(distOf(r, 'D'), 3); // ...→C→D = 1 + 2 = 3
});

test('bellman-ford 路径回溯', () => {
  const r = bellmanFord(DAG_NEG, 'A');
  assert.deepEqual(reconstructPath(r.prev, 'A', 'D'), ['A', 'B', 'C', 'D']);
  assert.deepEqual(reconstructPath(r.prev, 'A', 'C'), ['A', 'B', 'C']);
  assert.deepEqual(reconstructPath(r.prev, 'A', 'A'), ['A']);
});

test('bellman-ford 不可达节点为 ∞', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
    directed: true,
  };
  const r = bellmanFord(g, 'A');
  assert.equal(distOf(r, 'B'), 1);
  assert.equal(distOf(r, 'C'), Infinity);
  assert.equal(reconstructPath(r.prev, 'A', 'C'), null);
});

test('bellman-ford 检测负环', () => {
  // B→C→B = -3 + 1 = -2 < 0，从 A 可达
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -3 },
      { from: 'C', to: 'B', weight: 1 },
    ],
    directed: true,
  };
  const r = bellmanFord(g, 'A');
  assert.equal(r.hasNegativeCycle, true);
  assert.ok(r.negative.has('B'));
  assert.ok(r.negative.has('C'));
  // 受负环影响的节点距离置 -∞
  assert.equal(distOf(r, 'B'), -Infinity);
  assert.equal(distOf(r, 'C'), -Infinity);
});

test('bellman-ford 负环不可达则不报', () => {
  // 负环在 B-C-D，但它们与 A 不连通
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'D', weight: -3 },
      { from: 'D', to: 'B', weight: 1 },
    ],
    directed: true,
  };
  const r = bellmanFord(g, 'A');
  assert.equal(r.hasNegativeCycle, false);
  assert.equal(distOf(r, 'A'), 0);
  assert.equal(distOf(r, 'B'), Infinity);
});

test('bellman-ford 不存在源点', () => {
  const r = bellmanFord(DAG_NEG, 'Z');
  assert.equal(r.hasNegativeCycle, false);
  for (const n of DAG_NEG.nodes) assert.equal(distOf(r, n), Infinity);
});

test('bellman-ford 与 dijkstra 无负权时一致（对照）', () => {
  // 用一组非负权图，手动验证
  const g: GraphInput = {
    nodes: ['S', 'A', 'B', 'T'],
    edges: [
      { from: 'S', to: 'A', weight: 1 },
      { from: 'A', to: 'B', weight: 2 },
      { from: 'S', to: 'B', weight: 4 },
      { from: 'B', to: 'T', weight: 1 },
    ],
    directed: true,
  };
  const r = bellmanFord(g, 'S');
  assert.equal(distOf(r, 'T'), 4); // S→A→B→T = 1+2+1
  assert.deepEqual(reconstructPath(r.prev, 'S', 'T'), ['S', 'A', 'B', 'T']);
});

test('bellman-ford 钩子被调用', () => {
  let rounds = 0;
  let relaxImproved = 0;
  let done = false;
  bellmanFord(DAG_NEG, 'A', {
    onRound: () => rounds++,
    onRelax: (_f, _t, _nd, imp) => {
      if (imp) relaxImproved++;
    },
    onDone: () => (done = true),
  });
  // V-1 = 3 轮
  assert.equal(rounds, 3);
  assert.ok(relaxImproved >= 3, '应发生多次松弛更新');
  assert.equal(done, true);
});

test('bellman-ford 无向图负权边必形成负环', () => {
  // 无向图里任一负权边都构成 2-环（走过去再走回来），必为负环
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [{ from: 'A', to: 'B', weight: -1 }],
    directed: false,
  };
  const r = bellmanFord(g, 'A');
  assert.equal(r.hasNegativeCycle, true);
});
