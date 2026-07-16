// Generator for 48 network algorithms (52 -> 100). ids use 'net-' prefix to stay unique.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'network';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;
function writeAlg(id, metaSrc, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), metaSrc);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}
function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

const ALGS = [];

// 1. net-dfs-traversal  —— 图 DFS 遍历
ALGS.push({
  id: 'net-dfs-traversal',
  m: ['图DFS遍历', 'Graph DFS Traversal', '邻接表上递归 DFS，记录访问顺序。', 'Recursive DFS on an adjacency list.',
    '从起点出发，标记访问，递归邻居。', 'Mark visited, recurse neighbors. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'dfs']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight?: number }>; directed?: boolean; }
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    if (!g.directed) adj.get(e.to)!.push(e.from);
  }
  for (const [k, v] of adj) v.sort();
  return adj;
}
export interface DfsHooks { onVisit?: (v: string) => void; onResult?: (order: string[]) => void; }
export function dfs(g: GraphInput, start: string, hooks: DfsHooks = {}): string[] {
  const adj = buildAdj(g);
  const visited = new Set<string>();
  const order: string[] = [];
  const go = (u: string) => {
    if (visited.has(u)) return;
    visited.add(u);
    order.push(u);
    hooks.onVisit?.(u);
    for (const v of adj.get(u) ?? []) go(v);
  };
  go(start);
  hooks.onResult?.(order);
  return order;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfs, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'},{from:'D',to:'E'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DFS 从 A 开始', en: 'DFS from A' }).commit();
  const order = dfs(input, 'A', { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setBars(order.length === 0 ? [] : order.map((x) => ({ value: 0, role: 'default' as BarRole }))).setAux([{ label: 'visited', value: v, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '顺序：' + order.join(' → '), en: 'Order: ' + order.join(' → ') }).setBars(order.map((x, i) => ({ value: i + 1, role: 'final' as BarRole, label: x }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfs } from '../../src/algorithms/network/net-dfs-traversal/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-dfs-traversal/trace.ts';
const G = { nodes: ['A','B','C','D'], edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'}] };
test('dfs 从 A', () => {
  const o = dfs(G, 'A');
  assert.equal(o[0], 'A');
  assert.equal(o.length, 4);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. net-bfs-traversal  —— 图 BFS 遍历
ALGS.push({
  id: 'net-bfs-traversal',
  m: ['图BFS遍历', 'Graph BFS Traversal', '邻接表上 BFS，记录访问顺序与层。', 'BFS on adjacency list with levels.',
    '队列驱动，逐层访问。', 'Queue-driven, level by level. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'bfs']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight?: number }>; directed?: boolean; }
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); if (!g.directed) adj.get(e.to)!.push(e.from); }
  for (const [k, v] of adj) v.sort();
  return adj;
}
export interface BfsHooks { onVisit?: (v: string, dist: number) => void; onResult?: (order: string[]) => void; }
export function bfs(g: GraphInput, start: string, hooks: BfsHooks = {}): string[] {
  const adj = buildAdj(g);
  const visited = new Set<string>([start]);
  const q: Array<{ v: string; d: number }> = [{ v: start, d: 0 }];
  const order: string[] = [];
  while (q.length) {
    const { v, d } = q.shift()!;
    order.push(v);
    hooks.onVisit?.(v, d);
    for (const u of adj.get(v) ?? []) if (!visited.has(u)) { visited.add(u); q.push({ v: u, d: d + 1 }); }
  }
  hooks.onResult?.(order);
  return order;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bfs, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'},{from:'D',to:'E'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const order: string[] = [];
  rec.begin({ zh: 'BFS 从 A 开始', en: 'BFS from A' }).commit();
  bfs(input, 'A', { onVisit: (v, d) => { order.push(v); rec.begin({ zh: '访问 ' + v + ' (层 ' + d + ')', en: 'visit ' + v + ' (level ' + d + ')' }).setBars(order.map((x, i) => ({ value: i, role: 'final' as BarRole, label: x }))).commit(); } });
  rec.begin({ zh: '顺序：' + order.join(' → '), en: 'Order: ' + order.join(' → ') }).setBars(order.map((x, i) => ({ value: i + 1, role: 'final' as BarRole, label: x }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfs } from '../../src/algorithms/network/net-bfs-traversal/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bfs-traversal/trace.ts';
const G = { nodes: ['A','B','C','D'], edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'}] };
test('bfs 从 A', () => {
  assert.deepEqual(bfs(G, 'A'), ['A','B','C','D']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 3. net-connected-components  —— 连通分量
ALGS.push({
  id: 'net-connected-components',
  m: ['连通分量', 'Connected Components', '求无向图连通分量数。', 'Count connected components in an undirected graph.',
    '对每个未访问节点跑 DFS/BFS。', 'Run DFS from each unvisited node. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'components']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight?: number }>; }
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  return adj;
}
export interface CC Hooks { onComponent?: (members: string[]) => void; onResult?: (n: number) => void; }
export function connectedComponents(g: GraphInput, hooks = {}): string[][] {
  const adj = buildAdj(g);
  const visited = new Set<string>();
  const comps: string[][] = [];
  for (const start of g.nodes) {
    if (visited.has(start)) continue;
    const comp: string[] = [];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const u = stack.pop()!;
      comp.push(u);
      for (const v of adj.get(u) ?? []) if (!visited.has(v)) { visited.add(v); stack.push(v); }
    }
    comps.push(comp);
    hooks.onComponent?.(comp);
  }
  hooks.onResult?.(comps.length);
  return comps;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { connectedComponents, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E','F'],
  edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'D',to:'E'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '求连通分量', en: 'Connected components' }).commit();
  const comps = connectedComponents(input, { onComponent: (m) => rec.begin({ zh: '分量：{' + m.join(',') + '}', en: 'comp: {' + m.join(',') + '}' }).setBars(m.map((x, i) => ({ value: 1, role: 'final' as BarRole, label: x }))).commit() });
  rec.begin({ zh: '共 ' + comps.length + ' 个分量', en: comps.length + ' components' }).setAux([{ label: 'count', value: String(comps.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connectedComponents } from '../../src/algorithms/network/net-connected-components/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-connected-components/trace.ts';
test('connectedComponents 正确', () => {
  const cs = connectedComponents({ nodes: ['A','B','C','D','E','F'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'D',to:'E'}] });
  assert.equal(cs.length, 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 4. net-is-bipartite  —— 二分图判断
ALGS.push({
  id: 'net-is-bipartite',
  m: ['二分图判断', 'Is Bipartite', 'BFS 染色法判断二分图。', 'BFS two-coloring to test bipartiteness.',
    '交替染 0/1；遇到同色邻居则非二分图。', 'Alternate colors; same-color neighbor => not bipartite. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'bipartite']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  return adj;
}
export interface BipHooks { onColor?: (v: string, c: number) => void; onResult?: (b: boolean) => void; }
export function isBipartite(g: GraphInput, hooks: BipHooks = {}): boolean {
  const adj = buildAdj(g);
  const color = new Map<string, number>();
  for (const start of g.nodes) {
    if (color.has(start)) continue;
    color.set(start, 0);
    const q = [start];
    while (q.length) {
      const u = q.shift()!;
      hooks.onColor?.(u, color.get(u)!);
      for (const v of adj.get(u) ?? []) {
        if (!color.has(v)) { color.set(v, 1 - color.get(u)!); q.push(v); }
        else if (color.get(v) === color.get(u)) { hooks.onResult?.(false); return false; }
      }
    }
  }
  hooks.onResult?.(true);
  return true;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isBipartite, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二分图判断', en: 'Is bipartite' }).commit();
  const b = isBipartite(input, { onColor: (v, c) => rec.begin({ zh: v + ' 染色 ' + c, en: v + ' color ' + c }).setAux([{ label: 'color', value: String(c), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '二分图？' + b, en: 'bipartite? ' + b }).setAux([{ label: 'bipartite', value: String(b), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBipartite } from '../../src/algorithms/network/net-is-bipartite/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-is-bipartite/trace.ts';
test('isBipartite 正确', () => {
  assert.equal(isBipartite({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'}] }), true);
  assert.equal(isBipartite({ nodes: ['A','B','C'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'A'}] }), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 5. net-cycle-undirected  —— 无向图判环
ALGS.push({
  id: 'net-cycle-undirected',
  m: ['无向图判环', 'Cycle Detection (Undirected)', 'DFS 判断无向图是否有环。', 'DFS cycle detection in an undirected graph.',
    '记录父节点，若遇到已访问且非父则有环。', 'Track parent; visited non-parent => cycle. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'cycle']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  return adj;
}
export interface CycleHooks { onVisit?: (v: string) => void; onResult?: (has: boolean) => void; }
export function hasCycle(g: GraphInput, hooks: CycleHooks = {}): boolean {
  const adj = buildAdj(g);
  const visited = new Set<string>();
  const dfs = (u: string, parent: string | null): boolean => {
    visited.add(u);
    hooks.onVisit?.(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) { if (dfs(v, u)) return true; }
      else if (v !== parent) return true;
    }
    return false;
  };
  for (const s of g.nodes) if (!visited.has(s) && dfs(s, null)) { hooks.onResult?.(true); return true; }
  hooks.onResult?.(false);
  return false;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hasCycle, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'A'},{from:'C',to:'D'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '无向图判环', en: 'Cycle detection' }).commit();
  const has = hasCycle(input, { onVisit: (v) => rec.begin({ zh: '访问 ' + v, en: 'visit ' + v }).setAux([{ label: 'visit', value: v, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '有环？' + has, en: 'has cycle? ' + has }).setAux([{ label: 'hasCycle', value: String(has), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasCycle } from '../../src/algorithms/network/net-cycle-undirected/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-cycle-undirected/trace.ts';
test('hasCycle 正确', () => {
  assert.equal(hasCycle({ nodes: ['A','B','C'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'A'}] }), true);
  assert.equal(hasCycle({ nodes: ['A','B','C'], edges: [{from:'A',to:'B'},{from:'B',to:'C'}] }), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 6. net-topo-sort-kahn  —— 拓扑排序 Kahn
ALGS.push({
  id: 'net-topo-sort-kahn',
  m: ['拓扑排序Kahn', 'Topological Sort (Kahn)', 'BFS 入度法对 DAG 拓扑排序。', 'Kahn BFS in-degree based topological sort.',
    '统计入度，入度为 0 的入队，逐个剥离。', 'Peel zero-in-degree nodes. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'topological-sort']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export interface TopoHooks { onPop?: (v: string) => void; onResult?: (order: string[], hasCycle: boolean) => void; }
export function topologicalSort(g: GraphInput, hooks: TopoHooks = {}): { order: string[]; hasCycle: boolean } {
  const indeg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) { indeg.set(n, 0); adj.set(n, []); }
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1); }
  const q: string[] = [];
  for (const [n, d] of indeg) if (d === 0) q.push(n);
  const order: string[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    hooks.onPop?.(u);
    for (const v of adj.get(u) ?? []) { indeg.set(v, (indeg.get(v) ?? 0) - 1); if (indeg.get(v) === 0) q.push(v); }
  }
  const hasCycle = order.length !== g.nodes.length;
  hooks.onResult?.(order, hasCycle);
  return { order, hasCycle };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topologicalSort, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'},{from:'D',to:'E'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const order: string[] = [];
  rec.begin({ zh: '拓扑排序 Kahn', en: 'Topological sort' }).commit();
  topologicalSort(input, { onPop: (v) => { order.push(v); rec.begin({ zh: '弹出 ' + v, en: 'pop ' + v }).setBars(order.map((x, i) => ({ value: i + 1, role: 'pivot' as BarRole, label: x }))).commit(); } });
  rec.begin({ zh: '顺序：' + order.join(' → '), en: 'Order: ' + order.join(' → ') }).setBars(order.map((x, i) => ({ value: i + 1, role: 'final' as BarRole, label: x }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topologicalSort } from '../../src/algorithms/network/net-topo-sort-kahn/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-topo-sort-kahn/trace.ts';
test('topologicalSort 正确', () => {
  const r = topologicalSort({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'}] });
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[3], 'D');
  assert.equal(r.hasCycle, false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 7. net-strongly-connected  —— Kosaraju 强连通分量
ALGS.push({
  id: 'net-strongly-connected',
  m: ['强连通分量Kosaraju', 'Strongly Connected (Kosaraju)', 'Kosaraju 算法求有向图强连通分量。', 'Kosaraju SCC on a directed graph.',
    '一遍 DFS 记录完成序，反图按逆序再 DFS。', 'DFS finish order, then DFS on reversed graph. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'scc']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export interface SccHooks { onComponent?: (members: string[]) => void; onResult?: (n: number) => void; }
export function kosaraju(g: GraphInput, hooks: SccHooks = {}): string[][] {
  const adj = new Map<string, string[]>(), radj = new Map<string, string[]>();
  for (const n of g.nodes) { adj.set(n, []); radj.set(n, []); }
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); radj.get(e.to)!.push(e.from); }
  const visited = new Set<string>();
  const order: string[] = [];
  const dfs1 = (u: string) => { visited.add(u); for (const v of adj.get(u) ?? []) if (!visited.has(v)) dfs1(v); order.push(u); };
  for (const s of g.nodes) if (!visited.has(s)) dfs1(s);
  const visited2 = new Set<string>();
  const comp: string[] = [];
  const dfs2 = (u: string) => { visited2.add(u); comp.push(u); for (const v of radj.get(u) ?? []) if (!visited2.has(v)) dfs2(v); };
  const comps: string[][] = [];
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i]!;
    if (visited2.has(u)) continue;
    comp.length = 0;
    dfs2(u);
    comps.push([...comp]);
    hooks.onComponent?.([...comp]);
  }
  hooks.onResult?.(comps.length);
  return comps;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kosaraju, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'A'},{from:'C',to:'D'},{from:'D',to:'E'},{from:'E',to:'D'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Kosaraju SCC', en: 'Kosaraju SCC' }).commit();
  const comps = kosaraju(input, { onComponent: (m) => rec.begin({ zh: 'SCC：{' + m.join(',') + '}', en: 'SCC: {' + m.join(',') + '}' }).setBars(m.map((x) => ({ value: 1, role: 'final' as BarRole, label: x }))).commit() });
  rec.begin({ zh: '共 ' + comps.length + ' 个 SCC', en: comps.length + ' SCCs' }).setAux([{ label: 'count', value: String(comps.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kosaraju } from '../../src/algorithms/network/net-strongly-connected/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-strongly-connected/trace.ts';
test('kosaraju 正确', () => {
  const cs = kosaraju({ nodes: ['A','B','C','D','E'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'A'},{from:'C',to:'D'},{from:'D',to:'E'},{from:'E',to:'D'}] });
  assert.equal(cs.length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 8. net-dijkstra  —— Dijkstra 最短路
ALGS.push({
  id: 'net-dijkstra',
  m: ['Dijkstra最短路', 'Dijkstra Shortest Path', '非负权重图单源最短路。', 'Single-source shortest path on a non-negative weighted graph.',
    '贪心：每次取最小距离节点松弛邻居。', 'Greedy relax via min-heap simulation. O((V+E) log V).', 'O((V+E) log V)', 'O(V)', ['network', 'graph', 'shortest-path']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight: number }>; directed?: boolean; }
export function buildAdj(g: GraphInput): Map<string, Array<{ to: string; w: number }>> {
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push({ to: e.to, w: e.weight }); if (!g.directed) adj.get(e.to)!.push({ to: e.from, w: e.weight }); }
  return adj;
}
export interface DijkstraHooks { onRelax?: (u: string, v: string, nd: number) => void; onResult?: (dist: Map<string, number>) => void; }
export function dijkstra(g: GraphInput, src: string, hooks: DijkstraHooks = {}): Map<string, number> {
  const adj = buildAdj(g);
  const dist = new Map<string, number>();
  for (const n of g.nodes) dist.set(n, Infinity);
  dist.set(src, 0);
  const visited = new Set<string>();
  while (visited.size < g.nodes.length) {
    let u: string | null = null, best = Infinity;
    for (const [n, d] of dist) if (!visited.has(n) && d < best) { best = d; u = n; }
    if (u === null) break;
    visited.add(u);
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = dist.get(u)! + w;
      if (nd < dist.get(to)!) { dist.set(to, nd); hooks.onRelax?.(u, to, nd); }
    }
  }
  hooks.onResult?.(dist);
  return dist;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstra, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B',weight:4},{from:'A',to:'C',weight:2},{from:'C',to:'B',weight:1},{from:'B',to:'D',weight:5},{from:'C',to:'D',weight:8},{from:'D',to:'E',weight:2}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Dijkstra 从 A', en: 'Dijkstra from A' }).commit();
  const dist = dijkstra(input, 'A', { onRelax: (u, v, nd) => rec.begin({ zh: '松弛 ' + u + '→' + v + ' = ' + nd, en: 'relax ' + u + '→' + v + ' = ' + nd }).setAux([{ label: v, value: String(nd), role: 'pivot' as BarRole }]).commit() });
  const entries = [...dist.entries()].map(([k, v]) => ({ label: k, value: v === Infinity ? 999 : v, role: 'final' as BarRole }));
  rec.begin({ zh: '完成', en: 'Done' }).setBars(entries).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dijkstra } from '../../src/algorithms/network/net-dijkstra/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-dijkstra/trace.ts';
const G = { nodes: ['A','B','C','D','E'], edges: [{from:'A',to:'B',weight:4},{from:'A',to:'C',weight:2},{from:'C',to:'B',weight:1},{from:'B',to:'D',weight:5},{from:'C',to:'D',weight:8},{from:'D',to:'E',weight:2}] };
test('dijkstra 正确', () => {
  const d = dijkstra(G, 'A');
  assert.equal(d.get('A'), 0);
  assert.equal(d.get('B'), 3);
  assert.equal(d.get('E'), 10);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 9. net-bellman-ford  —— Bellman-Ford
ALGS.push({
  id: 'net-bellman-ford',
  m: ['Bellman-Ford', 'Bellman-Ford', '允许负权边的单源最短路，可检测负环。', 'Single-source shortest path allowing negative edges; detects negative cycles.',
    '对所有边松弛 V-1 轮；再松弛一次若仍能更新则有负环。', 'Relax all edges V-1 times; one more detects neg cycle. O(VE).', 'O(VE)', 'O(V)', ['network', 'graph', 'shortest-path']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight: number }>; directed?: boolean; }
export interface BfHooks { onRound?: (r: number, updated: boolean) => void; onResult?: (dist: Map<string, number>, negCycle: boolean) => void; }
export function bellmanFord(g: GraphInput, src: string, hooks: BfHooks = {}): { dist: Map<string, number>; negCycle: boolean } {
  const dist = new Map<string, number>();
  for (const n of g.nodes) dist.set(n, Infinity);
  dist.set(src, 0);
  const edges = g.edges.flatMap((e) => g.directed ? [e] : [e, { from: e.to, to: e.from, weight: e.weight }]);
  for (let r = 0; r < g.nodes.length - 1; r++) {
    let updated = false;
    for (const e of edges) {
      const du = dist.get(e.from)!;
      if (du === Infinity) continue;
      if (du + e.weight < dist.get(e.to)!) { dist.set(e.to, du + e.weight); updated = true; }
    }
    hooks.onRound?.(r + 1, updated);
    if (!updated) break;
  }
  let negCycle = false;
  for (const e of edges) { const du = dist.get(e.from)!; if (du !== Infinity && du + e.weight < dist.get(e.to)!) { negCycle = true; break; } }
  hooks.onResult?.(dist, negCycle);
  return { dist, negCycle };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellmanFord, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B',weight:4},{from:'A',to:'C',weight:5},{from:'B',to:'C',weight:-3},{from:'C',to:'D',weight:4}],
  directed: true,
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bellman-Ford 从 A', en: 'Bellman-Ford from A' }).commit();
  const { dist, negCycle } = bellmanFord(input, 'A', { onRound: (r, upd) => rec.begin({ zh: '第 ' + r + ' 轮，更新？' + upd, en: 'round ' + r + ' updated=' + upd }).setAux([{ label: 'round', value: String(r), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '负环？' + negCycle, en: 'neg cycle? ' + negCycle }).setBars([...dist.entries()].map(([k, v]) => ({ value: v === Infinity ? 99 : v, role: 'final' as BarRole, label: k }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bellmanFord } from '../../src/algorithms/network/net-bellman-ford/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bellman-ford/trace.ts';
test('bellmanFord 正确', () => {
  const { dist, negCycle } = bellmanFord({ nodes: ['A','B','C','D'], directed: true, edges: [{from:'A',to:'B',weight:4},{from:'A',to:'C',weight:5},{from:'B',to:'C',weight:-3},{from:'C',to:'D',weight:4}] }, 'A');
  assert.equal(dist.get('C'), 1);
  assert.equal(dist.get('D'), 5);
  assert.equal(negCycle, false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 10. net-floyd-warshall  —— 全源最短路
ALGS.push({
  id: 'net-floyd-warshall',
  m: ['Floyd-Warshall', 'Floyd-Warshall', '动态规划求全源最短路，支持负权。', 'All-pairs shortest path via DP; supports negative weights.',
    '枚举中转点 k：dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])。', 'Triple loop over k. O(V^3).', 'O(V^3)', 'O(V^2)', ['network', 'graph', 'all-pairs']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight: number }>; directed?: boolean; }
export interface FwHooks { onK?: (k: string) => void; onResult?: (dist: number[][]) => void; }
export function floydWarshall(g: GraphInput, hooks: FwHooks = {}): number[][] {
  const n = g.nodes.length;
  const idx = new Map(g.nodes.map((x, i) => [x, i] as const));
  const INF = 1 << 29;
  const dist: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)));
  for (const e of g.edges) { const i = idx.get(e.from)!, j = idx.get(e.to)!; dist[i]![j] = Math.min(dist[i]![j]!, e.weight); if (!g.directed) dist[j]![i] = Math.min(dist[j]![i]!, e.weight); }
  for (let k = 0; k < n; k++) {
    hooks.onK?.(g.nodes[k]!);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (dist[i]![k]! + dist[k]![j]! < dist[i]![j]!) dist[i]![j] = dist[i]![k]! + dist[k]![j]!;
    }
  }
  hooks.onResult?.(dist);
  return dist;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floydWarshall, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B',weight:1},{from:'B',to:'C',weight:2},{from:'A',to:'C',weight:8},{from:'C',to:'D',weight:1},{from:'B',to:'D',weight:5}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Floyd-Warshall', en: 'Floyd-Warshall' }).commit();
  const dist = floydWarshall(input, { onK: (k) => rec.begin({ zh: '中转点 ' + k, en: 'via ' + k }).setAux([{ label: 'via', value: k, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: 'A→D = ' + dist[0]![3], en: 'A→D = ' + dist[0]![3] }).setAux([{ label: 'A→D', value: String(dist[0]![3]), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floydWarshall } from '../../src/algorithms/network/net-floyd-warshall/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-floyd-warshall/trace.ts';
test('floydWarshall 正确', () => {
  const d = floydWarshall({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B',weight:1},{from:'B',to:'C',weight:2},{from:'A',to:'C',weight:8},{from:'C',to:'D',weight:1},{from:'B',to:'D',weight:5}] });
  assert.equal(d[0]![3], 4);
  assert.equal(d[0]![0], 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 11. net-prim-mst  —— Prim 最小生成树
ALGS.push({
  id: 'net-prim-mst',
  m: ['Prim最小生成树', 'Prim MST', '贪心选最小权边扩展生成树。', 'Greedy MST by growing from a source with min edges.',
    '从起点出发，每次把到树距离最小的节点加入。', 'Add nearest vertex each step. O(V^2).', 'O(V^2)', 'O(V)', ['network', 'graph', 'mst']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight: number }>; }
export interface PrimHooks { onAdd?: (v: string, w: number) => void; onResult?: (total: number) => void; }
export function primMST(g: GraphInput, hooks: PrimHooks = {}): number {
  const n = g.nodes.length;
  const idx = new Map(g.nodes.map((x, i) => [x, i] as const));
  const adj: Array<Array<{ to: number; w: number }>> = Array.from({ length: n }, () => []);
  for (const e of g.edges) { const i = idx.get(e.from)!, j = idx.get(e.to)!; adj[i].push({ to: j, w: e.weight }); adj[j].push({ to: i, w: e.weight }); }
  const inTree = new Array<boolean>(n).fill(false);
  const minEdge = new Array<number>(n).fill(Infinity);
  minEdge[0] = 0;
  let total = 0;
  for (let it = 0; it < n; it++) {
    let u = -1, best = Infinity;
    for (let v = 0; v < n; v++) if (!inTree[v] && minEdge[v]! < best) { best = minEdge[v]!; u = v; }
    if (u < 0) break;
    inTree[u] = true; total += minEdge[u]!;
    hooks.onAdd?.(g.nodes[u]!, minEdge[u]!);
    for (const { to, w } of adj[u]!) if (!inTree[to] && w < minEdge[to]!) minEdge[to] = w;
  }
  hooks.onResult?.(total);
  return total;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primMST, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B',weight:1},{from:'A',to:'C',weight:5},{from:'B',to:'C',weight:2},{from:'B',to:'D',weight:4},{from:'C',to:'D',weight:3}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Prim MST', en: 'Prim MST' }).commit();
  const total = primMST(input, { onAdd: (v, w) => rec.begin({ zh: '加入 ' + v + ' 边权 ' + w, en: 'add ' + v + ' w=' + w }).setAux([{ label: v, value: String(w), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '总权 = ' + total, en: 'total = ' + total }).setAux([{ label: 'total', value: String(total), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primMST } from '../../src/algorithms/network/net-prim-mst/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-prim-mst/trace.ts';
test('primMST 正确', () => {
  assert.equal(primMST({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B',weight:1},{from:'A',to:'C',weight:5},{from:'B',to:'C',weight:2},{from:'B',to:'D',weight:4},{from:'C',to:'D',weight:3}] }), 6);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 12. net-kruskal-mst  —— Kruskal MST
ALGS.push({
  id: 'net-kruskal-mst',
  m: ['Kruskal最小生成树', 'Kruskal MST', '按边权排序 + 并查集构造 MST。', 'Sort edges by weight, union-find to build MST.',
    '边按权排序，用并查集判环，依次加入。', 'Sort edges, union-find, add if no cycle. O(E log E).', 'O(E log E)', 'O(V)', ['network', 'graph', 'mst']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight: number }>; }
class DSU { parent: Map<string, string> = new Map(); constructor(ns: string[]) { for (const n of ns) this.parent.set(n, n); }
  find(x: string): string { const p = this.parent.get(x)!; if (p === x) return x; const r = this.find(p); this.parent.set(x, r); return r; }
  union(a: string, b: string): boolean { const ra = this.find(a), rb = this.find(b); if (ra === rb) return false; this.parent.set(ra, rb); return true; } }
export interface KruskalHooks { onPick?: (f: string, t: string, w: number) => void; onResult?: (total: number) => void; }
export function kruskalMST(g: GraphInput, hooks: KruskalHooks = {}): number {
  const dsu = new DSU(g.nodes);
  const sorted = [...g.edges].sort((a, b) => a.weight - b.weight);
  let total = 0, count = 0;
  for (const e of sorted) {
    if (dsu.union(e.from, e.to)) { total += e.weight; count++; hooks.onPick?.(e.from, e.to, e.weight); if (count === g.nodes.length - 1) break; }
  }
  hooks.onResult?.(total);
  return total;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kruskalMST, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B',weight:1},{from:'A',to:'C',weight:5},{from:'B',to:'C',weight:2},{from:'B',to:'D',weight:4},{from:'C',to:'D',weight:3}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Kruskal MST', en: 'Kruskal MST' }).commit();
  const total = kruskalMST(input, { onPick: (f, t, w) => rec.begin({ zh: '选边 ' + f + '-' + t + ' w=' + w, en: 'pick ' + f + '-' + t + ' w=' + w }).setBars([{ value: w, role: 'pivot' as BarRole, label: f + '-' + t }]).commit() });
  rec.begin({ zh: '总权 = ' + total, en: 'total = ' + total }).setAux([{ label: 'total', value: String(total), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kruskalMST } from '../../src/algorithms/network/net-kruskal-mst/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-kruskal-mst/trace.ts';
test('kruskalMST 正确', () => {
  assert.equal(kruskalMST({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B',weight:1},{from:'A',to:'C',weight:5},{from:'B',to:'C',weight:2},{from:'B',to:'D',weight:4},{from:'C',to:'D',weight:3}] }), 6);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 13. net-union-find  —— 并查集
ALGS.push({
  id: 'net-union-find',
  m: ['并查集', 'Union-Find', '带路径压缩与按秩合并的并查集。', 'Disjoint-set with path compression and union by rank.',
    'find 路径压缩，union 按秩合并，近 O(1) 均摊。', 'Path compression + union by rank. O(α(n)) amortized.', 'O(α(n))', 'O(n)', ['network', 'graph', 'union-find']],
  impl: `export interface UFHooks { onUnion?: (a: string, b: string) => void; onFind?: (root: string) => void; }
export class UnionFind {
  parent: Map<string, string> = new Map();
  rank: Map<string, number> = new Map();
  constructor(ns: string[]) { for (const n of ns) { this.parent.set(n, n); this.rank.set(n, 0); } }
  find(x: string, hooks?: UFHooks): string { const p = this.parent.get(x)!; if (p === x) return x; const r = this.find(p, hooks); this.parent.set(x, r); hooks?.onFind?.(r); return r; }
  union(a: string, b: string, hooks: UFHooks = {}): boolean { const ra = this.find(a, hooks), rb = this.find(b, hooks); if (ra === rb) return false; const ra2 = this.rank.get(ra)!, rb2 = this.rank.get(rb)!; if (ra2 < rb2) this.parent.set(ra, rb); else if (ra2 > rb2) this.parent.set(rb, ra); else { this.parent.set(rb, ra); this.rank.set(ra, ra2 + 1); } hooks.onUnion?.(a, b); return true; }
  count(): number { const roots = new Set<string>(); for (const n of this.parent.keys()) roots.add(this.find(n)); return roots.size; }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UnionFind } from './impl.ts';
export const DEFAULT_INPUT = { nodes: ['A','B','C','D','E'], unions: [['A','B'],['C','D'],['B','C']] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const uf = new UnionFind(input.nodes);
  rec.begin({ zh: '并查集', en: 'Union-Find' }).commit();
  for (const [a, b] of input.unions) uf.union(a, b, { onUnion: (x, y) => rec.begin({ zh: 'union(' + x + ',' + y + ')', en: 'union(' + x + ',' + y + ')' }).setAux([{ label: 'union', value: x + ',' + y, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '集合数 = ' + uf.count(), en: 'sets = ' + uf.count() }).setAux([{ label: 'count', value: String(uf.count()), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UnionFind } from '../../src/algorithms/network/net-union-find/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-union-find/trace.ts';
test('UnionFind 正确', () => {
  const uf = new UnionFind(['A','B','C','D']);
  uf.union('A','B'); uf.union('C','D');
  assert.equal(uf.find('A'), uf.find('B'));
  assert.notEqual(uf.find('A'), uf.find('C'));
  uf.union('B','C');
  assert.equal(uf.find('A'), uf.find('D'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 14. net-articulation  —— 割点 (Tarjan)
ALGS.push({
  id: 'net-articulation',
  m: ['割点Tarjan', 'Articulation Points (Tarjan)', 'Tarjan 算法求无向图割点。', 'Tarjan algorithm for articulation points.',
    'DFS 记录 disc/low；根有≥2 子树或非根 low[child]≥disc[u] 则为割点。', 'DFS with disc/low; root with 2+ children or low[child]>=disc[u]. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'articulation']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export interface ArtHooks { onArticulation?: (v: string) => void; onResult?: (pts: string[]) => void; }
export function articulationPoints(g: GraphInput, hooks: ArtHooks = {}): string[] {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  const disc = new Map<string, number>(), low = new Map<string, number>();
  const isArt = new Set<string>();
  let timer = 0;
  const dfs = (u: string, parent: string | null) => {
    disc.set(u, timer); low.set(u, timer); timer++;
    let children = 0;
    for (const v of adj.get(u) ?? []) {
      if (!disc.has(v)) { children++; dfs(v, u); low.set(u, Math.min(low.get(u)!, low.get(v)!)); if ((parent === null && children > 1) || (parent !== null && low.get(v)! >= disc.get(u)!)) { isArt.add(u); hooks.onArticulation?.(u); } }
      else if (v !== parent) low.set(u, Math.min(low.get(u)!, disc.get(v)!));
    }
  };
  for (const s of g.nodes) if (!disc.has(s)) dfs(s, null);
  const pts = [...isArt];
  hooks.onResult?.(pts);
  return pts;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { articulationPoints, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'},{from:'D',to:'E'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '求割点', en: 'Articulation points' }).commit();
  const pts = articulationPoints(input, { onArticulation: (v) => rec.begin({ zh: '割点 ' + v, en: 'articulation ' + v }).setAux([{ label: 'art', value: v, role: 'swap' as BarRole }]).commit() });
  rec.begin({ zh: '割点：' + pts.join(','), en: 'points: ' + pts.join(',') }).setBars(pts.map((p) => ({ value: 1, role: 'final' as BarRole, label: p }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { articulationPoints } from '../../src/algorithms/network/net-articulation/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-articulation/trace.ts';
test('articulationPoints 正确', () => {
  const pts = articulationPoints({ nodes: ['A','B','C','D','E'], edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'},{from:'D',to:'E'}] });
  assert.ok(pts.includes('D'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 15. net-bridge  —— 桥 (Tarjan)
ALGS.push({
  id: 'net-bridge',
  m: ['桥Tarjan', 'Bridges (Tarjan)', 'Tarjan 算法求无向图桥。', 'Tarjan algorithm for bridges.',
    'DFS：low[child] > disc[u] 则 (u,child) 是桥。', 'low[child] > disc[u] => bridge. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'bridge']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export interface BridgeHooks { onBridge?: (a: string, b: string) => void; onResult?: (bridges: Array<[string,string]>) => void; }
export function findBridges(g: GraphInput, hooks: BridgeHooks = {}): Array<[string, string]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  const disc = new Map<string, number>(), low = new Map<string, number>();
  const bridges: Array<[string, string]> = [];
  let timer = 0;
  const dfs = (u: string, parent: string | null) => {
    disc.set(u, timer); low.set(u, timer); timer++;
    for (const v of adj.get(u) ?? []) {
      if (!disc.has(v)) { dfs(v, u); low.set(u, Math.min(low.get(u)!, low.get(v)!)); if (low.get(v)! > disc.get(u)!) { bridges.push([u, v]); hooks.onBridge?.(u, v); } }
      else if (v !== parent) low.set(u, Math.min(low.get(u)!, disc.get(v)!));
    }
  };
  for (const s of g.nodes) if (!disc.has(s)) dfs(s, null);
  hooks.onResult?.(bridges);
  return bridges;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findBridges, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '求桥', en: 'Find bridges' }).commit();
  const bs = findBridges(input, { onBridge: (a, b) => rec.begin({ zh: '桥 ' + a + '-' + b, en: 'bridge ' + a + '-' + b }).setAux([{ label: 'bridge', value: a + '-' + b, role: 'swap' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + bs.length + ' 座桥', en: bs.length + ' bridges' }).setAux([{ label: 'count', value: String(bs.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findBridges } from '../../src/algorithms/network/net-bridge/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bridge/trace.ts';
test('findBridges 正确', () => {
  const bs = findBridges({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'}] });
  assert.equal(bs.length, 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 16. net-euler-path  —— 欧拉路径判断
ALGS.push({
  id: 'net-euler-path',
  m: ['欧拉路径判断', 'Euler Path Check', '判断无向图是否存在欧拉路径/回路。', 'Check if an undirected graph has an Euler path/circuit.',
    '连通且奇度点数为 0 或 2。', 'Connected and odd-degree count is 0 or 2. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'euler']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export interface EulerHooks { onDegree?: (v: string, deg: number) => void; onResult?: (kind: 'circuit' | 'path' | 'none') => void; }
export function eulerKind(g: GraphInput, hooks: EulerHooks = {}): 'circuit' | 'path' | 'none' {
  const deg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) { deg.set(n, 0); adj.set(n, []); }
  for (const e of g.edges) { deg.set(e.from, deg.get(e.from)! + 1); deg.set(e.to, deg.get(e.to)! + 1); adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  for (const [v, d] of deg) hooks.onDegree?.(v, d);
  // 连通性
  const visited = new Set<string>();
  const stack = [g.nodes[0] ?? ''];
  while (stack.length) { const u = stack.pop()!; if (visited.has(u)) continue; visited.add(u); for (const v of adj.get(u) ?? []) if (!visited.has(v)) stack.push(v); }
  for (const n of g.nodes) if (!visited.has(n) && deg.get(n)! > 0) { hooks.onResult?.('none'); return 'none'; }
  const odd = [...deg.values()].filter((d) => d % 2 === 1).length;
  const kind: 'circuit' | 'path' | 'none' = odd === 0 ? 'circuit' : odd === 2 ? 'path' : 'none';
  hooks.onResult?.(kind);
  return kind;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerKind, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'D',to:'A'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '欧拉路径判断', en: 'Euler path check' }).commit();
  const k = eulerKind(input, { onDegree: (v, d) => rec.begin({ zh: '度 ' + v + '=' + d, en: 'deg ' + v + '=' + d }).setAux([{ label: v, value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '类型：' + k, en: 'kind: ' + k }).setAux([{ label: 'kind', value: k, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerKind } from '../../src/algorithms/network/net-euler-path/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-euler-path/trace.ts';
test('eulerKind 正确', () => {
  assert.equal(eulerKind({ nodes: ['A','B','C','D'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'D',to:'A'}] }), 'circuit');
  assert.equal(eulerKind({ nodes: ['A','B','C'], edges: [{from:'A',to:'B'},{from:'B',to:'C'}] }), 'path');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 17. net-bipartite-match-greedy  —— 二分图贪心匹配
ALGS.push({
  id: 'net-bipartite-match-greedy',
  m: ['贪心二分匹配', 'Greedy Bipartite Matching', '对二分图边贪心匹配。', 'Greedy matching on a bipartite graph.',
    '按边顺序，若两端都未匹配则匹配。', 'For each edge, match if both free. O(E).', 'O(E)', 'O(V)', ['network', 'graph', 'matching']],
  impl: `export interface GraphInput { left: string[]; right: string[]; edges: Array<{ from: string; to: string }>; }
export interface MatchHooks { onMatch?: (a: string, b: string) => void; onResult?: (size: number) => void; }
export function greedyMatching(g: GraphInput, hooks: MatchHooks = {}): number {
  const matchedL = new Set<string>(), matchedR = new Set<string>();
  let size = 0;
  for (const e of g.edges) {
    if (!matchedL.has(e.from) && !matchedR.has(e.to)) { matchedL.add(e.from); matchedR.add(e.to); size++; hooks.onMatch?.(e.from, e.to); }
  }
  hooks.onResult?.(size);
  return size;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMatching, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  left: ['L1','L2','L3'], right: ['R1','R2','R3'],
  edges: [{from:'L1',to:'R1'},{from:'L1',to:'R2'},{from:'L2',to:'R1'},{from:'L2',to:'R3'},{from:'L3',to:'R2'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贪心二分匹配', en: 'Greedy matching' }).commit();
  const sz = greedyMatching(input, { onMatch: (a, b) => rec.begin({ zh: '匹配 ' + a + '-' + b, en: 'match ' + a + '-' + b }).setBars([{ value: 1, role: 'final' as BarRole, label: a + '-' + b }]).commit() });
  rec.begin({ zh: '匹配数 = ' + sz, en: 'size = ' + sz }).setAux([{ label: 'size', value: String(sz), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMatching } from '../../src/algorithms/network/net-bipartite-match-greedy/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-bipartite-match-greedy/trace.ts';
test('greedyMatching >= 某值', () => {
  const sz = greedyMatching({ left: ['L1','L2','L3'], right: ['R1','R2','R3'], edges: [{from:'L1',to:'R1'},{from:'L1',to:'R2'},{from:'L2',to:'R1'},{from:'L2',to:'R3'},{from:'L3',to:'R2'}] });
  assert.ok(sz >= 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 18. net-grid-flood-fill  —— 网格 Flood Fill (作为图)
ALGS.push({
  id: 'net-grid-flood-fill',
  m: ['网格洪泛填充', 'Grid Flood Fill', '把网格中连通的同色区域改为新颜色。', 'Change connected same-color region to a new color.',
    '从起点 DFS/BFS 改色。', 'DFS/BFS from seed. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'flood-fill']],
  impl: `export interface FloodHooks { onFill?: (r: number, c: number) => void; onResult?: (grid: number[][]) => void; }
export function floodFill(grid: number[][], sr: number, sc: number, newColor: number, hooks: FloodHooks = {}): number[][] {
  const orig = grid[sr]?.[sc];
  if (orig === undefined || orig === newColor) return grid;
  const R = grid.length, C = grid[0]!.length;
  const stack: Array<[number, number]> = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r]![c] !== orig) continue;
    grid[r]![c] = newColor;
    hooks.onFill?.(r, c);
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
  }
  hooks.onResult?.(grid);
  return grid;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floodFill } from './impl.ts';
export const DEFAULT_INPUT = { grid: [[1,1,1],[1,1,0],[1,0,1]], sr: 1, sc: 1, color: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const g = input.grid.map((r) => [...r]);
  rec.begin({ zh: 'Flood Fill 从 (1,1)', en: 'Flood fill from (1,1)' }).commit();
  floodFill(g, input.sr, input.sc, input.color, { onFill: (r, c) => rec.begin({ zh: '填充 (' + r + ',' + c + ')', en: 'fill (' + r + ',' + c + ')' }).setGrid(g.map((row) => row.map((v) => String(v)))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setGrid(g.map((row) => row.map((v) => String(v)))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floodFill } from '../../src/algorithms/network/net-grid-flood-fill/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-grid-flood-fill/trace.ts';
test('floodFill 正确', () => {
  const g = [[1,1,1],[1,1,0],[1,0,1]];
  assert.deepEqual(floodFill(g, 1, 1, 2), [[2,2,2],[2,2,0],[2,0,1]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 19. net-num-islands  —— 岛屿数量
ALGS.push({
  id: 'net-num-islands',
  m: ['岛屿数量', 'Number of Islands', '网格中 1 连通块数量。', 'Count connected components of 1s in a grid.',
    '对每个未访问的 1 做 DFS 沉岛。', 'DFS sink each unvisited 1. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'components']],
  impl: `export interface IslandHooks { onIsland?: (r: number, c: number) => void; onResult?: (n: number) => void; }
export function numIslands(grid: string[][], hooks: IslandHooks = {}): number {
  const R = grid.length; if (R === 0) return 0; const C = grid[0]!.length;
  let count = 0;
  const sink = (r: number, c: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r]![c] !== '1') return;
    grid[r]![c] = '0';
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r]![c] === '1') { count++; hooks.onIsland?.(r, c); sink(r, c); }
  hooks.onResult?.(count);
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numIslands } from './impl.ts';
export const DEFAULT_GRID = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']];
export function buildTrace(grid: string[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '岛屿数量', en: 'Num islands' }).commit();
  const n = numIslands(grid, { onIsland: (r, c) => rec.begin({ zh: '新岛起于 (' + r + ',' + c + ')', en: 'island at (' + r + ',' + c + ')' }).setGrid(grid.map((row) => row.map((v) => v)))).commit() });
  rec.begin({ zh: '共 ' + n + ' 座岛', en: n + ' islands' }).setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numIslands } from '../../src/algorithms/network/net-num-islands/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-num-islands/trace.ts';
test('numIslands 正确', () => {
  assert.equal(numIslands([['1','1','0'],['1','0','0'],['0','0','1']].map((r) => [...r])), 2);
  assert.equal(numIslands([['1','1','1'],['0','1','0'],['1','1','1']].map((r) => [...r])), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 20. net-max-area-island  —— 最大岛屿面积
ALGS.push({
  id: 'net-max-area-island',
  m: ['最大岛屿面积', 'Max Area of Island', '网格中 1 连通块的最大面积。', 'Maximum area of connected 1s in a grid.',
    'DFS 计算每个岛面积取最大。', 'DFS area per island, take max. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'area']],
  impl: `export interface AreaHooks { onArea?: (r: number, c: number, area: number) => void; onResult?: (max: number) => void; }
export function maxAreaOfIsland(grid: number[][], hooks: AreaHooks = {}): number {
  const R = grid.length; if (R === 0) return 0; const C = grid[0]!.length;
  const dfs = (r: number, c: number): number => {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r]![c] !== 1) return 0;
    grid[r]![c] = 0;
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
  };
  let max = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r]![c] === 1) { const a = dfs(r, c); max = Math.max(max, a); hooks.onArea?.(r, c, a); }
  hooks.onResult?.(max);
  return max;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxAreaOfIsland } from './impl.ts';
export const DEFAULT_GRID = [[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0],[1,1,0,0,0]];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最大岛屿面积', en: 'Max island area' }).commit();
  const m = maxAreaOfIsland(grid, { onArea: (r, c, a) => rec.begin({ zh: '岛 (' + r + ',' + c + ') 面积 ' + a, en: 'island (' + r + ',' + c + ') area ' + a }).setAux([{ label: 'area', value: String(a), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最大面积 = ' + m, en: 'max = ' + m }).setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxAreaOfIsland } from '../../src/algorithms/network/net-max-area-island/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-max-area-island/trace.ts';
test('maxAreaOfIsland 正确', () => {
  assert.equal(maxAreaOfIsland([[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0],[1,1,0,0,0]].map((r) => [...r])), 5);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 21. net-walls-gates  —— 墙与门 BFS
ALGS.push({
  id: 'net-walls-gates',
  m: ['墙与门', 'Walls and Gates', '每个房间填到最近门的距离（-1 墙、INF 空、0 门）。', 'Fill each empty room with distance to nearest gate.',
    '多源 BFS：所有门同时入队。', 'Multi-source BFS from all gates. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'multi-bfs']],
  impl: `export interface GateHooks { onFill?: (r: number, c: number, d: number) => void; onResult?: (grid: number[][]) => void; }
const INF = 2147483647;
export function wallsAndGates(grid: number[][], hooks: GateHooks = {}): number[][] {
  const R = grid.length; if (R === 0) return grid; const C = grid[0]!.length;
  const q: Array<[number, number]> = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r]![c] === 0) q.push([r, c]);
  while (q.length) {
    const [r, c] = q.shift()!;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr]![nc] !== INF) continue;
      grid[nr]![nc] = grid[r]![c]! + 1;
      hooks.onFill?.(nr, nc, grid[nr]![nc]!);
      q.push([nr, nc]);
    }
  }
  hooks.onResult?.(grid);
  return grid;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wallsAndGates } from './impl.ts';
const INF = 2147483647;
export const DEFAULT_GRID = [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '墙与门', en: 'Walls and gates' }).commit();
  wallsAndGates(grid, { onFill: (r, c, d) => rec.begin({ zh: '填充 (' + r + ',' + c + ') = ' + d, en: 'fill (' + r + ',' + c + ') = ' + d }).setAux([{ label: 'dist', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setGrid(grid.map((row) => row.map((v) => v === -1 ? '#' : String(v)))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wallsAndGates } from '../../src/algorithms/network/net-walls-gates/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-walls-gates/trace.ts';
const INF = 2147483647;
test('wallsAndGates 正确', () => {
  const g = [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]].map((r) => [...r]);
  wallsAndGates(g);
  assert.deepEqual(g, [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 22. net-course-schedule  —— 课程表（拓扑判环）
ALGS.push({
  id: 'net-course-schedule',
  m: ['课程表', 'Course Schedule', '判断 prerequisites 是否能完成（拓扑判环）。', 'Whether all courses can be finished (cycle detection).',
    '拓扑排序，若 order 不全则有环。', 'Topo sort; incomplete => cycle. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'topological-sort']],
  impl: `export interface CsHooks { onTake?: (c: number) => void; onResult?: (ok: boolean) => void; }
export function canFinish(numCourses: number, prerequisites: Array<[number, number]>, hooks: CsHooks = {}): boolean {
  const indeg = new Array<number>(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) { adj[b]!.push(a); indeg[a]!++; }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);
  let count = 0;
  while (q.length) {
    const u = q.shift()!;
    count++; hooks.onTake?.(u);
    for (const v of adj[u]!) { indeg[v]!--; if (indeg[v] === 0) q.push(v); }
  }
  const ok = count === numCourses;
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canFinish } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, pre: [[1,0],[2,1],[3,2]] as Array<[number,number]> };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '课程表 ' + input.n + ' 门', en: 'Course schedule ' + input.n }).commit();
  const ok = canFinish(input.n, input.pre, { onTake: (c) => rec.begin({ zh: '修课 ' + c, en: 'take ' + c }).setAux([{ label: 'course', value: String(c), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '能完成？' + ok, en: 'ok? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canFinish } from '../../src/algorithms/network/net-course-schedule/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-course-schedule/trace.ts';
test('canFinish 正确', () => {
  assert.equal(canFinish(4, [[1,0],[2,1],[3,2]]), true);
  assert.equal(canFinish(2, [[0,1],[1,0]]), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 23. net-clone-graph  —— 克隆图
ALGS.push({
  id: 'net-clone-graph',
  m: ['克隆图', 'Clone Graph', '深拷贝无向图节点（带邻居）。', 'Deep-copy an undirected graph node with neighbors.',
    'BFS/DFS + Map 记录已克隆节点。', 'BFS + map of cloned nodes. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'clone']],
  impl: `export interface GNode { val: string; neighbors: GNode[]; }
export interface CloneHooks { onClone?: (val: string) => void; onResult?: (root: GNode | null) => void; }
export function cloneGraph(node: GNode | null, hooks: CloneHooks = {}): GNode | null {
  if (!node) { hooks.onResult?.(null); return null; }
  const map = new Map<string, GNode>();
  const q: GNode[] = [node];
  map.set(node.val, { val: node.val, neighbors: [] });
  while (q.length) {
    const cur = q.shift()!;
    for (const nb of cur.neighbors) {
      if (!map.has(nb.val)) { map.set(nb.val, { val: nb.val, neighbors: [] }); q.push(nb); }
      map.get(cur.val)!.neighbors.push(map.get(nb.val)!);
    }
    hooks.onClone?.(cur.val);
  }
  const r = map.get(node.val)!;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cloneGraph, type GNode } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1: GNode = { val: '1', neighbors: [] }, n2: GNode = { val: '2', neighbors: [] }, n3: GNode = { val: '3', neighbors: [] };
  n1.neighbors = [n2, n3]; n2.neighbors = [n1]; n3.neighbors = [n1];
  rec.begin({ zh: '克隆图', en: 'Clone graph' }).commit();
  const c = cloneGraph(n1, { onClone: (v) => rec.begin({ zh: '克隆 ' + v, en: 'clone ' + v }).setAux([{ label: 'clone', value: v, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '克隆根 = ' + (c?.val ?? null), en: 'clone root = ' + (c?.val ?? null) }).setAux([{ label: 'root', value: String(c?.val), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cloneGraph, type GNode } from '../../src/algorithms/network/net-clone-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-clone-graph/trace.ts';
test('cloneGraph 深拷贝', () => {
  const n1: GNode = { val: '1', neighbors: [] }, n2: GNode = { val: '2', neighbors: [] };
  n1.neighbors = [n2]; n2.neighbors = [n1];
  const c1 = cloneGraph(n1)!;
  assert.equal(c1.val, '1');
  assert.notEqual(c1, n1);
  assert.equal(c1.neighbors[0]!.val, '2');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 24. net-snake-ladder  —— 蛇梯棋 BFS 最少步数
ALGS.push({
  id: 'net-snake-ladder',
  m: ['蛇梯棋', 'Snakes and Ladders', 'BFS 求蛇梯棋从 1 到 n² 的最少步数。', 'Min moves from 1 to n^2 in snakes and ladders.',
    '每步掷骰 1-6，遇梯子/蛇瞬移。BFS。', 'BFS with dice 1-6; teleports. O(n^2).', 'O(n^2)', 'O(n^2)', ['network', 'graph', 'bfs']],
  impl: `export interface SlHooks { onMove?: (pos: number) => void; onResult?: (moves: number) => void; }
export function snakesAndLadders(board: number[][], hooks: SlHooks = {}): number {
  const n = board.length;
  const target = n * n;
  const getPos = (sq: number): number => {
    const r = n - 1 - Math.floor((sq - 1) / n);
    let c = (sq - 1) % n;
    if ((n - 1 - r) % 2 === 1) c = n - 1 - c;
    return board[r]![c]!;
  };
  const visited = new Array<boolean>(target + 1).fill(false);
  const q: Array<[number, number]> = [[1, 0]];
  visited[1] = true;
  while (q.length) {
    const [sq, moves] = q.shift()!;
    for (let d = 1; d <= 6; d++) {
      let next = sq + d;
      if (next > target) continue;
      const tele = getPos(next);
      if (tele !== -1) next = tele;
      if (next === target) { hooks.onMove?.(next); hooks.onResult?.(moves + 1); return moves + 1; }
      if (!visited[next]) { visited[next] = true; hooks.onMove?.(next); q.push([next, moves + 1]); }
    }
  }
  hooks.onResult?.(-1);
  return -1;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snakesAndLadders } from './impl.ts';
export const DEFAULT_BOARD = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]];
export function buildTrace(board: number[][] = DEFAULT_BOARD.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '蛇梯棋', en: 'Snakes and ladders' }).commit();
  const m = snakesAndLadders(board, { onMove: (p) => rec.begin({ zh: '到达 ' + p, en: 'reach ' + p }).setAux([{ label: 'pos', value: String(p), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最少步数 = ' + m, en: 'min moves = ' + m }).setAux([{ label: 'moves', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snakesAndLadders } from '../../src/algorithms/network/net-snake-ladder/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-snake-ladder/trace.ts';
test('snakesAndLadders 正确', () => {
  assert.equal(snakesAndLadders([[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]), 4);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 25. net-rotten-oranges  —— 腐烂橘子多源BFS
ALGS.push({
  id: 'net-rotten-oranges',
  m: ['腐烂橘子', 'Rotten Oranges', '每分钟四向传染，求所有橘子腐烂的最少分钟。', 'Min minutes to rot all oranges (4-dir per minute).',
    '多源 BFS，所有初始腐烂点入队。', 'Multi-source BFS. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'multi-bfs']],
  impl: `export interface OrangeHooks { onRot?: (r: number, c: number, minute: number) => void; onResult?: (minutes: number) => void; }
export function orangesRotting(grid: number[][], hooks: OrangeHooks = {}): number {
  const R = grid.length, C = grid[0]!.length;
  const q: Array<[number, number, number]> = [];
  let fresh = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { if (grid[r]![c] === 2) q.push([r, c, 0]); else if (grid[r]![c] === 1) fresh++; }
  let minutes = 0;
  while (q.length) {
    const [r, c, m] = q.shift()!;
    minutes = Math.max(minutes, m);
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr]![nc] !== 1) continue;
      grid[nr]![nc] = 2; fresh--;
      hooks.onRot?.(nr, nc, m + 1);
      q.push([nr, nc, m + 1]);
    }
  }
  const r = fresh === 0 ? minutes : -1;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { orangesRotting } from './impl.ts';
export const DEFAULT_GRID = [[2,1,1],[1,1,0],[0,1,1]];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '腐烂橘子', en: 'Rotten oranges' }).commit();
  const m = orangesRotting(grid, { onRot: (r, c, mm) => rec.begin({ zh: '腐烂 (' + r + ',' + c + ') 第 ' + mm + ' 分钟', en: 'rot (' + r + ',' + c + ') min ' + mm }).setAux([{ label: 'min', value: String(mm), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '分钟 = ' + m, en: 'minutes = ' + m }).setAux([{ label: 'minutes', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orangesRotting } from '../../src/algorithms/network/net-rotten-oranges/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-rotten-oranges/trace.ts';
test('orangesRotting 正确', () => {
  assert.equal(orangesRotting([[2,1,1],[1,1,0],[0,1,1]].map((r) => [...r])), 4);
  assert.equal(orangesRotting([[2,1,1],[0,1,1],[1,0,1]].map((r) => [...r])), -1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 26. net-word-ladder  —— 单词接龙 BFS
ALGS.push({
  id: 'net-word-ladder',
  m: ['单词接龙', 'Word Ladder', 'BFS 找 beginWord 到 endWord 最短转换序列长度（每次改一个字母）。', 'Shortest transformation length changing one letter per step.',
    'BFS：对当前词每个位置尝试 a-z。', 'BFS, try a-z at each position. O(N*L*26).', 'O(N*L)', 'O(N)', ['network', 'graph', 'bfs']],
  impl: `export interface WlHooks { onVisit?: (w: string, dist: number) => void; onResult?: (len: number) => void; }
export function ladderLength(beginWord: string, endWord: string, wordList: string[], hooks: WlHooks = {}): number {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) { hooks.onResult?.(0); return 0; }
  const visited = new Set<string>([beginWord]);
  const q: Array<[string, number]> = [[beginWord, 1]];
  while (q.length) {
    const [w, d] = q.shift()!;
    for (let i = 0; i < w.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c);
        if (ch === w[i]) continue;
        const nw = w.slice(0, i) + ch + w.slice(i + 1);
        if (nw === endWord) { hooks.onVisit?.(nw, d + 1); hooks.onResult?.(d + 1); return d + 1; }
        if (dict.has(nw) && !visited.has(nw)) { visited.add(nw); hooks.onVisit?.(nw, d + 1); q.push([nw, d + 1]); }
      }
    }
  }
  hooks.onResult?.(0);
  return 0;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ladderLength } from './impl.ts';
export const DEFAULT_INPUT = { begin: 'hit', end: 'cog', list: ['hot','dot','dog','lot','log','cog'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '单词接龙 ' + input.begin + '→' + input.end, en: 'Word ladder ' + input.begin + '→' + input.end }).commit();
  const len = ladderLength(input.begin, input.end, input.list, { onVisit: (w, d) => rec.begin({ zh: '访问 ' + w + ' (步 ' + d + ')', en: 'visit ' + w + ' (step ' + d + ')' }).setAux([{ label: 'word', value: w, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '长度 = ' + len, en: 'length = ' + len }).setAux([{ label: 'length', value: String(len), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladderLength } from '../../src/algorithms/network/net-word-ladder/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-word-ladder/trace.ts';
test('ladderLength 正确', () => {
  assert.equal(ladderLength('hit', 'cog', ['hot','dot','dog','lot','log','cog']), 5);
  assert.equal(ladderLength('hit', 'cog', ['hot','dot','dog','lot','log']), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 27. net-redundant-conn  —— 冗余连接
ALGS.push({
  id: 'net-redundant-conn',
  m: ['冗余连接', 'Redundant Connection', '无向图加一条边成环，找出那条多余边。', 'Find the extra edge that creates a cycle.',
    '并查集：第一条 union 失败的边即答案。', 'Union-find; first failed union is answer. O(E α).', 'O(E α(n))', 'O(n)', ['network', 'graph', 'union-find']],
  impl: `export interface RcHooks { onCheck?: (a: number, b: number, cycle: boolean) => void; onResult?: (edge: Array<number>) => void; }
export function findRedundantConnection(edges: Array<[number, number]>, hooks: RcHooks = {}): Array<number> {
  const parent = new Map<number, number>();
  const find = (x: number): number => { if (!parent.has(x)) parent.set(x, x); const p = parent.get(x)!; if (p === x) return x; parent.set(x, find(p)); return parent.get(x)!; };
  const union = (a: number, b: number): boolean => { const ra = find(a), rb = find(b); if (ra === rb) return false; parent.set(ra, rb); return true; };
  for (const [a, b] of edges) {
    if (!union(a, b)) { hooks.onCheck?.(a, b, true); hooks.onResult?.([a, b]); return [a, b]; }
    hooks.onCheck?.(a, b, false);
  }
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findRedundantConnection } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [[1,2],[1,3],[2,3]];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '冗余连接', en: 'Redundant connection' }).commit();
  const e = findRedundantConnection(input, { onCheck: (a, b, cycle) => rec.begin({ zh: a + '-' + b + (cycle ? ' 成环' : ''), en: a + '-' + b + (cycle ? ' cycle' : '') }).setAux([{ label: 'cycle', value: String(cycle), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '冗余边：' + e.join('-'), en: 'redundant: ' + e.join('-') }).setAux([{ label: 'edge', value: e.join('-'), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findRedundantConnection } from '../../src/algorithms/network/net-redundant-conn/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-redundant-conn/trace.ts';
test('findRedundantConnection 正确', () => {
  assert.deepEqual(findRedundantConnection([[1,2],[1,3],[2,3]]), [2,3]);
  assert.deepEqual(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]]), [1,4]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 28. net-alien-dict  —— 外星人字典拓扑序
ALGS.push({
  id: 'net-alien-dict',
  m: ['外星人字典', 'Alien Dictionary', '由排序后的单词列表推导字母顺序（拓扑排序）。', 'Infer letter order from sorted words (topo sort).',
    '相邻词找首个不同字符建边，拓扑排序。', 'Build edges from adjacent word diffs; topo sort. O(C).', 'O(C)', 'O(1)', ['network', 'graph', 'topological-sort']],
  impl: `export interface AdHooks { onEdge?: (from: string, to: string) => void; onResult?: (order: string) => void; }
export function alienOrder(words: string[], hooks: AdHooks = {}): string {
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words) for (const ch of w) { if (!adj.has(ch)) adj.set(ch, new Set()); if (!indeg.has(ch)) indeg.set(ch, 0); }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i]!, b = words[i + 1]!;
    let j = 0; const m = Math.min(a.length, b.length);
    while (j < m && a[j] === b[j]) j++;
    if (j < m) { const from = a[j]!, to = b[j]!; if (!adj.get(from)!.has(to)) { adj.get(from)!.add(to); indeg.set(to, indeg.get(to)! + 1); hooks.onEdge?.(from, to); } }
    else if (a.length > b.length) { hooks.onResult?.(''); return ''; }
  }
  const q: string[] = [];
  for (const [ch, d] of indeg) if (d === 0) q.push(ch);
  let order = '';
  while (q.length) { const u = q.shift()!; order += u; for (const v of adj.get(u) ?? []) { indeg.set(v, indeg.get(v)! - 1); if (indeg.get(v) === 0) q.push(v); } }
  const r = order.length === indeg.size ? order : '';
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alienOrder } from './impl.ts';
export const DEFAULT_INPUT = ['wrt','wrf','er','ett','rftt'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '外星人字典', en: 'Alien dictionary' }).commit();
  const order = alienOrder(input, { onEdge: (from, to) => rec.begin({ zh: '边 ' + from + '→' + to, en: 'edge ' + from + '→' + to }).setAux([{ label: 'edge', value: from + '→' + to, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '顺序：' + order, en: 'Order: ' + order }).setAux([{ label: 'order', value: order, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alienOrder } from '../../src/algorithms/network/net-alien-dict/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-alien-dict/trace.ts';
test('alienOrder 正确', () => {
  const o = alienOrder(['wrt','wrf','er','ett','rftt']);
  assert.equal(o.length, 5);
  assert.ok(o.indexOf('w') < o.indexOf('e'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 29. net-account-merge  —— 账户合并
ALGS.push({
  id: 'net-account-merge',
  m: ['账户合并', 'Accounts Merge', '用并查集合并共享邮箱的账户。', 'Merge accounts sharing emails via union-find.',
    '邮箱作节点，同账户的邮箱 union，再分组。', 'Union-find on emails. O(N*K α).', 'O(N*K α)', 'O(N*K)', ['network', 'graph', 'union-find']],
  impl: `export interface Account { name: string; emails: string[]; }
export interface AmHooks { onMerge?: (email: string, root: string) => void; onResult?: (n: number) => void; }
export function accountsMerge(accounts: Account[], hooks: AmHooks = {}): Account[] {
  const owner = new Map<string, string>();
  const parent = new Map<string, string>();
  const find = (x: string): string => { if (!parent.has(x)) parent.set(x, x); const p = parent.get(x)!; if (p === x) return x; parent.set(x, find(p)); return parent.get(x)!; };
  const union = (a: string, b: string) => { parent.set(find(a), find(b)); };
  for (const acc of accounts) {
    const first = acc.emails[0]!;
    owner.set(first, acc.name);
    for (let i = 1; i < acc.emails.length; i++) { owner.set(acc.emails[i]!, acc.name); union(first, acc.emails[i]!); }
  }
  const groups = new Map<string, Set<string>>();
  for (const acc of accounts) for (const e of acc.emails) { const r = find(e); hooks.onMerge?.(e, r); if (!groups.has(r)) groups.set(r, new Set()); groups.get(r)!.add(e); }
  const result: Account[] = [];
  for (const [root, set] of groups) result.push({ name: owner.get(root)!, emails: [...set].sort() });
  hooks.onResult?.(result.length);
  return result;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { accountsMerge, type Account } from './impl.ts';
export const DEFAULT_INPUT: Account[] = [
  { name: 'John', emails: ['john@mail.com','john2@mail.com'] },
  { name: 'John', emails: ['john3@mail.com','john@mail.com'] },
  { name: 'Mary', emails: ['mary@mail.com'] },
];
export function buildTrace(input: Account[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '账户合并', en: 'Accounts merge' }).commit();
  const merged = accountsMerge(input, { onMerge: (e, r) => rec.begin({ zh: e + ' → ' + r, en: e + ' → ' + r }).setAux([{ label: 'root', value: r, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '合并后 ' + merged.length + ' 个账户', en: merged.length + ' accounts' }).setAux([{ label: 'count', value: String(merged.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountsMerge } from '../../src/algorithms/network/net-account-merge/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-account-merge/trace.ts';
test('accountsMerge 正确', () => {
  const r = accountsMerge([
    { name: 'John', emails: ['john@mail.com','john2@mail.com'] },
    { name: 'John', emails: ['john3@mail.com','john@mail.com'] },
    { name: 'Mary', emails: ['mary@mail.com'] },
  ]);
  assert.equal(r.length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 30. net-min-height-tree  —— 最小高度树
ALGS.push({
  id: 'net-min-height-tree',
  m: ['最小高度树', 'Minimum Height Trees', '找树图的中心节点（作为根时高度最小）。', 'Find centroid nodes of a tree (minimal height roots).',
    '不断剥离叶子，最后剩 1-2 个节点即中心。', 'Peel leaves layer by layer. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'topology']],
  impl: `export interface MhtHooks { onPeel?: (v: number) => void; onResult?: (roots: number[]) => void; }
export function findMinHeightTrees(n: number, edges: Array<[number, number]>, hooks: MhtHooks = {}): number[] {
  if (n === 1) { hooks.onResult?.([0]); return [0]; }
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
  for (const [a, b] of edges) { adj[a]!.add(b); adj[b]!.add(a); }
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) if (adj[i]!.size === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const next: number[] = [];
    for (const leaf of leaves) {
      const nb = [...adj[leaf]!][0]!;
      hooks.onPeel?.(leaf);
      adj[nb]!.delete(leaf);
      if (adj[nb]!.size === 1) next.push(nb);
    }
    leaves = next;
  }
  hooks.onResult?.(leaves);
  return leaves;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinHeightTrees } from './impl.ts';
export const DEFAULT_INPUT = { n: 6, edges: [[3,0],[3,1],[3,2],[3,4],[5,4]] as Array<[number, number]> };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最小高度树', en: 'Min height trees' }).commit();
  const roots = findMinHeightTrees(input.n, input.edges, { onPeel: (v) => rec.begin({ zh: '剥离叶子 ' + v, en: 'peel leaf ' + v }).setAux([{ label: 'leaf', value: String(v), role: 'swap' as BarRole }]).commit() });
  rec.begin({ zh: '中心：' + roots.join(','), en: 'roots: ' + roots.join(',') }).setBars(roots.map((r) => ({ value: r, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinHeightTrees } from '../../src/algorithms/network/net-min-height-tree/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-min-height-tree/trace.ts';
test('findMinHeightTrees 正确', () => {
  assert.deepEqual(findMinHeightTrees(6, [[3,0],[3,1],[3,2],[3,4],[5,4]]).sort((a, b) => a - b), [3,4]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 31. net-satisfy-eq-equations  —— 等式方程可满足性
ALGS.push({
  id: 'net-satisfy-eq-equations',
  m: ['等式方程可满足', 'Satisfiability of Equations', '判断 == 与 != 方程组是否自洽（并查集）。', 'Check consistency of == and != equations via union-find.',
    '先 union 所有 == ，再检查所有 != 是否同根。', 'Union ==, check != . O(E α).', 'O(E α)', 'O(V)', ['network', 'graph', 'union-find']],
  impl: `export interface EqHooks { onUnion?: (a: string, b: string) => void; onResult?: (ok: boolean) => void; }
export function equationsPossible(equations: string[], hooks: EqHooks = {}): boolean {
  const parent = new Map<string, string>();
  const find = (x: string): string => { if (!parent.has(x)) parent.set(x, x); const p = parent.get(x)!; if (p === x) return x; parent.set(x, find(p)); return parent.get(x)!; };
  const union = (a: string, b: string) => { parent.set(find(a), find(b)); };
  for (const e of equations) if (e[1] === '=') { hooks.onUnion?.(e[0]!, e[3]!); union(e[0]!, e[3]!); }
  for (const e of equations) if (e[1] === '!') { if (find(e[0]!) === find(e[3]!)) { hooks.onResult?.(false); return false; } }
  hooks.onResult?.(true);
  return true;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { equationsPossible } from './impl.ts';
export const DEFAULT_INPUT = ['a==b','b!=a'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '等式方程可满足', en: 'Equations satisfiability' }).commit();
  const ok = equationsPossible(input, { onUnion: (a, b) => rec.begin({ zh: 'union ' + a + '=' + b, en: 'union ' + a + '=' + b }).setAux([{ label: 'union', value: a + ',' + b, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '可满足？' + ok, en: 'satisfiable? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equationsPossible } from '../../src/algorithms/network/net-satisfy-eq-equations/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-satisfy-eq-equations/trace.ts';
test('equationsPossible 正确', () => {
  assert.equal(equationsPossible(['a==b','b!=a']), false);
  assert.equal(equationsPossible(['a==b','b==c','a==c']), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 32. net-network-delay  —— 网络延迟时间
ALGS.push({
  id: 'net-network-delay',
  m: ['网络延迟时间', 'Network Delay Time', '信号从某节点发出，求所有节点收到的最短时间（Dijkstra 后取最大）。', 'Max distance from source after Dijkstra = time to reach all.',
    'Dijkstra 后取 dist 最大值。', 'Dijkstra then take max dist. O(E log V).', 'O(E log V)', 'O(V)', ['network', 'graph', 'shortest-path']],
  impl: `export interface NdHooks { onRelax?: (v: number, d: number) => void; onResult?: (t: number) => void; }
export function networkDelayTime(times: Array<[number, number, number]>, n: number, k: number, hooks: NdHooks = {}): number {
  const adj: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u]!.push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const visited = new Array(n + 1).fill(false);
  for (let i = 0; i < n; i++) {
    let u = -1, best = Infinity;
    for (let j = 1; j <= n; j++) if (!visited[j] && dist[j]! < best) { best = dist[j]!; u = j; }
    if (u === -1) break;
    visited[u] = true;
    for (const [v, w] of adj[u]!) if (dist[u]! + w < dist[v]!) { dist[v] = dist[u]! + w; hooks.onRelax?.(v, dist[v]!); }
  }
  let max = 0;
  for (let i = 1; i <= n; i++) { if (dist[i] === Infinity) { hooks.onResult?.(-1); return -1; } max = Math.max(max, dist[i]!); }
  hooks.onResult?.(max);
  return max;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { networkDelayTime } from './impl.ts';
export const DEFAULT_INPUT = { times: [[2,1,1],[2,3,1],[3,4,1]] as Array<[number, number, number]>, n: 4, k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '网络延迟 从 ' + input.k, en: 'Network delay from ' + input.k }).commit();
  const t = networkDelayTime(input.times, input.n, input.k, { onRelax: (v, d) => rec.begin({ zh: '节点 ' + v + ' 延迟 ' + d, en: 'node ' + v + ' delay ' + d }).setAux([{ label: 'delay', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '总延迟 = ' + t, en: 'total = ' + t }).setAux([{ label: 'total', value: String(t), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { networkDelayTime } from '../../src/algorithms/network/net-network-delay/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-network-delay/trace.ts';
test('networkDelayTime 正确', () => {
  assert.equal(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2), 2);
  assert.equal(networkDelayTime([[1,2,1]], 2, 2), -1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 33. net-cheapest-flights  —— 最便宜航班（K站中转）
ALGS.push({
  id: 'net-cheapest-flights',
  m: ['K站最便宜航班', 'Cheapest Flights within K Stops', 'Bellman-Ford 限制 K 步求最便宜航班。', 'Cheapest flight within K stops (Bellman-Ford bounded).',
    '松弛 K+1 轮，每轮用上一轮的 dist。', 'Relax K+1 rounds with prev dist. O(K*E).', 'O(K*E)', 'O(V)', ['network', 'graph', 'bellman-ford']],
  impl: `export interface CfHooks { onRound?: (r: number) => void; onResult?: (cost: number) => void; }
export function findCheapestPrice(n: number, flights: Array<[number, number, number]>, src: number, dst: number, k: number, hooks: CfHooks = {}): number {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let r = 0; r <= k; r++) {
    hooks.onRound?.(r + 1);
    const next = [...dist];
    for (const [u, v, w] of flights) if (dist[u]! !== Infinity && dist[u]! + w < next[v]!) next[v] = dist[u]! + w;
    dist = next;
  }
  const cost = dist[dst] === Infinity ? -1 : dist[dst]!;
  hooks.onResult?.(cost);
  return cost;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findCheapestPrice } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, flights: [[0,1,100],[1,2,100],[2,3,100],[0,2,500]] as Array<[number, number, number]>, src: 0, dst: 3, k: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'K站最便宜航班', en: 'Cheapest flights K=' + input.k }).commit();
  const c = findCheapestPrice(input.n, input.flights, input.src, input.dst, input.k, { onRound: (r) => rec.begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r }).setAux([{ label: 'round', value: String(r), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最低价 = ' + c, en: 'cheapest = ' + c }).setAux([{ label: 'price', value: String(c), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCheapestPrice } from '../../src/algorithms/network/net-cheapest-flights/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-cheapest-flights/trace.ts';
test('findCheapestPrice 正确', () => {
  assert.equal(findCheapestPrice(4, [[0,1,100],[1,2,100],[2,3,100],[0,2,500]], 0, 3, 1), 700);
  assert.equal(findCheapestPrice(4, [[0,1,100],[1,2,100],[2,3,100],[0,2,500]], 0, 3, 0), 500);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 34. net-eventual-safe  —— 事件安全状态
ALGS.push({
  id: 'net-eventual-safe',
  m: ['查找最终安全状态', 'Find Eventual Safe States', '在图中找必然到达终点的节点（无出边或全指向安全节点）。', 'Nodes guaranteed to reach a terminal (no cycle reachable).',
    '反向图拓扑：先标终点，反向剥。', 'Reverse topo from terminals. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'topological-sort']],
  impl: `export interface SafeHooks { onSafe?: (v: number) => void; onResult?: (nodes: number[]) => void; }
export function eventualSafeNodes(graph: number[][], hooks: SafeHooks = {}): number[] {
  const n = graph.length;
  const radj: Set<number>[] = Array.from({ length: n }, () => new Set());
  const outdeg = new Array(n).fill(0);
  for (let u = 0; u < n; u++) { outdeg[u] = graph[u]!.length; for (const v of graph[u]!) radj[v]!.add(u); }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (outdeg[i] === 0) q.push(i);
  const safe = new Array(n).fill(false);
  while (q.length) {
    const u = q.shift()!;
    safe[u] = true; hooks.onSafe?.(u);
    for (const prev of radj[u]!) { outdeg[prev]!--; if (outdeg[prev] === 0) q.push(prev); }
  }
  const res = safe.map((s, i) => (s ? i : -1)).filter((i) => i >= 0);
  hooks.onResult?.(res);
  return res;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eventualSafeNodes } from './impl.ts';
export const DEFAULT_INPUT = [[1,2],[2,3],[5],[0],[5],[],[]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最终安全节点', en: 'Eventual safe nodes' }).commit();
  const ns = eventualSafeNodes(input, { onSafe: (v) => rec.begin({ zh: '安全 ' + v, en: 'safe ' + v }).setAux([{ label: 'safe', value: String(v), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '安全：' + ns.join(','), en: 'safe: ' + ns.join(',') }).setBars(ns.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eventualSafeNodes } from '../../src/algorithms/network/net-eventual-safe/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-eventual-safe/trace.ts';
test('eventualSafeNodes 正确', () => {
  assert.deepEqual(eventualSafeNodes([[1,2],[2,3],[5],[0],[5],[],[]]), [2,4,5,6]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 35. net-grid-shortest  —— 网格最短路径 BFS
ALGS.push({
  id: 'net-grid-shortest',
  m: ['网格最短路径', 'Shortest Path in Binary Grid', '八方向网格从左上到右下最短路径长度。', '8-direction shortest path from top-left to bottom-right.',
    'BFS，每步八方向。', 'BFS 8-dir. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'bfs']],
  impl: `export interface GsHooks { onVisit?: (r: number, c: number, d: number) => void; onResult?: (len: number) => void; }
export function shortestPathBinaryMatrix(grid: number[][], hooks: GsHooks = {}): number {
  const n = grid.length;
  if (grid[0]![0] === 1 || grid[n - 1]![n - 1] === 1) { hooks.onResult?.(-1); return -1; }
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  visited[0]![0] = true;
  const q: Array<[number, number, number]> = [[0, 0, 1]];
  while (q.length) {
    const [r, c, d] = q.shift()!;
    if (r === n - 1 && c === n - 1) { hooks.onResult?.(d); return d; }
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || grid[nr]![nc] === 1 || visited[nr]![nc]) continue;
      visited[nr]![nc] = true; hooks.onVisit?.(nr, nc, d + 1); q.push([nr, nc, d + 1]);
    }
  }
  hooks.onResult?.(-1);
  return -1;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestPathBinaryMatrix } from './impl.ts';
export const DEFAULT_GRID = [[0,1],[1,0]];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '网格最短路径', en: 'Grid shortest path' }).commit();
  const len = shortestPathBinaryMatrix(grid, { onVisit: (r, c, d) => rec.begin({ zh: '访问 (' + r + ',' + c + ') 步 ' + d, en: 'visit (' + r + ',' + c + ') d=' + d }).setAux([{ label: 'step', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '长度 = ' + len, en: 'length = ' + len }).setAux([{ label: 'length', value: String(len), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestPathBinaryMatrix } from '../../src/algorithms/network/net-grid-shortest/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-grid-shortest/trace.ts';
test('shortestPathBinaryMatrix 正确', () => {
  assert.equal(shortestPathBinaryMatrix([[0,1],[1,0]].map((r) => [...r])), 2);
  assert.equal(shortestPathBinaryMatrix([[0,0,0],[1,1,0],[1,1,0]].map((r) => [...r])), 4);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 36. net-surrounded-regions  —— 被围绕的区域
ALGS.push({
  id: 'net-surrounded-regions',
  m: ['被围绕的区域', 'Surrounded Regions', '把被 X 完全围绕的 O 翻转为 X（边界相连的 O 保留）。', 'Flip O to X if fully surrounded (border-connected Os kept).',
    '从边界 O 做 DFS 标记，其余 O 翻 X。', 'DFS from border Os, flip rest. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'dfs']],
  impl: `export interface SrHooks { onFlip?: (r: number, c: number) => void; onResult?: () => void; }
export function solveSurrounded(board: string[][], hooks: SrHooks = {}): string[][] {
  const R = board.length; if (R === 0) return board; const C = board[0]!.length;
  const dfs = (r: number, c: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || board[r]![c] !== 'O') return;
    board[r]![c] = 'T';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < R; r++) { dfs(r, 0); dfs(r, C - 1); }
  for (let c = 0; c < C; c++) { dfs(0, c); dfs(R - 1, c); }
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (board[r]![c] === 'O') { board[r]![c] = 'X'; hooks.onFlip?.(r, c); }
    else if (board[r]![c] === 'T') board[r]![c] = 'O';
  }
  hooks.onResult?.();
  return board;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveSurrounded } from './impl.ts';
export const DEFAULT_BOARD = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']];
export function buildTrace(board: string[][] = DEFAULT_BOARD.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '被围绕的区域', en: 'Surrounded regions' }).commit();
  solveSurrounded(board, { onFlip: (r, c) => rec.begin({ zh: '翻转 (' + r + ',' + c + ')', en: 'flip (' + r + ',' + c + ')' }).setGrid(board.map((row) => row.map((v) => v)))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setGrid(board.map((row) => row.map((v) => v))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveSurrounded } from '../../src/algorithms/network/net-surrounded-regions/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-surrounded-regions/trace.ts';
test('solveSurrounded 正确', () => {
  const b = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']].map((r) => [...r]);
  solveSurrounded(b);
  assert.deepEqual(b, [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 37. net-pacific-atlantic  —— 太平洋大西洋水流
ALGS.push({
  id: 'net-pacific-atlantic',
  m: ['太平洋大西洋水流', 'Pacific Atlantic Water Flow', '找能同时流向两大洋的格子。', 'Cells that can flow to both oceans.',
    '从两大洋边界反向 DFS，取交集。', 'DFS from both ocean borders, intersect. O(R*C).', 'O(R*C)', 'O(R*C)', ['network', 'grid', 'dfs']],
  impl: `export interface PaHooks { onCell?: (r: number, c: number) => void; onResult?: (cells: Array<[number, number]>) => void; }
export function pacificAtlantic(heights: number[][], hooks: PaHooks = {}): Array<[number, number]> {
  const R = heights.length; if (R === 0) return []; const C = heights[0]!.length;
  const pac = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
  const atl = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
  const dfs = (r: number, c: number, visited: boolean[][], prev: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || visited[r]![c] || heights[r]![c]! < prev) return;
    visited[r]![c] = true;
    dfs(r + 1, c, visited, heights[r]![c]!); dfs(r - 1, c, visited, heights[r]![c]!);
    dfs(r, c + 1, visited, heights[r]![c]!); dfs(r, c - 1, visited, heights[r]![c]!);
  };
  for (let r = 0; r < R; r++) { dfs(r, 0, pac, 0); dfs(r, C - 1, atl, 0); }
  for (let c = 0; c < C; c++) { dfs(0, c, pac, 0); dfs(R - 1, c, atl, 0); }
  const res: Array<[number, number]> = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (pac[r]![c] && atl[r]![c]) { res.push([r, c]); hooks.onCell?.(r, c); }
  hooks.onResult?.(res);
  return res;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pacificAtlantic } from './impl.ts';
export const DEFAULT_GRID = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]];
export function buildTrace(grid: number[][] = DEFAULT_GRID): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '太平洋大西洋水流', en: 'Pacific Atlantic' }).commit();
  const cells = pacificAtlantic(grid, { onCell: (r, c) => rec.begin({ zh: '汇点 (' + r + ',' + c + ')', en: 'cell (' + r + ',' + c + ')' }).setAux([{ label: 'cell', value: r + ',' + c, role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + cells.length + ' 个', en: cells.length + ' cells' }).setAux([{ label: 'count', value: String(cells.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pacificAtlantic } from '../../src/algorithms/network/net-pacific-atlantic/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-pacific-atlantic/trace.ts';
test('pacificAtlantic 正确', () => {
  const cs = pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]);
  assert.ok(cs.length > 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 38. net-color-sort-graph  —— 课程表染色（按拓扑着色）
ALGS.push({
  id: 'net-color-sort-graph',
  m: ['图贪心染色', 'Graph Greedy Coloring', '贪心给图节点着色（相邻不同色）。', 'Greedy vertex coloring.',
    '按顺序，每个节点用最小可用色。', 'Use smallest available color per node. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'coloring']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; }
export interface ColorHooks { onColor?: (v: string, c: number) => void; onResult?: (n: number) => void; }
export function greedyColor(g: GraphInput, hooks: ColorHooks = {}): Map<string, number> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  const color = new Map<string, number>();
  let maxColor = 0;
  for (const v of g.nodes) {
    const used = new Set<number>();
    for (const u of adj.get(v) ?? []) if (color.has(u)) used.add(color.get(u)!);
    let c = 0; while (used.has(c)) c++;
    color.set(v, c);
    maxColor = Math.max(maxColor, c);
    hooks.onColor?.(v, c);
  }
  hooks.onResult?.(maxColor + 1);
  return color;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyColor, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D'],
  edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'C'},{from:'C',to:'D'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '图贪心染色', en: 'Greedy coloring' }).commit();
  const color = greedyColor(input, { onColor: (v, c) => rec.begin({ zh: v + ' 染色 ' + c, en: v + ' color ' + c }).setAux([{ label: 'color', value: String(c), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '用色数 = ' + Math.max(...color.values()), en: 'colors = ' + Math.max(...color.values()) }).setAux([{ label: 'colors', value: String(Math.max(...color.values())), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyColor } from '../../src/algorithms/network/net-color-sort-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-color-sort-graph/trace.ts';
test('greedyColor 正确', () => {
  const c = greedyColor({ nodes: ['A','B','C'], edges: [{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'C'}] });
  assert.notEqual(c.get('A'), c.get('B'));
  assert.notEqual(c.get('B'), c.get('C'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 39. net-longest-path-dag  —— DAG 最长路径
ALGS.push({
  id: 'net-longest-path-dag',
  m: ['DAG最长路径', 'Longest Path in DAG', '拓扑排序+DP 求 DAG 最长路径长度。', 'Topo sort + DP for longest path in a DAG.',
    '按拓扑序松弛 dist[v] = max(dist[v], dist[u]+w)。', 'Relax along topo order. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'dag']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string; weight?: number }>; }
export interface LpHooks { onRelax?: (u: string, v: string, d: number) => void; onResult?: (max: number) => void; }
export function longestPathDAG(g: GraphInput, hooks: LpHooks = {}): number {
  const idx = new Map(g.nodes.map((n, i) => [n, i] as const));
  const n = g.nodes.length;
  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const e of g.edges) { const i = idx.get(e.from)!, j = idx.get(e.to)!; adj[i].push([j, e.weight ?? 1]); indeg[j]!++; }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const dist = new Array(n).fill(0);
  let max = 0;
  while (q.length) {
    const u = q.shift()!;
    for (const [v, w] of adj[u]!) { if (dist[u]! + w > dist[v]!) { dist[v] = dist[u]! + w; hooks.onRelax?.(g.nodes[u]!, g.nodes[v]!, dist[v]!); max = Math.max(max, dist[v]!); } indeg[v]!--; if (indeg[v] === 0) q.push(v); }
  }
  hooks.onResult?.(max);
  return max;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestPathDAG, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'],
  edges: [{from:'A',to:'B',weight:3},{from:'A',to:'C',weight:2},{from:'B',to:'D',weight:2},{from:'C',to:'D',weight:1},{from:'D',to:'E',weight:1}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DAG 最长路径', en: 'Longest path DAG' }).commit();
  const m = longestPathDAG(input, { onRelax: (u, v, d) => rec.begin({ zh: u + '→' + v + ' = ' + d, en: u + '→' + v + ' = ' + d }).setAux([{ label: 'dist', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最长 = ' + m, en: 'longest = ' + m }).setAux([{ label: 'longest', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestPathDAG } from '../../src/algorithms/network/net-longest-path-dag/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-longest-path-dag/trace.ts';
test('longestPathDAG 正确', () => {
  assert.equal(longestPathDAG({ nodes: ['A','B','C','D','E'], edges: [{from:'A',to:'B',weight:3},{from:'A',to:'C',weight:2},{from:'B',to:'D',weight:2},{from:'C',to:'D',weight:1},{from:'D',to:'E',weight:1}] }), 6);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 40. net-city-threshold  —— 城市阈值距离（用Floyd）
ALGS.push({
  id: 'net-city-threshold',
  m: ['城市阈值距离', 'City With Threshold Distance', '在距离阈值内邻居最少的城市编号。', 'City with fewest reachable neighbors within distance threshold.',
    'Floyd 全源最短路后统计。', 'Floyd all-pairs then count. O(V^3).', 'O(V^3)', 'O(V^2)', ['network', 'graph', 'all-pairs']],
  impl: `export interface CtHooks { onCount?: (city: number, cnt: number) => void; onResult?: (city: number) => void; }
export function findTheCity(n: number, edges: Array<[number, number, number]>, threshold: number, hooks: CtHooks = {}): number {
  const INF = 1 << 29;
  const dist: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)));
  for (const [u, v, w] of edges) { dist[u]![v] = w; dist[v]![u] = w; }
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (dist[i]![k]! + dist[k]![j]! < dist[i]![j]!) dist[i]![j] = dist[i]![k]! + dist[k]![j]!;
  let best = -1, minCnt = Infinity;
  for (let i = 0; i < n; i++) {
    let cnt = 0;
    for (let j = 0; j < n; j++) if (i !== j && dist[i]![j]! <= threshold) cnt++;
    hooks.onCount?.(i, cnt);
    if (cnt <= minCnt) { minCnt = cnt; best = i; }
  }
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findTheCity } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, edges: [[0,1,3],[1,2,1],[1,3,4],[2,3,1]] as Array<[number, number, number]>, threshold: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '城市阈值', en: 'City threshold' }).commit();
  const c = findTheCity(input.n, input.edges, input.threshold, { onCount: (city, cnt) => rec.begin({ zh: '城市 ' + city + ' 可达 ' + cnt, en: 'city ' + city + ' reach ' + cnt }).setAux([{ label: 'count', value: String(cnt), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '城市 = ' + c, en: 'city = ' + c }).setAux([{ label: 'city', value: String(c), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findTheCity } from '../../src/algorithms/network/net-city-threshold/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-city-threshold/trace.ts';
test('findTheCity 正确', () => {
  assert.equal(findTheCity(4, [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], 4), 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 41. net-jump-game-3  —— 跳跃游戏3 BFS
ALGS.push({
  id: 'net-jump-game-3',
  m: ['跳跃游戏3', 'Jump Game III', '数组中从 start 出发，每次左/右跳 arr[i] 步，能否到达 0。', 'From start, jump ±arr[i]; can reach a 0?',
    'BFS/DFS。', 'BFS/DFS. O(n).', 'O(n)', 'O(n)', ['network', 'graph', 'bfs']],
  impl: `export interface JgHooks { onVisit?: (i: number) => void; onResult?: (ok: boolean) => void; }
export function canReach(arr: number[], start: number, hooks: JgHooks = {}): boolean {
  const n = arr.length;
  const visited = new Array(n).fill(false);
  const q: number[] = [start];
  visited[start] = true;
  while (q.length) {
    const i = q.shift()!;
    hooks.onVisit?.(i);
    if (arr[i] === 0) { hooks.onResult?.(true); return true; }
    for (const ni of [i + arr[i]!, i - arr[i]!]) if (ni >= 0 && ni < n && !visited[ni]) { visited[ni] = true; q.push(ni); }
  }
  hooks.onResult?.(false);
  return false;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canReach } from './impl.ts';
export const DEFAULT_INPUT = { arr: [4,2,3,0,3,1,2], start: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '跳跃游戏3', en: 'Jump game III' }).commit();
  const ok = canReach(input.arr, input.start, { onVisit: (i) => rec.begin({ zh: '访问 ' + i + ' (值 ' + input.arr[i] + ')', en: 'visit ' + i }).setAux([{ label: 'pos', value: String(i), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '可达 0？' + ok, en: 'reach 0? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canReach } from '../../src/algorithms/network/net-jump-game-3/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-jump-game-3/trace.ts';
test('canReach 正确', () => {
  assert.equal(canReach([4,2,3,0,3,1,2], 5), true);
  assert.equal(canReach([3,0,2,1,2], 2), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 42. net-open-the-lock  —— 打开转盘锁 BFS
ALGS.push({
  id: 'net-open-the-lock',
  m: ['打开转盘锁', 'Open the Lock', '从 0000 转动到目标，避开 deadends 的最少步数。', 'Min turns from 0000 to target avoiding deadends.',
    'BFS，每步转动一个轮 +1/-1。', 'BFS each wheel ±1. O(10^4).', 'O(10^4)', 'O(10^4)', ['network', 'graph', 'bfs']],
  impl: `export interface OlHooks { onVisit?: (s: string, d: number) => void; onResult?: (steps: number) => void; }
export function openLock(deadends: string[], target: string, hooks: OlHooks = {}): number {
  const dead = new Set(deadends);
  if (dead.has('0000')) { hooks.onResult?.(-1); return -1; }
  const visited = new Set<string>(['0000']);
  const q: Array<[string, number]> = [['0000', 0]];
  while (q.length) {
    const [s, d] = q.shift()!;
    if (s === target) { hooks.onResult?.(d); return d; }
    for (let i = 0; i < 4; i++) {
      for (const delta of [1, -1]) {
        const dig = (Number(s[i]) + delta + 10) % 10;
        const ns = s.slice(0, i) + dig + s.slice(i + 1);
        if (!visited.has(ns) && !dead.has(ns)) { visited.add(ns); hooks.onVisit?.(ns, d + 1); q.push([ns, d + 1]); }
      }
    }
  }
  hooks.onResult?.(-1);
  return -1;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { openLock } from './impl.ts';
export const DEFAULT_INPUT = { deadends: ['0201','0101','0102','1212','2002'], target: '0202' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '打开转盘锁 → ' + input.target, en: 'Open lock → ' + input.target }).commit();
  const steps = openLock(input.deadends, input.target, { onVisit: (s, d) => rec.begin({ zh: s + ' (步 ' + d + ')', en: s + ' (step ' + d + ')' }).setAux([{ label: 'step', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '步数 = ' + steps, en: 'steps = ' + steps }).setAux([{ label: 'steps', value: String(steps), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openLock } from '../../src/algorithms/network/net-open-the-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-open-the-lock/trace.ts';
test('openLock 正确', () => {
  assert.equal(openLock(['0201','0101','0102','1212','2002'], '0202'), 6);
  assert.equal(openLock(['8888'], '0009'), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 43. net-spread-info  —— 信息传播（多源最短到达）
ALGS.push({
  id: 'net-spread-info',
  m: ['信息传播', 'Information Spread', '从多个源点出发，求所有节点最近源的距离。', 'Multi-source BFS: nearest source distance for each node.',
    '所有源同时入队 BFS。', 'All sources in queue, BFS. O(V+E).', 'O(V+E)', 'O(V)', ['network', 'graph', 'multi-bfs']],
  impl: `export interface GraphInput { nodes: string[]; edges: Array<{ from: string; to: string }>; sources: string[]; }
export interface SiHooks { onReach?: (v: string, d: number) => void; onResult?: (dist: Map<string, number>) => void; }
export function spreadInfo(g: GraphInput, hooks: SiHooks = {}): Map<string, number> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
  const dist = new Map<string, number>();
  const q: Array<{ v: string; d: number }> = [];
  for (const s of g.sources) { dist.set(s, 0); q.push({ v: s, d: 0 }); }
  while (q.length) {
    const { v, d } = q.shift()!;
    hooks.onReach?.(v, d);
    for (const u of adj.get(v) ?? []) if (!dist.has(u)) { dist.set(u, d + 1); q.push({ v: u, d: d + 1 }); }
  }
  hooks.onResult?.(dist);
  return dist;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spreadInfo, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A','B','C','D','E'], sources: ['A','C'],
  edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'D',to:'E'}],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '信息传播', en: 'Info spread' }).commit();
  const dist = spreadInfo(input, { onReach: (v, d) => rec.begin({ zh: v + ' 距离 ' + d, en: v + ' d=' + d }).setAux([{ label: 'dist', value: String(d), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setBars([...dist.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spreadInfo } from '../../src/algorithms/network/net-spread-info/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-spread-info/trace.ts';
test('spreadInfo 正确', () => {
  const d = spreadInfo({ nodes: ['A','B','C','D','E'], sources: ['A','C'], edges: [{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'D',to:'E'}] });
  assert.equal(d.get('A'), 0);
  assert.equal(d.get('B'), 1);
  assert.equal(d.get('E'), 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 44. net-time-needed  —— 信息传递到所有（二叉树广播）
ALGS.push({
  id: 'net-time-needed',
  m: ['通知所有员工', 'Time Needed to Inform All', '树形公司层级通知，求通知所有人时间。', 'Time to inform all employees in a hierarchy tree.',
    '后序 DFS：每个员工时间 = informTime + 子树最大。', 'Post-order DFS; time = informTime + max(child). O(n).', 'O(n)', 'O(n)', ['network', 'tree', 'dfs']],
  impl: `export interface TnHooks { onNode?: (v: number, t: number) => void; onResult?: (total: number) => void; }
export function numOfMinutes(n: number, headID: number, manager: number[], informTime: number[], hooks: TnHooks = {}): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) if (manager[i] !== -1) adj[manager[i]!].push(i);
  const dfs = (u: number): number => {
    let maxChild = 0;
    for (const v of adj[u]!) maxChild = Math.max(maxChild, dfs(v));
    const t = informTime[u]! + maxChild;
    hooks.onNode?.(u, t);
    return t;
  };
  const r = dfs(headID);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numOfMinutes } from './impl.ts';
export const DEFAULT_INPUT = { n: 6, headID: 2, manager: [2,2,-1,2,2,2], informTime: [0,0,1,0,0,0] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '通知所有员工', en: 'Inform all' }).commit();
  const t = numOfMinutes(input.n, input.headID, input.manager, input.informTime, { onNode: (v, tt) => rec.begin({ zh: '员工 ' + v + ' 时间 ' + tt, en: 'emp ' + v + ' t=' + tt }).setAux([{ label: 'time', value: String(tt), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '总时间 = ' + t, en: 'total = ' + t }).setAux([{ label: 'total', value: String(t), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numOfMinutes } from '../../src/algorithms/network/net-time-needed/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-time-needed/trace.ts';
test('numOfMinutes 正确', () => {
  assert.equal(numOfMinutes(6, 2, [2,2,-1,2,2,2], [0,0,1,0,0,0]), 1);
  assert.equal(numOfMinutes(1, 0, [-1], [0]), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 45. net-key-rooms  —— 钥匙与房间
ALGS.push({
  id: 'net-key-rooms',
  m: ['钥匙与房间', 'Keys and Rooms', '从房间0出发用钥匙能否访问所有房间。', 'Can visit all rooms starting from room 0 with keys.',
    'BFS/DFS 模拟开锁。', 'BFS/DFS unlock. O(N*K).', 'O(N*K)', 'O(N)', ['network', 'graph', 'bfs']],
  impl: `export interface KrHooks { onVisit?: (r: number) => void; onResult?: (ok: boolean) => void; }
export function canVisitAllRooms(rooms: number[][], hooks: KrHooks = {}): boolean {
  const visited = new Set<number>([0]);
  const stack = [0];
  while (stack.length) {
    const r = stack.pop()!;
    hooks.onVisit?.(r);
    for (const k of rooms[r] ?? []) if (!visited.has(k)) { visited.add(k); stack.push(k); }
  }
  const ok = visited.size === rooms.length;
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canVisitAllRooms } from './impl.ts';
export const DEFAULT_INPUT = [[1],[2],[3],[]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '钥匙与房间', en: 'Keys and rooms' }).commit();
  const ok = canVisitAllRooms(input, { onVisit: (r) => rec.begin({ zh: '进入房间 ' + r, en: 'enter room ' + r }).setAux([{ label: 'room', value: String(r), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '全部访问？' + ok, en: 'all? ' + ok }).setAux([{ label: 'all', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canVisitAllRooms } from '../../src/algorithms/network/net-key-rooms/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-key-rooms/trace.ts';
test('canVisitAllRooms 正确', () => {
  assert.equal(canVisitAllRooms([[1],[2],[3],[]]), true);
  assert.equal(canVisitAllRooms([[1,3],[3,0,1],[2],[0]]), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 46. net-all-paths-src-tgt  —— DAG 所有源到汇路径
ALGS.push({
  id: 'net-all-paths-src-tgt',
  m: ['源到汇所有路径', 'All Paths Source to Target', 'DAG 中所有从 0 到 n-1 的路径。', 'All paths from 0 to n-1 in a DAG.',
    'DFS 回溯收集。', 'DFS backtracking. O(2^V * V) worst.', 'O(2^V * V)', 'O(V)', ['network', 'graph', 'dfs']],
  impl: `export interface ApHooks { onPath?: (p: number[]) => void; onResult?: (n: number) => void; }
export function allPathsSourceTarget(graph: number[][], hooks: ApHooks = {}): number[][] {
  const n = graph.length;
  const out: number[][] = [];
  const path: number[] = [0];
  const dfs = (u: number) => {
    if (u === n - 1) { out.push([...path]); hooks.onPath?.([...path]); return; }
    for (const v of graph[u] ?? []) { path.push(v); dfs(v); path.pop(); }
  };
  dfs(0);
  hooks.onResult?.(out.length);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPathsSourceTarget } from './impl.ts';
export const DEFAULT_INPUT = [[1,2],[3],[3],[]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '源到汇所有路径', en: 'All paths' }).commit();
  const paths = allPathsSourceTarget(input, { onPath: (p) => rec.begin({ zh: '路径 ' + p.join('→'), en: 'path ' + p.join('→') }).setBars(p.map((v) => ({ value: v, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '共 ' + paths.length + ' 条', en: paths.length + ' paths' }).setAux([{ label: 'count', value: String(paths.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPathsSourceTarget } from '../../src/algorithms/network/net-all-paths-src-tgt/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-all-paths-src-tgt/trace.ts';
test('allPathsSourceTarget 正确', () => {
  assert.deepEqual(allPathsSourceTarget([[1,2],[3],[3],[]]), [[0,1,3],[0,2,3]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 47. net-water-pour  —— 水壶问题（GCD）
ALGS.push({
  id: 'net-water-pour',
  m: ['水壶问题', 'Water and Jug Problem', '判断能否用两水壶（容量x,y）与无限水准确量出 z。', 'Measure exactly z using jugs of capacity x and y.',
    'z ≤ x+y 且 z 是 gcd(x,y) 的倍数。', 'z <= x+y and z % gcd(x,y) == 0. O(log min).', 'O(log min(x,y))', 'O(1)', ['network', 'math', 'gcd']],
  impl: `export interface WpHooks { onGcd?: (g: number) => void; onResult?: (ok: boolean) => void; }
function gcd(a: number, b: number): number { while (b !== 0) { [a, b] = [b, a % b]; } return a; }
export function canMeasureWater(jug1: number, jug2: number, target: number, hooks: WpHooks = {}): boolean {
  if (target > jug1 + jug2) { hooks.onResult?.(false); return false; }
  const g = gcd(jug1, jug2);
  hooks.onGcd?.(g);
  const ok = target % g === 0;
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canMeasureWater } from './impl.ts';
export const DEFAULT_INPUT = { jug1: 3, jug2: 5, target: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '水壶 ' + input.jug1 + '/' + input.jug2 + ' 量 ' + input.target, en: 'Jugs' }).commit();
  const ok = canMeasureWater(input.jug1, input.jug2, input.target, { onGcd: (g) => rec.begin({ zh: 'gcd = ' + g, en: 'gcd = ' + g }).setAux([{ label: 'gcd', value: String(g), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '能量出？' + ok, en: 'measure? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canMeasureWater } from '../../src/algorithms/network/net-water-pour/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-water-pour/trace.ts';
test('canMeasureWater 正确', () => {
  assert.equal(canMeasureWater(3, 5, 4), true);
  assert.equal(canMeasureWater(2, 6, 5), false);
  assert.equal(canMeasureWater(1, 2, 3), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 48. net-reconstruct-itinerary  —— 重建行程（Hierholzer 欧拉路径）
ALGS.push({
  id: 'net-reconstruct-itinerary',
  m: ['重建行程', 'Reconstruct Itinerary (Hierholzer)', '用 Hierholzer 算法从机票重建字典序最小的欧拉路径。', 'Lexicographically smallest Eulerian itinerary via Hierholzer.',
    '邻接表按字典序，DFS 后序逆序输出。', 'Post-order DFS on sorted adjacency, reverse. O(E log E).', 'O(E log E)', 'O(E)', ['network', 'graph', 'euler']],
  impl: `export interface RiHooks { onVisit?: (from: string, to: string) => void; onResult?: (path: string[]) => void; }
export function findItinerary(tickets: Array<[string, string]>, hooks: RiHooks = {}): string[] {
  const adj = new Map<string, string[]>();
  const ensure = (k: string) => { if (!adj.has(k)) adj.set(k, []); };
  for (const [f, t] of tickets) { ensure(f); ensure(t); adj.get(f)!.push(t); }
  for (const [, list] of adj) list.sort().reverse();
  const path: string[] = [];
  const stack: string[] = ['JFK'];
  while (stack.length) {
    const top = stack[stack.length - 1]!;
    const list = adj.get(top);
    if (list && list.length) { const next = list.pop()!; hooks.onVisit?.(top, next); stack.push(next); }
    else { path.push(stack.pop()!); }
  }
  path.reverse();
  hooks.onResult?.(path);
  return path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findItinerary } from './impl.ts';
export const DEFAULT_INPUT: Array<[string, string]> = [['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '重建行程', en: 'Reconstruct itinerary' }).commit();
  const path = findItinerary(input, { onVisit: (f, t) => rec.begin({ zh: f + ' → ' + t, en: f + ' → ' + t }).setAux([{ label: 'edge', value: f + '→' + t, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '行程：' + path.join(' → '), en: 'Path: ' + path.join(' → ') }).setBars(path.map((p, i) => ({ value: i, role: 'final' as BarRole, label: p }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findItinerary } from '../../src/algorithms/network/net-reconstruct-itinerary/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-reconstruct-itinerary/trace.ts';
test('findItinerary 正确', () => {
  assert.deepEqual(findItinerary([['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']]), ['JFK','MUC','LHR','SFO','SJC']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

for (const a of ALGS) {
  const m = a.m;
  const metaSrc = meta(a.id, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  writeAlg(a.id, metaSrc, a.impl, a.trace, a.test);
}
console.log(`network: wrote ${ALGS.length} algorithms`);
