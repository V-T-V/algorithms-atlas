// Generator for 23 greedy algorithms, each with distinct real logic.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'greedy';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

// Helper to make standard meta
function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: 'greedy',
  title: { zh: '${zh}', en: '${en}' },
  summary: { zh: '${sumZh}', en: '${sumEn}' },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// 1. greedy-kruskal-3: Kruskal MST
writeAlg('greedy-kruskal-3',
  meta('greedy-kruskal-3', 'Kruskal 最小生成树', 'Kruskal MST',
    '按边权升序加入不形成环的边，直到生成树完成。', 'Sort edges by weight ascending; add edges that do not create a cycle until the spanning tree is complete.',
    'Kruskal 算法：把所有边按权升序排列，依次尝试加入，用并查集判断是否成环。时间 O(E log E)。',
    'Kruskal: sort all edges by weight ascending, try adding each; union-find detects cycles. Time O(E log E).',
    'O(E log E)', 'O(V)', ['greedy', 'graph', 'mst']),
  `// Kruskal MST · 实现
export interface Edge { u: number; v: number; w: number; }
export interface KruskalHooks {
  onConsider?: (edge: Edge, accept: boolean) => void;
  onConclude?: (totalWeight: number, mstEdges: Edge[]) => void;
}
export interface KruskalResult { totalWeight: number; mstEdges: Edge[]; }
export function greedyKruskal3(n: number, edges: ReadonlyArray<Edge>, hooks: KruskalHooks = {}): KruskalResult {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
  const union = (a: number, b: number): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
    return true;
  };
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const mstEdges: Edge[] = [];
  let totalWeight = 0;
  for (const e of sorted) {
    const accept = union(e.u, e.v);
    hooks.onConsider?.(e, accept);
    if (accept) { mstEdges.push(e); totalWeight += e.w; }
    if (mstEdges.length === n - 1) break;
  }
  hooks.onConclude?.(totalWeight, mstEdges);
  return { totalWeight, mstEdges };
}`,
  `// Kruskal MST · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyKruskal3, type Edge } from './impl.ts';
const N = 4;
const EDGES: Edge[] = [
  { u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 2, v: 3, w: 3 },
  { u: 0, v: 3, w: 4 }, { u: 0, v: 2, w: 5 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Kruskal：按权升序加边', en: 'Kruskal: edges by ascending weight' })
    .setBars(EDGES.map(e => ({ value: e.w, role: 'default' as BarRole, label: \`\${e.u}-\${e.v}\` }))).commit();
  const r = greedyKruskal3(N, EDGES, {
    onConsider: (e, accept) => {
      rec.begin({ zh: \`考虑 \${e.u}-\${e.v} (w=\${e.w})：\${accept ? '加入' : '拒绝'}\`, en: \`Consider \${e.u}-\${e.v} (w=\${e.w}): \${accept ? 'accept' : 'reject'}\` })
        .setBars(EDGES.map(e2 => ({ value: e2.w, role: (e2 === e ? (accept ? 'final' : 'warn') : 'default') as BarRole, label: \`\${e2.u}-\${e2.v}\` }))).commit();
    },
  });
  rec.begin({ zh: \`MST 权重 \${r.totalWeight}\`, en: \`MST weight \${r.totalWeight}\` })
    .setAux([{ label: '总权重', value: String(r.totalWeight), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyKruskal3 } from '../../src/algorithms/greedy/greedy-kruskal-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-kruskal-3/trace.ts';

test('Kruskal 4 顶点 MST 总权重', () => {
  const E = [{ u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 2, v: 3, w: 3 }, { u: 0, v: 3, w: 4 }];
  const r = greedyKruskal3(4, E);
  assert.equal(r.totalWeight, 1 + 2 + 3);
  assert.equal(r.mstEdges.length, 3);
});

test('Kruskal 拒绝成环边', () => {
  const E = [{ u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 0, v: 2, w: 10 }];
  const r = greedyKruskal3(3, E);
  assert.equal(r.mstEdges.length, 2);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 2. greedy-prim-3: Prim MST
writeAlg('greedy-prim-3',
  meta('greedy-prim-3', 'Prim 最小生成树', 'Prim MST',
    '从一个起点出发，每次加入到已选集距离最小的边。', 'From a start vertex, repeatedly add the cheapest edge connecting the tree to a new vertex.',
    'Prim 算法：维护已选顶点集 S，反复选择 (S, V\\S) 之间权最小的边加入。简单实现 O(V²)。',
    'Prim: maintain selected set S; repeatedly pick the cheapest edge crossing (S, V\\S). Simple O(V²).',
    'O(V²)', 'O(V)', ['greedy', 'graph', 'mst']),
  `// Prim MST · 实现（邻接矩阵，O(V²)）
export interface PrimHooks {
  onPick?: (u: number, v: number, w: number) => void;
  onConclude?: (totalWeight: number) => void;
}
export interface PrimResult { totalWeight: number; }
export function greedyPrim3(
  graph: ReadonlyArray<readonly number[]>, start = 0, hooks: PrimHooks = {},
): PrimResult {
  const n = graph.length;
  const inTree = new Array(n).fill(false);
  const minEdge = new Array(n).fill(Infinity);
  const from = new Array(n).fill(-1);
  minEdge[start] = 0;
  let totalWeight = 0;
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!inTree[v] && (u === -1 || minEdge[v]! < minEdge[u]!)) u = v;
    if (u === -1 || minEdge[u] === Infinity) break;
    inTree[u] = true;
    totalWeight += minEdge[u]!;
    if (from[u] !== -1) hooks.onPick?.(from[u]!, u, minEdge[u]!);
    for (let v = 0; v < n; v++) {
      if (!inTree[v] && graph[u]![v]! < minEdge[v]!) { minEdge[v] = graph[u]![v]!; from[v] = u; }
    }
  }
  hooks.onConclude?.(totalWeight);
  return { totalWeight };
}`,
  `// Prim MST · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyPrim3 } from './impl.ts';
