import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aStar, reconstructPath, type GraphInput } from '../../src/algorithms/graph/a-star/impl.ts';

// 与 dijkstra 同图：已知最短距离，便于断言
const G: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'A', weight: 1 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};

const distOf = (r: ReturnType<typeof aStar>, id: string): number => r.dist.get(id) ?? Infinity;

// 启发函数坐标（与 trace.ts 一致），欧氏距离 ×10
const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.12, y: 0.5 },
  A: { x: 0.38, y: 0.2 },
  B: { x: 0.38, y: 0.78 },
  C: { x: 0.62, y: 0.2 },
  D: { x: 0.62, y: 0.78 },
  T: { x: 0.9, y: 0.5 },
};
const euclid = (n: string, t: string): number => {
  const a = POS[n];
  const b = POS[t];
  if (!a || !b) return 0;
  const dx = (a.x - b.x) * 10;
  const dy = (a.y - b.y) * 10;
  return Math.sqrt(dx * dx + dy * dy);
};

test('a-star h=0 退化为 Dijkstra，得到正确最短距离', () => {
  const r = aStar(G, 'S', 'T', () => 0);
  assert.equal(r.found, true);
  assert.equal(distOf(r, 'S'), 0);
  assert.equal(distOf(r, 'B'), 2);
  assert.equal(distOf(r, 'A'), 3); // S→B→A = 3
  assert.equal(distOf(r, 'C'), 8); // S→B→A→C = 8
  assert.equal(distOf(r, 'D'), 10); // ...→C→D = 10
  assert.equal(distOf(r, 'T'), 13); // ...→D→T = 13
});

test('a-star 带启发函数仍得最优路径（admissible h 不破坏最优性）', () => {
  const r = aStar(G, 'S', 'T', euclid);
  assert.equal(r.found, true);
  assert.equal(distOf(r, 'T'), 13); // 最优解不变
  assert.deepEqual(reconstructPath(r.prev, 'S', 'T'), ['S', 'B', 'A', 'C', 'D', 'T']);
});

test('a-star 路径回溯', () => {
  const r = aStar(G, 'S', 'A', () => 0);
  assert.deepEqual(reconstructPath(r.prev, 'S', 'A'), ['S', 'B', 'A']);
  assert.deepEqual(reconstructPath(r.prev, 'S', 'S'), ['S']);
});

test('a-star 起点即目标', () => {
  const r = aStar(G, 'S', 'S', euclid);
  assert.equal(r.found, true);
  assert.equal(distOf(r, 'S'), 0);
});

test('a-star 目标不可达', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B', weight: 1 }] };
  const r = aStar(g, 'A', 'C', () => 0);
  assert.equal(r.found, false);
  assert.equal(distOf(r, 'B'), 1);
  assert.equal(distOf(r, 'C'), Infinity);
  assert.equal(reconstructPath(r.prev, 'A', 'C'), null);
});

test('a-star 启发函数加速：展开节点不多于 h=0', () => {
  let poppedH0 = 0;
  let poppedH = 0;
  aStar(G, 'S', 'T', () => 0, { onPop: () => poppedH0++ });
  aStar(G, 'S', 'T', euclid, { onPop: () => poppedH++ });
  // 带启发应展开更少或相等节点（聚焦目标方向）
  assert.ok(poppedH <= poppedH0, `h 应使展开更少: ${poppedH} vs ${poppedH0}`);
});

test('a-star 钩子被调用', () => {
  const pops: string[] = [];
  let relaxImproved = 0;
  const r = aStar(G, 'S', 'T', () => 0, {
    onPop: (n) => pops.push(n),
    onRelax: (_f, _t, _g, _f2, imp) => {
      if (imp) relaxImproved++;
    },
  });
  assert.equal(pops[0], 'S');
  assert.ok(relaxImproved >= 5, '应发生多次松弛更新');
  assert.equal(r.found, true);
});
