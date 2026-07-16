import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spfa, reconstructPath, type GraphInput } from '../../src/algorithms/graph/spfa/impl.ts';

// 演示图（含负权边 B→A=-1）
const G: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  directed: true,
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'A', weight: -1 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

const dist = (r: ReturnType<typeof spfa>, id: string): number => r.dist.get(id) ?? Infinity;

test('spfa 含负权边的最短距离', () => {
  const r = spfa(G, 'S');
  // S=0, B=2, A=1(经 S→B→A), C=6(A→C), D=8(C→D), T=11(D→T)
  assert.equal(dist(r, 'S'), 0);
  assert.equal(dist(r, 'A'), 1);
  assert.equal(dist(r, 'B'), 2);
  assert.equal(dist(r, 'C'), 6);
  assert.equal(dist(r, 'D'), 8);
  assert.equal(dist(r, 'T'), 11);
  assert.equal(r.hasNegativeCycle, false);
});

test('spfa 最短路径回溯', () => {
  const r = spfa(G, 'S');
  const p = reconstructPath(r.prev, 'S', 'T');
  // S→B→A→C→D→T
  assert.deepEqual(p, ['S', 'B', 'A', 'C', 'D', 'T']);
});

test('spfa 不可达节点为 ∞', () => {
  const g: GraphInput = {
    nodes: ['X', 'Y'],
    directed: true,
    edges: [{ from: 'X', to: 'Y', weight: 5 }],
  };
  const r = spfa(g, 'Y'); // 从 Y 出发，X 不可达
  assert.equal(dist(r, 'X'), Infinity);
  assert.equal(dist(r, 'Y'), 0);
});

test('spfa 检测负权环', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    directed: true,
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: -3 },
      { from: 'C', to: 'B', weight: 1 }, // B→C→B 总权 -2，负环
    ],
  };
  const r = spfa(g, 'A');
  assert.equal(r.hasNegativeCycle, true);
});

test('spfa 非负权图与 Dijkstra 一致', () => {
  const g: GraphInput = {
    nodes: ['S', 'A', 'B', 'T'],
    directed: true,
    edges: [
      { from: 'S', to: 'A', weight: 1 },
      { from: 'S', to: 'B', weight: 5 },
      { from: 'A', to: 'B', weight: 2 },
      { from: 'A', to: 'T', weight: 6 },
      { from: 'B', to: 'T', weight: 1 },
    ],
  };
  const r = spfa(g, 'S');
  assert.equal(dist(r, 'T'), 4); // S→A→B→T = 1+2+1
  assert.equal(r.hasNegativeCycle, false);
});

test('spfa 单节点', () => {
  const r = spfa({ nodes: ['X'], directed: true, edges: [] }, 'X');
  assert.equal(dist(r, 'X'), 0);
});

test('spfa 钩子被调用', () => {
  let enq = 0;
  let deq = 0;
  let relax = 0;
  let doneNeg: boolean | null = null;
  spfa(G, 'S', {
    onEnqueue: () => enq++,
    onDequeue: () => deq++,
    onRelax: () => relax++,
    onDone: (neg) => {
      doneNeg = neg;
    },
  });
  assert.ok(enq >= 1, '至少入队一次');
  assert.ok(deq >= 1, '至少出队一次');
  assert.ok(relax >= 1, '至少松弛一次');
  assert.equal(doneNeg, false);
});

test('spfa 负环触发 onNegativeCycle', () => {
  let negNode: string | null = null;
  spfa(
    {
      nodes: ['A', 'B', 'C'],
      directed: true,
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'B', to: 'C', weight: -3 },
        { from: 'C', to: 'B', weight: 1 },
      ],
    },
    'A',
    { onNegativeCycle: (n) => (negNode = n) },
  );
  assert.ok(negNode !== null, '负环应触发 onNegativeCycle');
});