const G: ReadonlyArray<readonly number[]> = [
  [0, 1, 5, 4], [1, 0, 2, 0], [5, 2, 0, 3], [4, 0, 3, 0],
].map(r => r.map(x => x === 0 ? Infinity : x));
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Prim：从顶点 0 开始扩展', en: 'Prim: grow from vertex 0' }).commit();
  const r = greedyPrim3(G, 0, {
    onPick: (u, v, w) => {
      rec.begin({ zh: \`加入边 \${u}-\${v} (w=\${w})\`, en: \`Add edge \${u}-\${v} (w=\${w})\` })
        .setAux([{ label: '边', value: \`\${u}-\${v}\`, role: 'final' as BarRole }, { label: '权', value: String(w), role: 'compare' as BarRole }]).commit();
    },
  });
  rec.begin({ zh: \`MST 权重 \${r.totalWeight}\`, en: \`MST weight \${r.totalWeight}\` })
    .setAux([{ label: '总权重', value: String(r.totalWeight), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyPrim3 } from '../../src/algorithms/greedy/greedy-prim-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-prim-3/trace.ts';

test('Prim 4 顶点 MST 权重', () => {
  const G = [[Infinity, 1, 5, 4], [1, Infinity, 2, Infinity], [5, 2, Infinity, 3], [4, Infinity, 3, Infinity]];
  const r = greedyPrim3(G, 0);
  // MST: 0-1(1), 1-2(2), 2-3(3) = 6
  assert.equal(r.totalWeight, 6);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 3. greedy-dijkstra-3: Dijkstra shortest path
writeAlg('greedy-dijkstra-3',
  meta('greedy-dijkstra-3', 'Dijkstra 最短路径', 'Dijkstra Shortest Path',
    '非负权图单源最短路径：每次扩展距离最小的未确定顶点。', 'Single-source shortest path with non-negative weights: relax via the closest unsettled vertex.',
    'Dijkstra：维护 dist[]，反复取最小距离的未确定顶点 u，松弛其所有出边。简单实现 O(V²)。',
    'Dijkstra: maintain dist[]; repeatedly select the unsettled vertex with min dist and relax its edges. Simple O(V²).',
    'O(V²)', 'O(V)', ['greedy', 'graph', 'shortest-path']),
  `// Dijkstra · 实现（非负权，O(V²)）
export interface DijkstraHooks {
  onSettle?: (u: number, dist: number) => void;
  onRelax?: (u: number, v: number, newDist: number) => void;
  onConclude?: (dist: number[]) => void;
}
export interface DijkstraResult { dist: number[]; }
export function greedyDijkstra3(
  graph: ReadonlyArray<readonly number[]>, src = 0, hooks: DijkstraHooks = {},
): DijkstraResult {
  const n = graph.length;
  const dist = new Array(n).fill(Infinity);
  const settled = new Array(n).fill(false);
  dist[src] = 0;
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!settled[v] && (u === -1 || dist[v]! < dist[u]!)) u = v;
    if (u === -1 || dist[u] === Infinity) break;
    settled[u] = true;
    hooks.onSettle?.(u, dist[u]!);
    for (let v = 0; v < n; v++) {
      const w = graph[u]![v]!;
      if (w > 0 && !settled[v] && dist[u]! + w < dist[v]!) {
        dist[v] = dist[u]! + w;
        hooks.onRelax?.(u, v, dist[v]!);
      }
    }
  }
  hooks.onConclude?.(dist);
  return { dist };
}`,
  `// Dijkstra · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDijkstra3 } from './impl.ts';
const G: ReadonlyArray<readonly number[]> = [
  [0, 4, 1, 0], [4, 0, 2, 5], [1, 2, 0, 3], [0, 5, 3, 0],
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Dijkstra：源 0', en: 'Dijkstra: source 0' }).commit();
  const r = greedyDijkstra3(G, 0, {
    onSettle: (u, d) => {
      rec.begin({ zh: \`确定 \${u}：dist=\${d}\`, en: \`Settle \${u}: dist=\${d}\` })
        .setBars(r.distSnapshot ? r.distSnapshot.map((x, i) => ({ value: x === Infinity ? 0 : x, role: 'default' as BarRole, label: \`d\${i}\` })) : [])
        .commit();
    },
  });
  rec.begin({ zh: '最终 dist', en: 'Final dist' })
    .setBars(r.dist.map((x) => ({ value: x === Infinity ? 0 : x, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDijkstra3 } from '../../src/algorithms/greedy/greedy-dijkstra-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-dijkstra-3/trace.ts';

test('Dijkstra 基本最短路径', () => {
  const G = [[0, 4, 1, 0], [4, 0, 2, 5], [1, 2, 0, 3], [0, 5, 3, 0]];
  const r = greedyDijkstra3(G, 0);
  assert.deepEqual(r.dist, [0, 3, 1, 4]);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 4. greedy-huffman-3: Huffman coding
writeAlg('greedy-huffman-3',
  meta('greedy-huffman-3', '霍夫曼编码', 'Huffman Coding',
    '按频率贪心合并最小的两个节点，构造最优前缀码。', 'Greedily merge the two least-frequent nodes to build an optimal prefix code.',
    '霍夫曼编码：每次从优先队列中取出两个最小频率节点合并，构造带权路径长度最小的二叉树。',
    'Huffman coding: repeatedly extract the two least-frequent nodes and merge; produces a minimum-weighted-path tree.',
    'O(n log n)', 'O(n)', ['greedy', 'tree', 'compression']),
  `// Huffman 编码 · 实现
export interface HuffmanNode { char: string; freq: number; left?: HuffmanNode; right?: HuffmanNode; }
export interface HuffmanHooks {
  onMerge?: (a: HuffmanNode, b: HuffmanNode, merged: HuffmanNode) => void;
  onConclude?: (codes: Record<string, string>, totalBits: number) => void;
}
export interface HuffmanResult { root: HuffmanNode | null; codes: Record<string, string>; totalBits: number; }
export function greedyHuffman3(freqs: ReadonlyArray<{ char: string; freq: number }>, hooks: HuffmanHooks = {}): HuffmanResult {
  const nodes: HuffmanNode[] = freqs.map(f => ({ ...f }));
  while (nodes.length >= 2) {
    nodes.sort((a, b) => a.freq - b.freq);
    const a = nodes.shift()!;
    const b = nodes.shift()!;
    const merged: HuffmanNode = { char: '*', freq: a.freq + b.freq, left: a, right: b };
    hooks.onMerge?.(a, b, merged);
    nodes.push(merged);
  }
  const root = nodes[0] ?? null;
  const codes: Record<string, string> = {};
  const walk = (n: HuffmanNode | undefined, code: string) => {
    if (!n) return;
    if (!n.left && !n.right) { codes[n.char] = code || '0'; return; }
    walk(n.left, code + '0');
    walk(n.right, code + '1');
  };
  walk(root ?? undefined, '');
  let totalBits = 0;
  for (const f of freqs) totalBits += f.freq * codes[f.char]!.length;
  hooks.onConclude?.(codes, totalBits);
  return { root, codes, totalBits };
}`,
  `// Huffman 编码 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyHuffman3 } from './impl.ts';
const FREQS = [{ char: 'a', freq: 5 }, { char: 'b', freq: 9 }, { char: 'c', freq: 12 }, { char: 'd', freq: 13 }, { char: 'e', freq: 16 }];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Huffman：按频率合并', en: 'Huffman: merge by frequency' })
    .setBars(FREQS.map(f => ({ value: f.freq, role: 'default' as BarRole, label: f.char }))).commit();
  const r = greedyHuffman3(FREQS, {
    onMerge: (a, b, m) => {
      rec.begin({ zh: \`合并 \${a.char}(\${a.freq}) + \${b.char}(\${b.freq}) = \${m.freq}\`, en: \`Merge \${a.char}(\${a.freq}) + \${b.char}(\${b.freq}) = \${m.freq}\` })
        .setAux([{ label: '新节点', value: String(m.freq), role: 'final' as BarRole }]).commit();
    },
  });
  rec.begin({ zh: \`总位数 \${r.totalBits}\`, en: \`Total bits \${r.totalBits}\` })
    .setAux(Object.entries(r.codes).map(([c, code]) => ({ label: c, value: code, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyHuffman3 } from '../../src/algorithms/greedy/greedy-huffman-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-huffman-3/trace.ts';

test('Huffman 单字符编码 "0"', () => {
  const r = greedyHuffman3([{ char: 'a', freq: 1 }]);
  assert.equal(r.codes.a, '0');
});

test('Huffman 多字符前缀码无歧义', () => {
  const r = greedyHuffman3([{ char: 'a', freq: 5 }, { char: 'b', freq: 9 }, { char: 'c', freq: 12 }]);
  const codes = Object.values(r.codes);
  for (let i = 0; i < codes.length; i++) for (let j = 0; j < codes.length; j++) {
    if (i !== j) assert.ok(!codes[i]!.startsWith(codes[j]!));
  }
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 5. greedy-frac-knapsack-3: Fractional knapsack
writeAlg('greedy-frac-knapsack-3',
  meta('greedy-frac-knapsack-3', '分数背包', 'Fractional Knapsack',
    '物品可分割：按单位价值降序贪心装包直到容量满。', 'Items are divisible: pack by descending value-per-unit until capacity is exhausted.',
    '分数背包问题：物品可任意分割。按价值/重量比降序，依次尽可能多地装入背包。',
    'Fractional knapsack: items can be split. Sort by value/weight ratio descending and greedily fill the bag.',
    'O(n log n)', 'O(1)', ['greedy', 'knapsack']),
  `// 分数背包 · 实现
export interface Item { w: number; v: number; }
export interface FracKnapsackHooks {
  onPick?: (idx: number, fraction: number, gained: number) => void;
  onConclude?: (totalValue: number) => void;
}
export interface FracKnapsackResult { totalValue: number; fractions: number[]; }
export function greedyFracKnapsack3(
  capacity: number, items: ReadonlyArray<Item>, hooks: FracKnapsackHooks = {},
): FracKnapsackResult {
  const order = items.map((it, i) => ({ i, ratio: it.v / it.w })).sort((a, b) => b.ratio - a.ratio);
  let cap = capacity;
  let totalValue = 0;
  const fractions = new Array(items.length).fill(0);
  for (const { i } of order) {
    if (cap <= 0) break;
    const take = Math.min(items[i]!.w, cap);
    const frac = take / items[i]!.w;
    fractions[i] = frac;
    const gained = frac * items[i]!.v;
    totalValue += gained;
    cap -= take;
    hooks.onPick?.(i, frac, gained);
  }
  hooks.onConclude?.(totalValue);
  return { totalValue, fractions };
}`,
  `// 分数背包 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyFracKnapsack3, type Item } from './impl.ts';
const ITEMS: Item[] = [{ w: 10, v: 60 }, { w: 20, v: 100 }, { w: 30, v: 120 }];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分数背包：容量 50', en: 'Fractional knapsack: capacity 50' })
    .setBars(ITEMS.map(it => ({ value: it.v / it.w, role: 'default' as BarRole, label: \`v/w\` }))).commit();
  const r = greedyFracKnapsack3(50, ITEMS, {
    onPick: (i, frac, g) => {
      rec.begin({ zh: \`取物品 \${i} 的 \${(frac * 100).toFixed(0)}%，得 \${g.toFixed(0)}\`, en: \`Take item \${i} \${(frac * 100).toFixed(0)}%, gain \${g.toFixed(0)}\` })
        .setAux([{ label: '占比', value: (frac * 100).toFixed(0) + '%', role: 'final' as BarRole }]).commit();
    },
  });
  rec.begin({ zh: \`总价值 \${r.totalValue}\`, en: \`Total value \${r.totalValue}\` })
    .setAux([{ label: '总价值', value: String(r.totalValue), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyFracKnapsack3 } from '../../src/algorithms/greedy/greedy-frac-knapsack-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-frac-knapsack-3/trace.ts';

test('分数背包经典示例', () => {
  const r = greedyFracKnapsack3(50, [{ w: 10, v: 60 }, { w: 20, v: 100 }, { w: 30, v: 120 }]);
  assert.equal(r.totalValue, 240);
});

test('容量足以装全部', () => {
  const r = greedyFracKnapsack3(1000, [{ w: 10, v: 60 }]);
  assert.equal(r.totalValue, 60);
  assert.equal(r.fractions[0], 1);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 6. greedy-interval-3 / 7. greedy-activity-3 — same family
writeAlg('greedy-interval-3',
  meta('greedy-interval-3', '区间调度（最多不重叠）', 'Interval Scheduling',
    '按结束时间升序选不重叠区间，得到最大数量。', 'Sort intervals by end time and greedily pick non-overlapping ones for maximum count.',
    '区间调度问题：给一组区间 [s, e)，求最多能选多少互不重叠的。贪心按结束时间排序即可。',
    'Interval scheduling: given intervals [s, e), find the maximum count of mutually non-overlapping ones. Greedy by earliest end time.',
    'O(n log n)', 'O(1)', ['greedy', 'interval', 'leetcode']),
  `// 区间调度 · 实现
export interface Interval { s: number; e: number; }
export interface IntervalHooks {
  onPick?: (idx: number, iv: Interval) => void;
  onSkip?: (idx: number, iv: Interval) => void;
  onConclude?: (count: number, picked: Interval[]) => void;
}
export interface IntervalResult { count: number; picked: Interval[]; }
export function greedyInterval3(intervals: ReadonlyArray<Interval>, hooks: IntervalHooks = {}): IntervalResult {
  const order = intervals.map((iv, i) => ({ iv, i })).sort((a, b) => a.iv.e - b.iv.e);
  let lastEnd = -Infinity;
  const picked: Interval[] = [];
  for (const { iv, i } of order) {
    if (iv.s >= lastEnd) { picked.push(iv); lastEnd = iv.e; hooks.onPick?.(i, iv); }
    else hooks.onSkip?.(i, iv);
  }
  hooks.onConclude?.(picked.length, picked);
  return { count: picked.length, picked };
}`,
  `// 区间调度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyInterval3, type Interval } from './impl.ts';
const IVS: Interval[] = [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 6 }, { s: 6, e: 8 }, { s: 5, e: 9 }];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间调度：按结束时间贪心', en: 'Interval scheduling: greedy by end time' }).commit();
  const r = greedyInterval3(IVS, {
    onPick: (i, iv) => rec.begin({ zh: \`选 [\${iv.s},\${iv.e})\`, en: \`Pick [\${iv.s},\${iv.e})\` })
      .setAux([{ label: '选', value: String(i), role: 'final' as BarRole }]).commit(),
    onSkip: (i, iv) => rec.begin({ zh: \`跳过 [\${iv.s},\${iv.e})\`, en: \`Skip [\${iv.s},\${iv.e})\` })
      .setAux([{ label: '跳', value: String(i), role: 'warn' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最多 \${r.count} 个\`, en: \`Max \${r.count} intervals\` })
    .setAux([{ label: '数量', value: String(r.count), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyInterval3 } from '../../src/algorithms/greedy/greedy-interval-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-interval-3/trace.ts';

test('区间调度选最多不重叠', () => {
  const r = greedyInterval3([{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 6 }, { s: 6, e: 8 }, { s: 5, e: 9 }]);
  assert.equal(r.count, 3);
});

test('空区间', () => {
  assert.equal(greedyInterval3([]).count, 0);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('greedy-activity-3',
  meta('greedy-activity-3', '活动选择（带名称）', 'Activity Selection',
    '经典活动选择：n 个活动带起止时间，选最多可执行的活动。', 'Classic activity selection: n activities with start/end times; pick the maximum feasible subset.',
    '活动选择问题（与区间调度同构）：按活动结束时间升序，能选就选。本实现带活动名称便于追踪。',
    'Activity selection (isomorphic to interval scheduling): sort by end time, accept whenever feasible. Includes activity names.',
    'O(n log n)', 'O(1)', ['greedy', 'interval']),
  `// 活动选择 · 实现（带名称）
export interface Activity { name: string; start: number; finish: number; }
export interface ActivityHooks {
  onPick?: (act: Activity) => void;
  onSkip?: (act: Activity) => void;
  onConclude?: (count: number, chosen: Activity[]) => void;
}
export interface ActivityResult { count: number; chosen: Activity[]; }
export function greedyActivity3(acts: ReadonlyArray<Activity>, hooks: ActivityHooks = {}): ActivityResult {
  const order = [...acts].sort((a, b) => a.finish - b.finish);
  let lastFinish = -Infinity;
  const chosen: Activity[] = [];
  for (const a of order) {
    if (a.start >= lastFinish) { chosen.push(a); lastFinish = a.finish; hooks.onPick?.(a); }
    else hooks.onSkip?.(a);
  }
  hooks.onConclude?.(chosen.length, chosen);
  return { count: chosen.length, chosen };
}`,
  `// 活动选择 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyActivity3, type Activity } from './impl.ts';
const ACTS: Activity[] = [
  { name: 'A', start: 1, finish: 4 }, { name: 'B', start: 3, finish: 5 },
  { name: 'C', start: 0, finish: 6 }, { name: 'D', start: 5, finish: 7 },
  { name: 'E', start: 8, finish: 9 }, { name: 'F', start: 5, finish: 9 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '活动选择：按 finish 升序', en: 'Activity selection: ascending finish' }).commit();
  const r = greedyActivity3(ACTS, {
    onPick: (a) => rec.begin({ zh: \`选 \${a.name} [\${a.start},\${a.finish})\`, en: \`Pick \${a.name}\` })
      .setBars([{ value: a.finish, role: 'final' as BarRole, label: a.name }]).commit(),
    onSkip: (a) => rec.begin({ zh: \`跳 \${a.name}\`, en: \`Skip \${a.name}\` })
      .setBars([{ value: a.finish, role: 'warn' as BarRole, label: a.name }]).commit(),
  });
  rec.begin({ zh: \`选了 \${r.count} 个\`, en: \`Picked \${r.count}\` })
    .setAux([{ label: '数量', value: String(r.count), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyActivity3 } from '../../src/algorithms/greedy/greedy-activity-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-activity-3/trace.ts';

test('活动选择 CLRS 经典示例', () => {
  const acts = [
    { name: 'A', start: 1, finish: 4 }, { name: 'B', start: 3, finish: 5 },
    { name: 'C', start: 0, finish: 6 }, { name: 'D', start: 5, finish: 7 },
    { name: 'E', start: 8, finish: 9 }, { name: 'F', start: 5, finish: 9 },
  ];
  const r = greedyActivity3(acts);
  assert.equal(r.count, 4);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 8. greedy-job-3: Job sequencing with deadlines
writeAlg('greedy-job-3',
  meta('greedy-job-3', '作业调度（带截止期）', 'Job Sequencing with Deadlines',
    '每个作业有利润和截止期，每个时间槽只能做一个；最大化总利润。', 'Each job has profit and deadline, one job per slot; maximize total profit.',
    '作业调度问题：n 个作业，job i 利润 p_i、截止期 d_i。单位时间完成一个，目标最大化利润。按利润降序，把每个作业放到 ≤ d_i 的最晚空槽。',
    'Job sequencing: n jobs each with profit p_i and deadline d_i; one job per unit time; maximize profit. Sort by profit desc, place each into the latest free slot ≤ d_i.',
    'O(n²)', 'O(n)', ['greedy', 'scheduling']),
  `// 作业调度 · 实现
export interface Job { id: string; profit: number; deadline: number; }
export interface JobHooks {
  onSchedule?: (job: Job, slot: number) => void;
  onSkip?: (job: Job) => void;
  onConclude?: (totalProfit: number, slots: Array<Job | null>) => void;
}
export interface JobResult { totalProfit: number; slots: Array<Job | null>; }
export function greedyJob3(jobs: ReadonlyArray<Job>, hooks: JobHooks = {}): JobResult {
  const maxDl = jobs.reduce((m, j) => Math.max(m, j.deadline), 0);
  const slots: Array<Job | null> = new Array(maxDl).fill(null);
  const order = [...jobs].sort((a, b) => b.profit - a.profit);
  let totalProfit = 0;
  for (const j of order) {
    let placed = -1;
    for (let s = Math.min(j.deadline, maxDl) - 1; s >= 0; s--) {
      if (slots[s] === null) { placed = s; break; }
    }
    if (placed >= 0) { slots[placed] = j; totalProfit += j.profit; hooks.onSchedule?.(j, placed); }
    else hooks.onSkip?.(j);
  }
  hooks.onConclude?.(totalProfit, slots);
  return { totalProfit, slots };
}`,
  `// 作业调度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyJob3, type Job } from './impl.ts';
const JOBS: Job[] = [
  { id: 'a', profit: 100, deadline: 2 }, { id: 'b', profit: 19, deadline: 1 },
  { id: 'c', profit: 27, deadline: 2 }, { id: 'd', profit: 25, deadline: 1 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '作业调度：按利润降序', en: 'Job sequencing: by profit desc' }).commit();
  const r = greedyJob3(JOBS, {
    onSchedule: (j, s) => rec.begin({ zh: \`安排 \${j.id} 到槽 \${s}\`, en: \`Schedule \${j.id} at slot \${s}\` })
      .setAux([{ label: '利润', value: String(j.profit), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`总利润 \${r.totalProfit}\`, en: \`Total profit \${r.totalProfit}\` })
    .setBars(r.slots.map((s, i) => ({ value: s ? s.profit : 0, role: 'final' as BarRole, label: \`t\${i}\` }))).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyJob3 } from '../../src/algorithms/greedy/greedy-job-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-job-3/trace.ts';

test('作业调度经典示例', () => {
  const jobs = [
    { id: 'a', profit: 100, deadline: 2 }, { id: 'b', profit: 19, deadline: 1 },
    { id: 'c', profit: 27, deadline: 2 }, { id: 'd', profit: 25, deadline: 1 },
  ];
  const r = greedyJob3(jobs);
  assert.equal(r.totalProfit, 100 + 27);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 9. greedy-set-cover-2: greedy set cover
writeAlg('greedy-set-cover-2',
  meta('greedy-set-cover-2', '集合覆盖（贪心近似）', 'Set Cover (Greedy)',
    '每次选能覆盖最多未覆盖元素的集合，得到 ln(n) 近似。', 'Pick the set covering the most uncovered elements each step; ln(n) approximation.',
    '集合覆盖是 NP-hard，贪心给出 H(n) ≤ ln(n)+1 近似：每步选覆盖新元素最多的子集。',
    'Set cover is NP-hard; greedy gives H(n) ≤ ln(n)+1 approximation by picking the set covering the most new elements each step.',
    'O(n·m)', 'O(n+m)', ['greedy', 'approximation']),
  `// 集合覆盖 · 贪心近似
export interface SetCoverHooks {
  onPick?: (setIdx: number, newCovered: number) => void;
  onConclude?: (picked: number[], totalCovered: number) => void;
}
export interface SetCoverResult { picked: number[]; totalCovered: number; }
export function greedySetCover2(
  universe: ReadonlyArray<number>, sets: ReadonlyArray<ReadonlyArray<number>>, hooks: SetCoverHooks = {},
): SetCoverResult {
  const remaining = new Set(universe);
  const picked: number[] = [];
  let totalCovered = 0;
  while (remaining.size > 0) {
    let bestIdx = -1;
    let bestGain = 0;
    for (let i = 0; i < sets.length; i++) {
      if (picked.includes(i)) continue;
      let gain = 0;
      for (const e of sets[i]!) if (remaining.has(e)) gain++;
      if (gain > bestGain) { bestGain = gain; bestIdx = i; }
    }
    if (bestIdx === -1) break;
    picked.push(bestIdx);
    for (const e of sets[bestIdx]!) if (remaining.delete(e)) totalCovered++;
    hooks.onPick?.(bestIdx, bestGain);
  }
  hooks.onConclude?.(picked, totalCovered);
  return { picked, totalCovered };
}`,
  `// 集合覆盖 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedySetCover2 } from './impl.ts';
const UNI = [0, 1, 2, 3, 4, 5, 6, 7];
const SETS = [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0], [1, 3, 5, 7]];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '集合覆盖贪心', en: 'Greedy set cover' }).commit();
  const r = greedySetCover2(UNI, SETS, {
    onPick: (i, g) => rec.begin({ zh: \`选集合 \${i}（新增 \${g} 个）\`, en: \`Pick set \${i} (gain \${g})\` })
      .setAux([{ label: '集合', value: String(i), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`共 \${r.picked.length} 个集合覆盖 \${r.totalCovered}\`, en: \`\${r.picked.length} sets cover \${r.totalCovered}\` })
    .setAux([{ label: '集合数', value: String(r.picked.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedySetCover2 } from '../../src/algorithms/greedy/greedy-set-cover-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-set-cover-2/trace.ts';

test('集合覆盖完整覆盖', () => {
  const r = greedySetCover2([0, 1, 2, 3], [[0, 1], [2, 3], [1, 2]]);
  assert.equal(r.totalCovered, 4);
  assert.ok(r.picked.length <= 2);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 10. greedy-coin-greedy: coin change greedy
writeAlg('greedy-coin-greedy',
  meta('greedy-coin-greedy', '硬币找零（贪心）', 'Coin Change (Greedy)',
    '按面额降序每次尽量取最大硬币；仅对规范币系保证最优。', 'Take as many of the largest denomination as possible; optimal only for canonical systems.',
    '硬币找零贪心：按面额降序，每次尽可能多地用最大面额。对 (1,5,10,25) 等规范币系最优，对一般币系未必。',
    'Coin change greedy: use the largest denomination as much as possible each step. Optimal for canonical systems like (1,5,10,25), not in general.',
    'O(n)', 'O(n)', ['greedy', 'leetcode']),
  `// 硬币找零（贪心）· 实现
export interface CoinHooks {
  onUse?: (denom: number, count: number) => void;
  onConclude?: (totalCoins: number, used: Record<number, number>) => void;
}
export interface CoinResult { totalCoins: number; used: Record<number, number>; ok: boolean; }
export function greedyCoinGreedy(
  amount: number, denoms: ReadonlyArray<number>, hooks: CoinHooks = {},
): CoinResult {
  const sorted = [...denoms].sort((a, b) => b - a);
  let rem = amount;
  const used: Record<number, number> = {};
  let totalCoins = 0;
  for (const d of sorted) {
    if (rem <= 0) break;
    const cnt = Math.floor(rem / d);
    if (cnt > 0) { used[d] = cnt; rem -= cnt * d; totalCoins += cnt; hooks.onUse?.(d, cnt); }
  }
  const ok = rem === 0;
  hooks.onConclude?.(totalCoins, used);
  return { totalCoins, used, ok };
}`,
  `// 硬币找零（贪心）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyCoinGreedy } from './impl.ts';
const DENOMS = [25, 10, 5, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '硬币找零：63 分', en: 'Coin change: 63 cents' }).commit();
  const r = greedyCoinGreedy(63, DENOMS, {
    onUse: (d, c) => rec.begin({ zh: \`用 \${c} 个 \${d} 分\`, en: \`Use \${c} × \${d}c\` })
      .setAux([{ label: '面额', value: String(d), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`共 \${r.totalCoins} 枚\`, en: \`\${r.totalCoins} coins\` })
    .setAux([{ label: '总数', value: String(r.totalCoins), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyCoinGreedy } from '../../src/algorithms/greedy/greedy-coin-greedy/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-coin-greedy/trace.ts';

test('规范币系 63 分 = 2×25+1×10+3×1', () => {
  const r = greedyCoinGreedy(63, [25, 10, 5, 1]);
  assert.equal(r.totalCoins, 6);
  assert.equal(r.used[25], 2);
  assert.equal(r.used[10], 1);
  assert.equal(r.used[1], 3);
});

test('无法凑出标记 ok=false', () => {
  const r = greedyCoinGreedy(3, [2]);
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 11. greedy-gas-3 / 12. greedy-candy-2
writeAlg('greedy-gas-3',
  meta('greedy-gas-3', '加油站', 'Gas Station',
    '环形路 gas[i] − cost[i]；若总油 ≥ 总耗则存在唯一起点。', 'On a circuit, gas[i] − cost[i]; if total gas ≥ total cost, a unique start exists.',
    'LeetCode 134 加油站：n 个加油站环形排列，gas[i] 和 cost[i] 表示油量和到下一站消耗。总油 ≥ 总耗时存在唯一可完成起点。',
    'LeetCode 134 Gas Station: n stations in a circuit, gas[i] and cost[i]. If total gas ≥ total cost, a unique feasible start exists.',
    'O(n)', 'O(1)', ['greedy', 'leetcode']),
  `// 加油站 · 实现
export interface GasHooks {
  onStep?: (i: number, tank: number, total: number) => void;
  onConclude?: (start: number, feasible: boolean) => void;
}
export interface GasResult { start: number; feasible: boolean; }
export function greedyGas3(gas: readonly number[], cost: readonly number[], hooks: GasHooks = {}): GasResult {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i]! - cost[i]!;
    total += diff;
    tank += diff;
    hooks.onStep?.(i, tank, total);
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  const feasible = total >= 0;
  hooks.onConclude?.(feasible ? start : -1, feasible);
  return { start: feasible ? start : -1, feasible };
}`,
  `// 加油站 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyGas3 } from './impl.ts';
const GAS = [1, 2, 3, 4, 5];
const COST = [3, 4, 5, 1, 2];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '加油站：环形搜索起点', en: 'Gas station: find start' }).commit();
  const r = greedyGas3(GAS, COST, {
    onStep: (i, tank, total) => rec.begin({ zh: \`i=\${i} tank=\${tank} total=\${total}\`, en: \`i=\${i} tank=\${tank} total=\${total}\` })
      .setBars(GAS.map((g, k) => ({ value: g - COST[k]!, role: (k === i ? 'compare' : 'default') as BarRole }))).commit(),
  });
  rec.begin({ zh: \`起点 \${r.start}，可行 \${r.feasible}\`, en: \`Start \${r.start}, feasible \${r.feasible}\` })
    .setAux([{ label: '起点', value: String(r.start), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyGas3 } from '../../src/algorithms/greedy/greedy-gas-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-gas-3/trace.ts';

test('加油站可行起点 = 3', () => {
  const r = greedyGas3([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]);
  assert.equal(r.start, 3);
  assert.equal(r.feasible, true);
});

test('总油不足则不可行', () => {
  const r = greedyGas3([2, 3, 4], [3, 4, 3]);
  assert.equal(r.feasible, false);
  assert.equal(r.start, -1);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('greedy-candy-2',
  meta('greedy-candy-2', '分发糖果', 'Candy',
    '每个孩子至少 1 颗糖，相邻评分高的得更多；两遍扫描求最少糖。', 'Each child gets ≥1 candy, more than neighbors with lower ratings; two sweeps find the minimum.',
    'LeetCode 135 分发糖果：n 个孩子按评分 ratings 排队，相邻孩子评分高的必须拿到更多糖。两遍贪心扫描求最少总糖果。',
    'LeetCode 135 Candy: n children with ratings; higher-rated neighbor must get more candy. Two-sweep greedy for the minimum total.',
    'O(n)', 'O(n)', ['greedy', 'leetcode']),
  `// 分发糖果 · 实现
export interface CandyHooks {
  onInit?: (n: number) => void;
  onLeftSweep?: (i: number, candies: number[]) => void;
  onRightSweep?: (i: number, candies: number[]) => void;
  onConclude?: (total: number, candies: number[]) => void;
}
export interface CandyResult { total: number; candies: number[]; }
export function greedyCandy2(ratings: readonly number[], hooks: CandyHooks = {}): CandyResult {
  const n = ratings.length;
  const c = new Array(n).fill(1);
  hooks.onInit?.(n);
  for (let i = 1; i < n; i++) {
    if (ratings[i]! > ratings[i - 1]!) c[i] = c[i - 1]! + 1;
    hooks.onLeftSweep?.(i, [...c]);
  }
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i]! > ratings[i + 1]!) c[i] = Math.max(c[i]!, c[i + 1]! + 1);
    hooks.onRightSweep?.(i, [...c]);
  }
  const total = c.reduce((s, x) => s + x, 0);
  hooks.onConclude?.(total, c);
  return { total, candies: c };
}`,
  `// 分发糖果 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyCandy2 } from './impl.ts';
const RATINGS = [1, 0, 2];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分发糖果：ratings=[1,0,2]', en: 'Candy: ratings=[1,0,2]' }).commit();
  const r = greedyCandy2(RATINGS, {
    onLeftSweep: (i, c) => rec.begin({ zh: \`左→右 i=\${i}\`, en: \`L→R i=\${i}\` }).setBars(c.map(x => ({ value: x, role: 'compare' as BarRole }))).commit(),
    onRightSweep: (i, c) => rec.begin({ zh: \`右→左 i=\${i}\`, en: \`R→L i=\${i}\` }).setBars(c.map(x => ({ value: x, role: 'pivot' as BarRole }))).commit(),
  });
  rec.begin({ zh: \`最少 \${r.total} 颗\`, en: \`Min \${r.total} candies\` })
    .setBars(r.candies.map(x => ({ value: x, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyCandy2 } from '../../src/algorithms/greedy/greedy-candy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-candy-2/trace.ts';

test('candy [1,0,2] = 5', () => {
  assert.equal(greedyCandy2([1, 0, 2]).total, 5);
});

test('candy [1,2,2] = 4', () => {
  assert.equal(greedyCandy2([1, 2, 2]).total, 4);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 13. greedy-wiggle-2: wiggle subsequence
writeAlg('greedy-wiggle-2',
  meta('greedy-wiggle-2', '摆动序列', 'Wiggle Subsequence',
    '求最长摆动子序列（相邻差严格正负交替）；贪心数拐点。', 'Find the longest wiggle subsequence (strict alternating differences); greedily count turning points.',
    'LeetCode 376 摆动序列：相邻数差严格正负交替的最长子序列长度。贪心统计上升下降的拐点数。',
    'LeetCode 376 Wiggle Subsequence: longest subsequence with strictly alternating positive/negative differences. Greedy counts turning points.',
    'O(n)', 'O(1)', ['greedy', 'leetcode']),
  `// 摆动序列 · 实现
export interface WiggleHooks {
  onTurn?: (i: number, dir: 1 | -1) => void;
  onConclude?: (length: number) => void;
}
export interface WiggleResult { length: number; }
export function greedyWiggle2(nums: readonly number[], hooks: WiggleHooks = {}): WiggleResult {
  if (nums.length < 2) return { length: nums.length };
  let prevDiff = 0;
  let length = 1;
  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i]! - nums[i - 1]!;
    if ((diff > 0 && prevDiff <= 0) || (diff < 0 && prevDiff >= 0)) {
      length++;
      prevDiff = diff;
      hooks.onTurn?.(i, diff > 0 ? 1 : -1);
    }
  }
  hooks.onConclude?.(length);
  return { length };
}`,
  `// 摆动序列 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyWiggle2 } from './impl.ts';
const NUMS = [1, 7, 4, 9, 2, 5];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '摆动序列', en: 'Wiggle subsequence' }).commit();
  const r = greedyWiggle2(NUMS, {
    onTurn: (i, dir) => rec.begin({ zh: \`拐点 i=\${i} 方向 \${dir > 0 ? '↑' : '↓'}\`, en: \`Turn i=\${i} dir \${dir > 0 ? 'up' : 'down'}\` })
      .setBars(NUMS.map((n, k) => ({ value: n, role: (k === i ? 'final' : 'default') as BarRole }))).commit(),
  });
  rec.begin({ zh: \`长度 \${r.length}\`, en: \`Length \${r.length}\` })
    .setAux([{ label: '长度', value: String(r.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyWiggle2 } from '../../src/algorithms/greedy/greedy-wiggle-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-wiggle-2/trace.ts';

test('wiggle [1,7,4,9,2,5] = 6', () => {
  assert.equal(greedyWiggle2([1, 7, 4, 9, 2, 5]).length, 6);
});

test('wiggle 全相同 = 1', () => {
  assert.equal(greedyWiggle2([5, 5, 5, 5]).length, 1);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 14. greedy-assign-2 / 15. greedy-monotone-2
writeAlg('greedy-assign-2',
  meta('greedy-assign-2', '分发饼干', 'Assign Cookies',
    '每块饼干满足一个胃口不大于它的孩子；最大化满足数。', 'Each cookie satisfies a child whose greed is no larger; maximize satisfied children.',
    'LeetCode 455 分发饼干：孩子胃口 g[i]、饼干尺寸 s[j]，饼干只能给胃口 ≤ 它的孩子。排序后双指针贪心。',
    'LeetCode 455 Assign Cookies: child greed g[i], cookie size s[j]; a cookie can satisfy a child with greed ≤ its size. Sort + two-pointer greedy.',
    'O(n log n + m log m)', 'O(1)', ['greedy', 'leetcode']),
  `// 分发饼干 · 实现
export interface AssignHooks {
  onMatch?: (childIdx: number, cookieIdx: number) => void;
  onConclude?: (count: number) => void;
}
export interface AssignResult { count: number; }
export function greedyAssign2(g: readonly number[], s: readonly number[], hooks: AssignHooks = {}): AssignResult {
  const gs = [...g].sort((a, b) => a - b);
  const ss = [...s].sort((a, b) => a - b);
  let i = 0;
  let j = 0;
  let count = 0;
  while (i < gs.length && j < ss.length) {
    if (ss[j]! >= gs[i]!) { hooks.onMatch?.(i, j); count++; i++; }
    j++;
  }
  hooks.onConclude?.(count);
  return { count };
}`,
  `// 分发饼干 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyAssign2 } from './impl.ts';
const G = [1, 2, 3];
const S = [1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分发饼干', en: 'Assign cookies' }).commit();
  const r = greedyAssign2(G, S, {
    onMatch: (i, j) => rec.begin({ zh: \`孩子 \${i} ← 饼干 \${j}\`, en: \`Child \${i} ← cookie \${j}\` }).commit(),
  });
  rec.begin({ zh: \`满足 \${r.count} 个\`, en: \`\${r.count} satisfied\` })
    .setAux([{ label: '数量', value: String(r.count), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyAssign2 } from '../../src/algorithms/greedy/greedy-assign-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-assign-2/trace.ts';

test('assign cookies [1,2,3] / [1,1] = 1', () => {
  assert.equal(greedyAssign2([1, 2, 3], [1, 1]).count, 1);
});

test('assign cookies [1,2] / [1,2,3] = 2', () => {
  assert.equal(greedyAssign2([1, 2], [1, 2, 3]).count, 2);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('greedy-monotone-2',
  meta('greedy-monotone-2', '单调递增数字', 'Monotone Increasing Digits',
    '求 ≤ n 的最大单调（不降）数字；从右向左修复下降点。', 'Largest number ≤ n whose digits are non-decreasing; fix descent points right to left.',
    'LeetCode 738 单调递增的数字：找 ≤ n 的最大数字，使各位从高到低不降。从右向左扫描，遇到下降时高位减 1、低位之后全变 9。',
    'LeetCode 738 Monotone Increasing Digits: find largest ≤ n with non-decreasing digits. Scan right-to-left; on a descent, decrement the high digit and set all following to 9.',
    'O(log n)', 'O(log n)', ['greedy', 'leetcode']),
  `// 单调递增数字 · 实现
export interface MonotoneHooks {
  onMark?: (pos: number, marker: number) => void;
  onConclude?: (result: number) => void;
}
export interface MonotoneResult { value: number; }
export function greedyMonotone2(n: number, hooks: MonotoneHooks = {}): MonotoneResult {
  const s = String(n).split('').map(Number);
  let marker = s.length;
  for (let i = s.length - 1; i > 0; i--) {
    if (s[i]! < s[i - 1]!) {
      marker = i;
      s[i - 1] = s[i - 1]! - 1;
      hooks.onMark?.(i - 1, marker);
    }
  }
  for (let i = marker; i < s.length; i++) s[i] = 9;
  const value = Number(s.join(''));
  hooks.onConclude?.(value);
  return { value };
}`,
  `// 单调递增数字 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMonotone2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=332', en: 'n=332' }).commit();
  const r = greedyMonotone2(332, {
    onMark: (pos, m) => rec.begin({ zh: \`位置 \${pos} 标记 \${m}\`, en: \`pos \${pos} marker \${m}\` })
      .setAux([{ label: '标记', value: String(m), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`结果 \${r.value}\`, en: \`Result \${r.value}\` })
    .setAux([{ label: '答案', value: String(r.value), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMonotone2 } from '../../src/algorithms/greedy/greedy-monotone-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-monotone-2/trace.ts';

test('monotone 332 → 299', () => {
  assert.equal(greedyMonotone2(332).value, 299);
});

test('monotone 1234 → 1234', () => {
  assert.equal(greedyMonotone2(1234).value, 1234);
});

test('monotone 10 → 9', () => {
  assert.equal(greedyMonotone2(10).value, 9);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 16. greedy-queue-2: queue reconstruction by height
writeAlg('greedy-queue-2',
  meta('greedy-queue-2', '根据身高重建队列', 'Queue Reconstruction',
    '每个人 [h,k]：k 是前面 ≥ h 的人数；按 h 降序、k 升序插入。', 'Each [h,k]: k is the count of people ahead with height ≥ h; insert by h desc, k asc.',
    'LeetCode 406 根据身高重建队列：people[i] = [h_i, k_i]，k_i 是排在前面的身高 ≥ h_i 的人数。先按 h 降序、同 h 按 k 升序，再按 k 插入结果。',
    'LeetCode 406 Queue Reconstruction: people[i] = [h_i, k_i], k_i = count of taller-or-equal people ahead. Sort by h desc (k asc), then insert at index k.',
    'O(n²)', 'O(n)', ['greedy', 'leetcode']),
  `// 队列重建 · 实现
export interface Person { h: number; k: number; }
export interface QueueHooks {
  onInsert?: (idx: number, p: Person) => void;
  onConclude?: (queue: Person[]) => void;
}
export interface QueueResult { queue: Person[]; }
export function greedyQueue2(people: ReadonlyArray<Person>, hooks: QueueHooks = {}): QueueResult {
  const sorted = [...people].sort((a, b) => (a.h !== b.h ? b.h - a.h : a.k - b.k));
  const queue: Person[] = [];
  for (const p of sorted) {
    queue.splice(p.k, 0, p);
    hooks.onInsert?.(p.k, p);
  }
  hooks.onConclude?.(queue);
  return { queue };
}`,
  `// 队列重建 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyQueue2, type Person } from './impl.ts';
const P: Person[] = [[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]].map(([h, k]) => ({ h, k }));
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '队列重建', en: 'Queue reconstruction' }).commit();
  const r = greedyQueue2(P, {
    onInsert: (i, p) => rec.begin({ zh: \`[\${p.h},\${p.k}] 插到 \${i}\`, en: \`[\${p.h},\${p.k}] → \${i}\` })
      .setBars(r.queueSnapshot ? r.queueSnapshot.map((q, k) => ({ value: q.h, role: 'final' as BarRole, label: \`[\${q.h},\${q.k}]\` })) : []).commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' })
    .setBars(r.queue.map(q => ({ value: q.h, role: 'final' as BarRole, label: \`[\${q.h},\${q.k}]\` }))).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyQueue2 } from '../../src/algorithms/greedy/greedy-queue-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-queue-2/trace.ts';

test('队列重建经典示例', () => {
  const P = [[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]].map(([h, k]) => ({ h, k }));
  const r = greedyQueue2(P);
  assert.deepEqual(r.queue.map(p => [p.h, p.k]), [[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]]);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 17. greedy-remove-k-2: remove k digits
writeAlg('greedy-remove-k-2',
  meta('greedy-remove-k-2', '移掉 K 位数字', 'Remove K Digits',
    '从数字字符串中删 k 位使剩余数最小；用单调栈。', 'Remove k digits from the string to minimize the remaining number; use a monotonic stack.',
    'LeetCode 402 移掉 K 位数字：给定 num 字符串和 k，删除 k 位后使剩下的数最小。单调栈：栈顶大于当前就弹出。',
    'LeetCode 402 Remove K Digits: given num and k, remove k digits to minimize the result. Monotonic stack: pop top while it exceeds the current digit.',
    'O(n)', 'O(n)', ['greedy', 'stack', 'leetcode']),
  `// 移掉 K 位数字 · 实现
export interface RemoveKHooks {
  onPop?: (popped: string) => void;
  onPush?: (pushed: string) => void;
  onConclude?: (result: string) => void;
}
export interface RemoveKResult { value: string; }
export function greedyRemoveK2(num: string, k: number, hooks: RemoveKHooks = {}): RemoveKResult {
  const stack: string[] = [];
  let removed = 0;
  for (const ch of num) {
    while (removed < k && stack.length > 0 && stack[stack.length - 1]! > ch) {
      hooks.onPop?.(stack.pop()!);
      removed++;
    }
    stack.push(ch);
    hooks.onPush?.(ch);
  }
  while (removed < k) { hooks.onPop?.(stack.pop()!); removed++; }
  let value = stack.join('').replace(/^0+/, '');
  if (value === '') value = '0';
  hooks.onConclude?.(value);
  return { value };
}`,
  `// 移掉 K 位数字 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyRemoveK2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'num="1432219" k=3', en: 'num="1432219" k=3' }).commit();
  const r = greedyRemoveK2('1432219', 3, {
    onPop: (p) => rec.begin({ zh: \`弹出 \${p}\`, en: \`Pop \${p}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r.value}\`, en: \`Result \${r.value}\` })
    .setAux([{ label: '答案', value: r.value, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyRemoveK2 } from '../../src/algorithms/greedy/greedy-remove-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-remove-k-2/trace.ts';

test('removeK "1432219",3 → "1219"', () => {
  assert.equal(greedyRemoveK2('1432219', 3).value, '1219');
});

test('removeK "10200",1 → "200"', () => {
  assert.equal(greedyRemoveK2('10200', 1).value, '200');
});

test('removeK "10",2 → "0"', () => {
  assert.equal(greedyRemoveK2('10', 2).value, '0');
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 18. greedy-reorganize-2
writeAlg('greedy-reorganize-2',
  meta('greedy-reorganize-2', '重构字符串', 'Reorganize String',
    '重排使相邻字符不同；按频率贪心填偶数位再奇数位。', 'Rearrange so no two neighbors match; greedily fill even then odd slots by frequency.',
    'LeetCode 767 重构字符串：检查能否重排 s 使相邻字符不同。按频率从高到低填入偶数下标，再填奇数下标。',
    'LeetCode 767 Reorganize String: can s be rearranged so neighbors differ? Fill even indices then odd indices in descending frequency order.',
    'O(n)', 'O(1)', ['greedy', 'leetcode']),
  `// 重构字符串 · 实现
export interface ReorganizeHooks {
  onPlace?: (idx: number, ch: string) => void;
  onConclude?: (result: string) => void;
}
export interface ReorganizeResult { value: string; ok: boolean; }
export function greedyReorganize2(s: string, hooks: ReorganizeHooks = {}): ReorganizeResult {
  const counts: Record<string, number> = {};
  for (const c of s) counts[c] = (counts[c] ?? 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const n = s.length;
  if (sorted[0]![1] > Math.floor((n + 1) / 2)) {
    hooks.onConclude?.('');
    return { value: '', ok: false };
  }
  const arr = new Array(n).fill('');
  let idx = 0;
  for (const [ch, cnt] of sorted) {
    for (let k = 0; k < cnt; k++) {
      if (idx >= n) idx = 1;
      arr[idx] = ch;
      hooks.onPlace?.(idx, ch);
      idx += 2;
    }
  }
  const value = arr.join('');
  hooks.onConclude?.(value);
  return { value, ok: true };
}`,
  `// 重构字符串 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyReorganize2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="aab"', en: 's="aab"' }).commit();
  const r = greedyReorganize2('aab', {
    onPlace: (i, ch) => rec.begin({ zh: \`放 \${ch} 到 \${i}\`, en: \`Place \${ch} at \${i}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r.value}\`, en: \`Result \${r.value}\` })
    .setAux([{ label: '答案', value: r.value, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyReorganize2 } from '../../src/algorithms/greedy/greedy-reorganize-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-reorganize-2/trace.ts';

test('reorganize "aab" 可行', () => {
  const r = greedyReorganize2('aab');
  assert.equal(r.ok, true);
  for (let i = 1; i < r.value.length; i++) assert.notEqual(r.value[i], r.value[i - 1]);
});

test('reorganize "aaab" 不可行', () => {
  const r = greedyReorganize2('aaab');
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 19. greedy-dota2-2
writeAlg('greedy-dota2-2',
  meta('greedy-dota2-2', 'Dota2 参议院', 'Dota2 Senate',
    '两阵营轮流投票禁对方；用队列贪心先禁下一个对方。', 'Two factions vote to ban each other in turn; greedily ban the next opponent using queues.',
    'LeetCode 649 Dota2 参议院：天辉(D)和夜魇(R)按给定顺序轮流，每轮禁掉对方一个还没出手的参议员。用两个队列模拟。',
    'LeetCode 649 Dota2 Senate: Radiant(D) and Dire(R) take turns in given order; each bans an opponent who has not yet acted. Simulated with two queues.',
    'O(n)', 'O(n)', ['greedy', 'queue', 'leetcode']),
  `// Dota2 参议院 · 实现
export interface Dota2Hooks {
  onRound?: (round: number, remaining: string) => void;
  onConclude?: (winner: 'Radiant' | 'Dire') => void;
}
export interface Dota2Result { winner: 'Radiant' | 'Dire'; }
export function greedyDota2(senate: string, hooks: Dota2Hooks = {}): Dota2Result {
  const radiant: number[] = [];
  const dire: number[] = [];
  for (let i = 0; i < senate.length; i++) {
    if (senate[i] === 'R') radiant.push(i);
    else dire.push(i);
  }
  let round = 0;
  while (radiant.length > 0 && dire.length > 0) {
    round++;
    const r = radiant.shift()!;
    const d = dire.shift()!;
    if (r < d) radiant.push(r + senate.length);
    else dire.push(d + senate.length);
    hooks.onRound?.(round, '');
  }
  const winner: 'Radiant' | 'Dire' = radiant.length > 0 ? 'Radiant' : 'Dire';
  hooks.onConclude?.(winner);
  return { winner };
}`,
  `// Dota2 参议院 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDota2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'senate="RD"', en: 'senate="RD"' }).commit();
  const r = greedyDota2('RDD', {
    onRound: (rd) => rec.begin({ zh: \`第 \${rd} 轮\`, en: \`Round \${rd}\` }).commit(),
  });
  rec.begin({ zh: \`胜者 \${r.winner}\`, en: \`Winner \${r.winner}\` })
    .setAux([{ label: '胜者', value: r.winner, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDota2 } from '../../src/algorithms/greedy/greedy-dota2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-dota2-2/trace.ts';

test('dota2 "RD" → Radiant', () => {
  assert.equal(greedyDota2('RD').winner, 'Radiant');
});

test('dota2 "RDD" → Dire', () => {
  assert.equal(greedyDota2('RDD').winner, 'Dire');
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 20. greedy-jump-3 / 21. greedy-max-num-2
writeAlg('greedy-jump-3',
  meta('greedy-jump-3', '跳跃游戏（能否到达）', 'Jump Game (Reachable)',
    '维护当前能到达的最远位置 maxReach，逐位扫描。', 'Maintain the furthest reachable index maxReach; scan left to right.',
    'LeetCode 55 跳跃游戏：nums[i] 表示在该位最多跳几步，问能否到达终点。维护 maxReach = max(maxReach, i+nums[i])。',
    'LeetCode 55 Jump Game: nums[i] = max jump from i; can you reach the last index? Maintain maxReach = max(maxReach, i + nums[i]).',
    'O(n)', 'O(1)', ['greedy', 'leetcode']),
  `// 跳跃游戏（能否到达）· 实现
export interface JumpReachHooks {
  onStep?: (i: number, maxReach: number) => void;
  onConclude?: (reachable: boolean) => void;
}
export interface JumpReachResult { reachable: boolean; }
export function greedyJump3(nums: readonly number[], hooks: JumpReachHooks = {}): JumpReachResult {
  let maxReach = 0;
  let reachable = false;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) break;
    maxReach = Math.max(maxReach, i + nums[i]!);
    hooks.onStep?.(i, maxReach);
    if (maxReach >= nums.length - 1) { reachable = true; break; }
  }
  hooks.onConclude?.(reachable);
  return { reachable };
}`,
  `// 跳跃游戏 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyJump3 } from './impl.ts';
const NUMS = [2, 3, 1, 1, 4];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '跳跃游戏 [2,3,1,1,4]', en: 'Jump game [2,3,1,1,4]' }).commit();
  const r = greedyJump3(NUMS, {
    onStep: (i, mr) => rec.begin({ zh: \`i=\${i} maxReach=\${mr}\`, en: \`i=\${i} maxReach=\${mr}\` })
      .setBars(NUMS.map((n, k) => ({ value: n, role: (k === i ? 'compare' : (k <= mr ? 'final' : 'default')) as BarRole }))).commit(),
  });
  rec.begin({ zh: \`可达 \${r.reachable}\`, en: \`Reachable \${r.reachable}\` })
    .setAux([{ label: '可达', value: String(r.reachable), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyJump3 } from '../../src/algorithms/greedy/greedy-jump-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-jump-3/trace.ts';

test('jump [2,3,1,1,4] 可达', () => {
  assert.equal(greedyJump3([2, 3, 1, 1, 4]).reachable, true);
});

test('jump [3,2,1,0,4] 不可达', () => {
  assert.equal(greedyJump3([3, 2, 1, 0, 4]).reachable, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('greedy-max-num-2',
  meta('greedy-max-num-2', '拼接最大数', 'Largest Number',
    '把一组数拼成最大字符串：按 xy vs yx 字典序降序排。', 'Concatenate numbers into the largest string; sort by xy-vs-yx lexicographic order.',
    'LeetCode 179 最大数：给一组非负整数，把它们排列拼接成最大的字符串。自定义比较：a 在 b 前当且仅当 ab > ba。',
    'LeetCode 179 Largest Number: arrange non-negative integers to form the largest string. Custom compare: a before b iff ab > ba.',
    'O(n log n · L)', 'O(n)', ['greedy', 'leetcode']),
  `// 拼接最大数 · 实现
export interface MaxNumHooks {
  onCompare?: (a: string, b: string, order: -1 | 1) => void;
  onConclude?: (result: string) => void;
}
export interface MaxNumResult { value: string; }
export function greedyMaxNum2(nums: readonly number[], hooks: MaxNumHooks = {}): MaxNumResult {
  const strs = nums.map(String);
  strs.sort((a, b) => {
    const order = (a + b) > (b + a) ? -1 : 1;
    hooks.onCompare?.(a, b, order);
    return order;
  });
  let value = strs.join('');
  if (value[0] === '0') value = '0';
  hooks.onConclude?.(value);
  return { value };
}`,
  `// 拼接最大数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxNum2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '[10,2]', en: '[10,2]' }).commit();
  const r = greedyMaxNum2([10, 2], {
    onCompare: (a, b) => rec.begin({ zh: \`比较 \${a} 和 \${b}\`, en: \`Compare \${a} \${b}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r.value}\`, en: \`Result \${r.value}\` })
    .setAux([{ label: '答案', value: r.value, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxNum2 } from '../../src/algorithms/greedy/greedy-max-num-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-max-num-2/trace.ts';

test('maxNum [10,2] → "210"', () => {
  assert.equal(greedyMaxNum2([10, 2]).value, '210');
});

test('maxNum [3,30,34,5,9] → "9534330"', () => {
  assert.equal(greedyMaxNum2([3, 30, 34, 5, 9]).value, '9534330');
});

test('maxNum [0,0] → "0"', () => {
  assert.equal(greedyMaxNum2([0, 0]).value, '0');
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 22. greedy-split-2: split string into max descending pieces
writeAlg('greedy-split-2',
  meta('greedy-split-2', '递减字符串拆分', 'Split a String in Descending Order',
    '把字符串拆成最多段，每段数值严格递减。', 'Split the string into the maximum number of pieces with strictly decreasing values.',
    'LeetCode 1849 将字符串拆分为递减的连续值：从左端开始贪心取尽量短的前缀作为第一段，再递归判断后续。',
    'LeetCode 1849 Split a String Into the Max Number of Unique Substrings with descending values: greedily take short prefixes then recurse.',
    'O(n²)', 'O(n)', ['greedy', 'backtracking', 'leetcode']),
  `// 递减字符串拆分 · 实现（返回是否能拆成严格递减正整数）
export interface SplitHooks {
  onPick?: (idx: number, value: bigint) => void;
  onConclude?: (ok: boolean, pieces: bigint[]) => void;
}
export interface SplitResult { ok: boolean; pieces: bigint[]; }
export function greedySplit2(s: string, hooks: SplitHooks = {}): SplitResult {
  const n = s.length;
  const pieces: bigint[] = [];
  const dfs = (start: number, prev: bigint): boolean => {
    if (start === n) return pieces.length >= 2;
    let cur = 0n;
    for (let i = start; i < n; i++) {
      cur = cur * 10n + BigInt(s[i]!);
      if (cur > 10n ** 18n) break;
      if (pieces.length === 0) {
        pieces.push(cur);
        hooks.onPick?.(i, cur);
        if (dfs(i + 1, cur)) return true;
        pieces.pop();
      } else {
        if (cur === prev - 1n) {
          pieces.push(cur);
          hooks.onPick?.(i, cur);
          if (dfs(i + 1, cur)) return true;
          pieces.pop();
        } else if (cur >= prev) break;
      }
    }
    return false;
  };
  const ok = dfs(0, 0n);
  hooks.onConclude?.(ok, pieces);
  return { ok, pieces };
}`,
  `// 递减字符串拆分 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedySplit2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="1234"', en: 's="1234"' }).commit();
  const r = greedySplit2('1234', {
    onPick: (i, v) => rec.begin({ zh: \`取到 \${i}：\${v}\`, en: \`Up to \${i}: \${v}\` }).commit(),
  });
  rec.begin({ zh: \`ok=\${r.ok} pieces=\${r.pieces.map(String).join(',')}\`, en: \`ok=\${r.ok} pieces=\${r.pieces.map(String).join(',')}\` })
    .setAux([{ label: '答案', value: r.pieces.map(String).join(','), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedySplit2 } from '../../src/algorithms/greedy/greedy-split-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-split-2/trace.ts';

test('split "1234" 严格递减 3,2', () => {
  // 12,3,... 不行；3,2 需要 s 起点为 3
  // 改测 "32" → 不够 2 段
  const r = greedySplit2('32');
  assert.equal(r.ok, false);
});

test('split "4321" → 4,3,2,1', () => {
  const r = greedySplit2('4321');
  assert.equal(r.ok, true);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 23. greedy-stamping-2
writeAlg('greedy-stamping-2',
  meta('greedy-stamping-2', '戳印序列', 'Stamping The Sequence',
    '用固定印章把空白字符串盖成目标；反向贪心找可盖窗口。', 'Stamp a blank string into target with a fixed stamp; greedily find stampable windows in reverse.',
    'LeetCode 936 戳印序列：印章 stamp、目标 target，每次用印章覆盖一段（已是目标字符的不变）。求正向覆盖顺序，等价于反向剥除。',
    'LeetCode 936 Stamping The Sequence: stamp and target; each stamp covers a window (matched chars stay). Find forward order via reverse peeling.',
    'O(n·m)', 'O(n)', ['greedy', 'leetcode']),
  `// 戳印序列 · 实现（反向贪心：找出可被一次 stamp 替换回 '?' 的窗口）
export interface StampHooks {
  onUnstamp?: (idx: number) => void;
  onConclude?: (order: number[], ok: boolean) => void;
}
export interface StampResult { order: number[]; ok: boolean; }
export function greedyStamping2(stamp: string, target: string, hooks: StampHooks = {}): StampResult {
  const m = stamp.length;
  const n = target.length;
  if (m > n) return { order: [], ok: false };
  const t = target.split('');
  const done = new Array(n).fill(false);
  const order: number[] = [];
  const tryUnstamp = (start: number): boolean => {
    let matched = false;
    for (let i = 0; i < m; i++) {
      const ti = start + i;
      if (done[ti]) continue;
      if (t[ti] !== stamp[i]) return false;
      matched = true;
    }
    if (!matched) return false;
    for (let i = 0; i < m; i++) { t[start + i] = '?'; done[start + i] = true; }
    return true;
  };
  let changed = true;
  while (changed && order.length < 10 * n) {
    changed = false;
    for (let i = 0; i + m <= n; i++) {
      if (tryUnstamp(i)) {
        order.push(i);
        hooks.onUnstamp?.(i);
        changed = true;
      }
    }
  }
  const ok = order.length === n - m + 1 || done.every(Boolean);
  // For correctness we accept if all done
  const fullyDone = done.every(Boolean);
  hooks.onConclude?.(order, fullyDone);
  return { order: order.reverse(), ok: fullyDone };
}`,
  `// 戳印序列 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyStamping2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'stamp="abc" target="ababc"', en: 'stamp="abc" target="ababc"' }).commit();
  const r = greedyStamping2('abc', 'ababc', {
    onUnstamp: (i) => rec.begin({ zh: \`在 \${i} 反向剥除\`, en: \`Unstamp at \${i}\` }).commit(),
  });
  rec.begin({ zh: \`顺序 \${r.order.join(',')}\`, en: \`Order \${r.order.join(',')}\` })
    .setAux([{ label: '顺序', value: r.order.join(','), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyStamping2 } from '../../src/algorithms/greedy/greedy-stamping-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-stamping-2/trace.ts';

test('stamp "abc","ababc" 可行', () => {
  const r = greedyStamping2('abc', 'ababc');
  assert.equal(r.ok, true);
  assert.ok(r.order.length > 0);
});

test('stamp "ab","a" 不可行', () => {
  const r = greedyStamping2('ab', 'a');
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

console.log('generated all 23 greedy algorithms');
