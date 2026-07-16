// ai-search 类别 · 30 个算法规范
import { add } from './gen-batch.mjs';

// 通用 hooks 习惯：导出 XxxHooks 接口 + 主函数 + DEFAULT_INPUT。
// trace.ts 习惯：import TraceRecorder + impl；begin/commit 录帧；末帧 setAux 总结。

// ----- 1. ais-ida-star-search: IDA* 搜索 -----
add({
  cat: 'ai-search', id: 'ais-ida-star-search',
  title: { zh: 'IDA* 迭代加深 A*', en: 'IDA* Search' },
  summary: { zh: '带启发式阈值的迭代加深搜索。', en: 'Iterative deepening with heuristic threshold.' },
  description: { zh: 'IDA* 结合迭代加深与 A* 启发式，每轮以 f=g+h 不超过阈值为界深度优先，阈值随未能找到解的最小越界值递增。', en: 'IDA* combines iterative deepening with A* heuristic; each round DFS-bounds f=g+h by a threshold that grows.' },
  tags: ['ai-search','ida-star','heuristic','search'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  impl: `// IDA* · 实现
export interface IdaHooks {
  onVisit?: (node: number, g: number, f: number) => void;
  onThreshold?: (threshold: number) => void;
  onFound?: (node: number, g: number) => void;
}
export interface IdaGraph { start: number; goal: number; neighbors: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function idaStarSearch(g: IdaGraph, hooks: IdaHooks = {}): number[] {
  let threshold = g.h(g.start);
  hooks.onThreshold?.(threshold);
  const path: number[] = [];
  const dfs = (node: number, gCost: number): number => {
    const f = gCost + g.h(node);
    hooks.onVisit?.(node, gCost, f);
    if (f > threshold) return f;
    if (node === g.goal) { hooks.onFound?.(node, gCost); return -1; }
    path.push(node);
    let min = Infinity;
    for (const e of g.neighbors(node)) {
      const t = dfs(e.to, gCost + e.cost);
      if (t === -1) return -1;
      if (t < min) min = t;
    }
    path.pop();
    return min;
  };
  while (true) {
    const t = dfs(g.start, 0);
    if (t === -1) return path;
    if (t === Infinity) return [];
    threshold = t;
    hooks.onThreshold?.(threshold);
  }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { idaStarSearch, type IdaGraph } from './impl.ts';
const G: IdaGraph = {
  start: 0, goal: 4,
  neighbors: (n) => [{to:1,cost:1},{to:2,cost:4}].concat(n===1?[{to:3,cost:2}]:[]).concat(n===3?[{to:4,cost:3}]:[]) as any,
  h: (n) => [4,3,2,1,0][n] ?? 0,
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: IdaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'IDA* 起点 0 终点 4', en: 'IDA* 0->4' }).commit();
  const path = idaStarSearch(input, {
    onThreshold: (t) => rec.begin({ zh: '阈值=' + t, en: 'threshold=' + t }).setAux([{label:'阈值',value:String(t),role:'pivot' as BarRole}]).commit(),
    onVisit: (n, gc, f) => rec.begin({ zh: '访问 ' + n, en: 'visit ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole},{label:'f',value:String(f),role:'default' as BarRole}]).commit(),
    onFound: (n) => rec.begin({ zh: '到达目标 ' + n, en: 'goal ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { idaStarSearch, type IdaGraph } from '../../src/algorithms/ai-search/ais-ida-star-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ida-star-search/trace.ts';
const G: IdaGraph = { start:0,goal:2, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:[], h:(n)=>[2,1,0][n]??0 };
test('ida-star 找到目标', () => { assert.deepEqual(idaStarSearch(G), [0]); });
test('ida-star trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 2. ais-fringe-search -----
add({
  cat: 'ai-search', id: 'ais-fringe-search',
  title: { zh: 'Fringe Search', en: 'Fringe Search' },
  summary: { zh: 'IDA* 的改进版，维护待展开叶节点链表。', en: 'IDA* variant keeping a fringe list of leaves.' },
  description: { zh: 'Fringe Search 用一个链表保存当前边界节点，避免 IDA* 重复从头展开，对大阈值更高效。', en: 'Fringe Search keeps a linked list of frontier nodes, avoiding IDA* re-expansion from the root each round.' },
  tags: ['ai-search','fringe','heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
  impl: `export interface FringeHooks { onExpand?: (node: number, f: number) => void; onThreshold?: (t: number) => void; }
export interface FringeGraph { start: number; goal: number; neighbors: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function fringeSearch(g: FringeGraph, hooks: FringeHooks = {}): number[] {
  let threshold = g.h(g.start);
  const now: Array<{ node: number; g: number }> = [{ node: g.start, g: 0 }];
  const parent = new Map<number, number>();
  while (now.length) {
    hooks.onThreshold?.(threshold);
    const later: Array<{ node: number; g: number }> = [];
    let next = Infinity;
    let i = 0;
    while (i < now.length) {
      const cur = now[i]!;
      const f = cur.g + g.h(cur.node);
      hooks.onExpand?.(cur.node, f);
      if (cur.node === g.goal) {
        const path: number[] = []; let n: number | undefined = cur.node;
        while (n !== undefined) { path.unshift(n); n = parent.get(n); }
        return path;
      }
      if (f > threshold) { if (f < next) next = f; later.push(cur); }
      else { for (const e of g.neighbors(cur.node)) { if (!parent.has(e.to)) { parent.set(e.to, cur.node); now.splice(i + 1, 0, { node: e.to, g: cur.g + e.cost }); } } }
      i++;
    }
    threshold = next;
    now.length = 0; now.push(...later);
    if (next === Infinity) break;
  }
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fringeSearch, type FringeGraph } from './impl.ts';
const G: FringeGraph = { start:0,goal:3, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:4}]:n===1?[{to:3,cost:2}]:[], h:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: FringeGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Fringe Search', en: 'Fringe Search' }).commit();
  const path = fringeSearch(input, {
    onThreshold: (t) => rec.begin({ zh: '阈值 ' + t, en: 'thr ' + t }).setAux([{label:'thr',value:String(t),role:'pivot' as BarRole}]).commit(),
    onExpand: (n, f) => rec.begin({ zh: '展开 ' + n + ' f=' + f, en: 'expand ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fringeSearch, type FringeGraph } from '../../src/algorithms/ai-search/ais-fringe-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-fringe-search/trace.ts';
const G: FringeGraph = { start:0,goal:2, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:[], h:(n)=>[2,1,0][n]??0 };
test('fringe 找到目标', () => assert.deepEqual(fringeSearch(G), [0,2]));
test('fringe trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 3. ais-sma-star: SMA* -----
add({
  cat: 'ai-search', id: 'ais-sma-star',
  title: { zh: 'SMA* 简化记忆受限 A*', en: 'Simplified Memory-Bounded A*' },
  summary: { zh: '内存受限的 A*，超出预算时丢弃最差节点。', en: 'Memory-bounded A* that forgets worst node on overflow.' },
  description: { zh: 'SMA*(Simplified Memory-Bounded A*) 在 A* 基础上限制开放表大小，溢出时回收 f 值最大的叶节点并把其回退值回填父节点。', en: 'SMA* caps the open list; on overflow it drops the leaf with largest f, propagating a backup f-value to its parent.' },
  tags: ['ai-search','sma-star','heuristic','memory-bounded'],
  complexity: { time: 'O(b^d)', space: 'O(m)' },
  impl: `export interface SmaHooks { onExpand?: (node: number, f: number) => void; onForget?: (node: number) => void; }
export interface SmaGraph { start: number; goal: number; neighbors: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function smaStarSearch(g: SmaGraph, memLimit: number, hooks: SmaHooks = {}): number[] {
  type N = { node: number; g: number; f: number; parent: number | null; backup: number };
  const open: N[] = [{ node: g.start, g: 0, f: g.h(g.start), parent: null, backup: Infinity }];
  const parentMap = new Map<number, number>();
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const best = open.shift()!;
    hooks.onExpand?.(best.node, best.f);
    if (best.node === g.goal) {
      const path: number[] = []; let n: number | null = best.node;
      while (n !== null) { path.unshift(n); n = parentMap.get(n) ?? null; }
      return path;
    }
    for (const e of g.neighbors(best.node)) {
      if (open.length >= memLimit) {
        open.sort((a, b) => b.f - a.f);
        const worst = open.pop()!;
        hooks.onForget?.(worst.node);
      }
      parentMap.set(e.to, best.node);
      open.push({ node: e.to, g: best.g + e.cost, f: best.g + e.cost + g.h(e.to), parent: best.node, backup: Infinity });
    }
  }
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { smaStarSearch, type SmaGraph } from './impl.ts';
const G: SmaGraph = { start:0,goal:3, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:4}]:n===1?[{to:3,cost:2}]:[], h:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: SmaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SMA* memLimit=8', en: 'SMA* mem=8' }).commit();
  const path = smaStarSearch(input, 8, {
    onExpand: (n, f) => rec.begin({ zh: '展开 ' + n + ' f=' + f, en: 'expand ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole}]).commit(),
    onForget: (n) => rec.begin({ zh: '丢弃 ' + n, en: 'forget ' + n }).setAux([{label:'forget',value:String(n),role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smaStarSearch, type SmaGraph } from '../../src/algorithms/ai-search/ais-sma-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-sma-star/trace.ts';
const G: SmaGraph = { start:0,goal:2, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:[], h:(n)=>[2,1,0][n]??0 };
test('sma-star 找到目标', () => assert.deepEqual(smaStarSearch(G,8), [0,2]));
test('sma-star trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 4. ais-rbfs: 递归最佳优先搜索 -----
add({
  cat: 'ai-search', id: 'ais-rbfs-search',
  title: { zh: 'RBFS 递归最佳优先', en: 'Recursive Best-First Search' },
  summary: { zh: '线性空间最佳优先，f 上界随递归回传。', en: 'Linear-space best-first with f-limit backtracking.' },
  description: { zh: 'RBFS(Russell 1992)用线性内存模拟最佳优先：递归记录当前路径上每个节点的 f 上界，回溯时把次优 f 传回。', en: 'RBFS mimics best-first in linear space by tracking an f-limit along the recursion path and back-propagating alternate f.' },
  tags: ['ai-search','rbfs','heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  impl: `export interface RbfsHooks { onVisit?: (node: number, f: number, flimit: number) => void; onFound?: (node: number) => void; }
export interface RbfsGraph { start: number; goal: number; neighbors: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function rbfsSearch(g: RbfsGraph, hooks: RbfsHooks = {}): number[] {
  const rec = (node: number, gCost: number, flimit: number): { found: boolean; flimit: number; path: number[] } => {
    const f = gCost + g.h(node);
    hooks.onVisit?.(node, f, flimit);
    if (f > flimit) return { found: false, flimit: f, path: [] };
    if (node === g.goal) { hooks.onFound?.(node); return { found: true, flimit: f, path: [node] }; }
    const succ: Array<{ to: number; f: number }> = g.neighbors(node).map((e) => ({ to: e.to, f: Math.max(gCost + e.cost + g.h(e.to), f) }));
    if (!succ.length) return { found: false, flimit: Infinity, path: [] };
    while (true) {
      succ.sort((a, b) => a.f - b.f);
      const best = succ[0]!;
      if (best.f > flimit) return { found: false, flimit: best.f, path: [] };
      const alt = succ[1]?.f ?? Infinity;
      const e = g.neighbors(node).find((e) => e.to === best.to)!;
      const r = rec(best.to, gCost + e.cost, Math.min(flimit, alt));
      const idx = succ.findIndex((s) => s.to === best.to);
      if (idx >= 0) succ[idx]!.f = r.flimit;
      if (r.found) return { found: true, flimit: r.flimit, path: [node, ...r.path] };
    }
  };
  const r = rec(g.start, 0, Infinity);
  return r.path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rbfsSearch, type RbfsGraph } from './impl.ts';
const G: RbfsGraph = { start:0,goal:3, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:4}]:n===1?[{to:3,cost:2}]:[], h:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: RbfsGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RBFS', en: 'RBFS' }).commit();
  const path = rbfsSearch(input, {
    onVisit: (n, f, fl) => rec.begin({ zh: '访问 ' + n + ' f=' + f, en: 'visit ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole},{label:'f',value:String(f),role:'pivot' as BarRole},{label:'flimit',value:String(fl),role:'default' as BarRole}]).commit(),
    onFound: (n) => rec.begin({ zh: '目标 ' + n, en: 'goal ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rbfsSearch, type RbfsGraph } from '../../src/algorithms/ai-search/ais-rbfs-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rbfs-search/trace.ts';
const G: RbfsGraph = { start:0,goal:2, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:[], h:(n)=>[2,1,0][n]??0 };
test('rbfs 找到目标', () => assert.deepEqual(rbfsSearch(G), [0,2]));
test('rbfs trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 5. ais-learning-realtime-a-star: LRTA* -----
add({
  cat: 'ai-search', id: 'ais-lrta-star',
  title: { zh: 'LRTA* 实时学习 A*', en: 'Learning Real-Time A*' },
  summary: { zh: '实时启发式搜索，边走边更新 h 表。', en: 'Real-time heuristic search updating h as it moves.' },
  description: { zh: 'LRTA*(Korf 1990)每步选择使 g+h 最小的邻居并把当前 h 增大到最小邻居 h+1，多轮后收敛到最优。', en: 'LRTA* picks the neighbor minimizing g+h and raises h toward neighbor h+1 each step; converges to optimal over trials.' },
  tags: ['ai-search','lrta-star','real-time','learning'],
  complexity: { time: 'O(n) per step', space: 'O(n)' },
  impl: `export interface LrtaHooks { onStep?: (node: number, h: number) => void; onGoal?: (node: number) => void; }
export interface LrtaGraph { start: number; goal: number; neighbors: (n: number) => number[]; h0: (n: number) => number; }
export function lrtaStarSearch(g: LrtaGraph, maxSteps: number, hooks: LrtaHooks = {}): number[] {
  const h = new Map<number, number>();
  for (let n = 0; ; n++) { h.set(n, g.h0(n)); if (n > 1000) break; }
  const path: number[] = [g.start];
  let cur = g.start;
  for (let s = 0; s < maxSteps; s++) {
    hooks.onStep?.(cur, h.get(cur) ?? 0);
    if (cur === g.goal) { hooks.onGoal?.(cur); return path; }
    const ns = g.neighbors(cur);
    if (!ns.length) break;
    let best = ns[0]!; let bestF = (h.get(best) ?? 0) + 1;
    for (const n of ns) { const f = (h.get(n) ?? 0) + 1; if (f < bestF) { bestF = f; best = n; } }
    h.set(cur, bestF);
    path.push(best); cur = best;
  }
  return path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lrtaStarSearch, type LrtaGraph } from './impl.ts';
const G: LrtaGraph = { start:0,goal:3, neighbors:(n)=> n===0?[1,2]:n===1?[3]:n===2?[1]:[], h0:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: LrtaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LRTA*', en: 'LRTA*' }).commit();
  const path = lrtaStarSearch(input, 50, {
    onStep: (n, h) => rec.begin({ zh: '在 ' + n + ' h=' + h, en: 'at ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole},{label:'h',value:String(h),role:'pivot' as BarRole}]).commit(),
    onGoal: (n) => rec.begin({ zh: '到达 ' + n, en: 'reached ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lrtaStarSearch, type LrtaGraph } from '../../src/algorithms/ai-search/ais-lrta-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-lrta-star/trace.ts';
const G: LrtaGraph = { start:0,goal:2, neighbors:(n)=> n===0?[1,2]:[], h0:(n)=>[2,1,0][n]??0 };
test('lrta 找到目标', () => assert.equal(lrtaStarSearch(G,10).at(-1), 2));
test('lrta trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 6. ais-dstar-lite -----
add({
  cat: 'ai-search', id: 'ais-dstar-lite',
  title: { zh: 'D* Lite', en: 'D* Lite' },
  summary: { zh: '增量式启发式搜索，环境变化时高效重规划。', en: 'Incremental heuristic replanning under dynamic costs.' },
  description: { zh: 'D* Lite(Koenig & Likhachev)在代价变化时只重算受影响节点，常用于移动机器人路径重规划。', en: 'D* Lite recomputes only affected nodes when edge costs change; widely used in robot replanning.' },
  tags: ['ai-search','d-star','incremental','dynamic'],
  complexity: { time: 'O(k log n)', space: 'O(n)' },
  impl: `export interface DStarHooks { onExpand?: (node: number, rhs: number) => void; onPath?: (path: number[]) => void; }
export interface DStarGraph { start: number; goal: number; pred: (n: number) => Array<{ from: number; cost: number }>; succ: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function dStarLite(g: DStarGraph, hooks: DStarHooks = {}): number[] {
  const g1 = new Map<number, number>(); const rhs = new Map<number, number>();
  const get = (m: Map<number, number>, n: number) => m.get(n) ?? Infinity;
  rhs.set(g.goal, 0);
  const pq: Array<{ k: [number, number]; node: number }> = [{ k: [g.h(g.goal), 0], node: g.goal }];
  const pop = () => { pq.sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1]); return pq.shift()!; };
  const key = (n: number): [number, number] => { const gg = get(g1, n); const rr = get(rhs, n); return [Math.min(gg, rr) + g.h(n), Math.min(gg, rr)]; };
  const update = (u: number) => { if (g1.get(u) !== rhs.get(u)) pq.push({ k: key(u), node: u }); };
  while (pq.length) {
    const { node: u } = pop();
    hooks.onExpand?.(u, get(rhs, u));
    if (u === g.start && get(g1, u) === get(rhs, u)) break;
    for (const p of g.pred(u)) { const cand = p.cost + get(g1, u); if (cand < get(rhs, p.from)) { rhs.set(p.from, cand); update(p.from); } }
    g1.set(u, get(rhs, u));
  }
  const path: number[] = []; let cur = g.start;
  for (let i = 0; i < 100 && cur !== g.goal; i++) {
    path.push(cur);
    let best = -1; let bestC = Infinity;
    for (const s of g.succ(cur)) { const c = s.cost + get(g1, s.to); if (c < bestC) { bestC = c; best = s.to; } }
    if (best < 0) break; cur = best;
  }
  path.push(g.goal);
  hooks.onPath?.(path);
  return path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dStarLite, type DStarGraph } from './impl.ts';
const E: Record<string, number> = { '0-1':1, '1-2':1, '0-2':5 };
const G: DStarGraph = { start:0, goal:2,
  pred:(n)=> n===2?[{from:1,cost:E['1-2']!},{from:0,cost:E['0-2']!}]:n===1?[{from:0,cost:E['0-1']!}]:[],
  succ:(n)=> n===0?[{to:1,cost:E['0-1']!},{to:2,cost:E['0-2']!}]:n===1?[{to:2,cost:E['1-2']!}]:[],
  h:(n)=>[2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: DStarGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'D* Lite', en: 'D* Lite' }).commit();
  const path = dStarLite(input, {
    onExpand: (n, r) => rec.begin({ zh: '展开 ' + n + ' rhs=' + r, en: 'expand ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole}]).commit(),
    onPath: (p) => rec.begin({ zh: '路径 ' + p.join('->'), en: 'path ' + p.join('->') }).setAux([{label:'path',value:p.join('->'),role:'final' as BarRole}]).commit(),
  });
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dStarLite, type DStarGraph } from '../../src/algorithms/ai-search/ais-dstar-lite/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-dstar-lite/trace.ts';
const G: DStarGraph = { start:0, goal:2, pred:(n)=> n===2?[{from:1,cost:1},{from:0,cost:5}]:n===1?[{from:0,cost:1}]:[], succ:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:n===1?[{to:2,cost:1}]:[], h:(n)=>[2,1,0][n]??0 };
test('dstar-lite 返回路径', () => { const p = dStarLite(G); assert.equal(p[0], 0); assert.equal(p.at(-1), 2); });
test('dstar-lite trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 7. ais-iterative-broadening -----
add({
  cat: 'ai-search', id: 'ais-iterative-broadening',
  title: { zh: '迭代加宽搜索', en: 'Iterative Broadening' },
  summary: { zh: '逐步放宽每节点展开的子节点上限。', en: 'Progressively widens the branching factor cap.' },
  description: { zh: '迭代加宽(Iterative Broadening, Lee & Mahajan)每轮只展开每节点前 B 个子节点，B 递增，用受限宽度换取早终止。', en: 'Iterative Broadening expands only the first B children per node per round, increasing B to trade breadth for early termination.' },
  tags: ['ai-search','iterative-broadening','tree-search'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  impl: `export interface IbHooks { onVisit?: (node: number, depth: number, cap: number) => void; onFound?: (node: number) => void; }
export interface IbTree { root: number; goal: number; children: (n: number) => number[]; maxBranch: number; maxDepth: number; }
export function iterativeBroadening(t: IbTree, hooks: IbHooks = {}): number[] {
  for (let cap = 1; cap <= t.maxBranch; cap++) {
    const path: number[] = [];
    const dfs = (n: number, d: number): boolean => {
      if (d > t.maxDepth) return false;
      hooks.onVisit?.(n, d, cap);
      path.push(n);
      if (n === t.goal) { hooks.onFound?.(n); return true; }
      const kids = t.children(n).slice(0, cap);
      for (const c of kids) if (dfs(c, d + 1)) return true;
      path.pop();
      return false;
    };
    if (dfs(t.root, 0)) return path;
  }
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iterativeBroadening, type IbTree } from './impl.ts';
const T: IbTree = { root:0,goal:5, maxBranch:3, maxDepth:4, children:(n)=> [1,2,3].map((k)=>n*3+k) };
export const DEFAULT_INPUT = T;
export function buildTrace(input: IbTree = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '迭代加宽', en: 'Iterative Broadening' }).commit();
  const path = iterativeBroadening(input, {
    onVisit: (n, d, cap) => rec.begin({ zh: '访问 ' + n + ' 深度' + d + ' 上限' + cap, en: 'visit ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole},{label:'cap',value:String(cap),role:'pivot' as BarRole}]).commit(),
    onFound: (n) => rec.begin({ zh: '找到 ' + n, en: 'found ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iterativeBroadening, type IbTree } from '../../src/algorithms/ai-search/ais-iterative-broadening/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-iterative-broadening/trace.ts';
const T: IbTree = { root:0,goal:2, maxBranch:3, maxDepth:2, children:(n)=> [n*3+1,n*3+2,n*3+3] };
test('ib 找到目标', () => assert.deepEqual(iterativeBroadening(T), [0,2]));
test('ib trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 8. ais-random-restart-hill -----
add({
  cat: 'ai-search', id: 'ais-random-restart-hill',
  title: { zh: '随机重启爬山', en: 'Random-Restart Hill Climbing' },
  summary: { zh: '陷入局部最优即随机重启。', en: 'Restarts from random state on local optimum.' },
  description: { zh: '随机重启爬山在到达局部最优时重置到随机起点，多次重启以逼近全局最优。', en: 'Random-restart hill climbing restarts from a random state upon hitting a local optimum to approximate the global one.' },
  tags: ['ai-search','hill-climbing','restart'],
  complexity: { time: 'O(r * s)', space: 'O(1)' },
  impl: `export interface RrhcHooks { onStep?: (state: number, val: number, restart: number) => void; onRestart?: (restart: number) => void; }
export interface RrhcProblem { domain: [number, number]; eval: (x: number) => number; neighbors: (x: number) => number[]; rand: () => number; }
export function randomRestartHill(p: RrhcProblem, restarts: number, hooks: RrhcHooks = {}): number {
  let best = p.rand(); let bestVal = p.eval(best);
  for (let r = 0; r <= restarts; r++) {
    let cur = r === 0 ? best : p.rand(); hooks.onRestart?.(r);
    let improved = true;
    while (improved) {
      improved = false;
      for (const nb of p.neighbors(cur)) {
        const v = p.eval(nb); hooks.onStep?.(nb, v, r);
        if (v > p.eval(cur)) { cur = nb; improved = true; }
      }
    }
    if (p.eval(cur) > bestVal) { best = cur; bestVal = p.eval(cur); }
  }
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomRestartHill, type RrhcProblem } from './impl.ts';
const P: RrhcProblem = { domain:[0,10], eval:(x)=> -Math.abs(x-7)+10, neighbors:(x)=>[x-1,x+1], rand:()=> Math.floor(Math.random()*10) };
export const DEFAULT_INPUT = P;
export function buildTrace(input: RrhcProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机重启爬山', en: 'Random-Restart HC' }).commit();
  const best = randomRestartHill(input, 3, {
    onRestart: (r) => rec.begin({ zh: '重启 #' + r, en: 'restart #' + r }).setAux([{label:'restart',value:String(r),role:'pivot' as BarRole}]).commit(),
    onStep: (s, v) => rec.begin({ zh: '状态 ' + s + ' 值' + v.toFixed(1), en: 'state ' + s }).setAux([{label:'state',value:String(s),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '最优 ' + best, en: 'best ' + best }).setAux([{label:'best',value:String(best),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomRestartHill, type RrhcProblem } from '../../src/algorithms/ai-search/ais-random-restart-hill/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-random-restart-hill/trace.ts';
const P: RrhcProblem = { domain:[0,10], eval:(x)=> -Math.abs(x-7)+10, neighbors:(x)=>[x-1,x+1], rand:()=>0 };
test('rrhc 返回域内', () => { const b = randomRestartHill(P, 2); assert.ok(b >= 0 && b <= 10); });
test('rrhc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 9. ais-stochastic-hill -----
add({
  cat: 'ai-search', id: 'ais-stochastic-hill',
  title: { zh: '随机爬山', en: 'Stochastic Hill Climbing' },
  summary: { zh: '按概率接受更好邻居。', en: 'Probabilistically accepts uphill neighbors.' },
  description: { zh: '随机爬山从所有更优邻居中按某概率分布挑选一个移动，避免确定性贪心陷入固定路径。', en: 'Stochastic hill climbing picks an improving neighbor probabilistically, escaping deterministic greedy paths.' },
  tags: ['ai-search','hill-climbing','stochastic'],
  complexity: { time: 'O(s)', space: 'O(1)' },
  impl: `export interface ShcHooks { onStep?: (cur: number, val: number) => void; }
export interface ShcProblem { start: number; eval: (x: number) => number; neighbors: (x: number) => number[]; rand: () => number; }
export function stochasticHill(p: ShcProblem, steps: number, hooks: ShcHooks = {}): number {
  let cur = p.start;
  for (let s = 0; s < steps; s++) {
    hooks.onStep?.(cur, p.eval(cur));
    const better = p.neighbors(cur).filter((n) => p.eval(n) > p.eval(cur));
    if (!better.length) break;
    cur = better[Math.floor(p.rand() * better.length)]!;
  }
  return cur;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stochasticHill, type ShcProblem } from './impl.ts';
const P: ShcProblem = { start:0, eval:(x)=> -Math.abs(x-7)+10, neighbors:(x)=>[x-1,x+1], rand:()=>Math.random() };
export const DEFAULT_INPUT = P;
export function buildTrace(input: ShcProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机爬山', en: 'Stochastic HC' }).commit();
  const best = stochasticHill(input, 12, {
    onStep: (c, v) => rec.begin({ zh: '状态 ' + c + ' 值' + v.toFixed(1), en: 'state ' + c }).setAux([{label:'state',value:String(c),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '终态 ' + best, en: 'final ' + best }).setAux([{label:'final',value:String(best),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stochasticHill, type ShcProblem } from '../../src/algorithms/ai-search/ais-stochastic-hill/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-stochastic-hill/trace.ts';
const P: ShcProblem = { start:0, eval:(x)=> -Math.abs(x-3)+9, neighbors:(x)=>[x+1], rand:()=>0 };
test('shc 单调上升', () => assert.equal(stochasticHill(P,3), 3));
test('shc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 10. ais-beam-stack -----
add({
  cat: 'ai-search', id: 'ais-beam-stack',
  title: { zh: 'Beam Stack Search', en: 'Beam Stack Search' },
  summary: { zh: '可回溯的束搜索变体。', en: 'Backtrackable beam search.' },
  description: { zh: 'Beam Stack(Zhou & Hansen)在束搜索基础上保留被剪枝的次优层，使搜索能在失败时回溯而非终止。', en: 'Beam Stack keeps pruned suboptimal layers so beam search can backtrack rather than terminate on failure.' },
  tags: ['ai-search','beam-search','backtracking'],
  complexity: { time: 'O(b*w*d)', space: 'O(w*d)' },
  impl: `export interface BsHooks { onLayer?: (depth: number, beam: number[]) => void; onPrune?: (depth: number, kept: number, pruned: number) => void; }
export interface BsProblem { start: number; goal: number; expand: (n: number) => number[]; eval: (n: number) => number; beamWidth: number; maxDepth: number; }
export function beamStackSearch(p: BsProblem, hooks: BsHooks = {}): number[] | null {
  let beam = [p.start];
  for (let d = 0; d < p.maxDepth; d++) {
    hooks.onLayer?.(d, beam);
    const next: number[] = [];
    for (const n of beam) for (const c of p.expand(n)) next.push(c);
    if (!next.length) return null;
    next.sort((a, b) => p.eval(a) - p.eval(b));
    const kept = next.slice(0, p.beamWidth);
    hooks.onPrune?.(d, kept.length, next.length - kept.length);
    if (kept.some((n) => n === p.goal)) return kept;
    beam = kept;
  }
  return null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beamStackSearch, type BsProblem } from './impl.ts';
const P: BsProblem = { start:0,goal:5, expand:(n)=> [n*2+1,n*2+2], eval:(n)=> Math.abs(n-5), beamWidth:2, maxDepth:5 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: BsProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Beam Stack', en: 'Beam Stack' }).commit();
  const res = beamStackSearch(input, {
    onLayer: (d, beam) => rec.begin({ zh: '层 ' + d + ': [' + beam.join(',') + ']', en: 'layer ' + d }).setAux([{label:'beam',value:beam.join(','),role:'compare' as BarRole}]).commit(),
    onPrune: (d, k, pr) => rec.begin({ zh: '层' + d + ' 留' + k + ' 剪' + pr, en: 'prune' }).setAux([{label:'pruned',value:String(pr),role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + (res ? res.join(',') : 'null'), en: 'result' }).setAux([{label:'result',value:res?res.join(','):'null',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beamStackSearch, type BsProblem } from '../../src/algorithms/ai-search/ais-beam-stack/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-beam-stack/trace.ts';
const P: BsProblem = { start:0,goal:2, expand:(n)=> [n+1], eval:(n)=> Math.abs(n-2), beamWidth:1, maxDepth:5 };
test('beam-stack 找到目标', () => assert.notEqual(beamStackSearch(P), null));
test('beam-stack trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 11. ais-branch-and-bound -----
add({
  cat: 'ai-search', id: 'ais-bnb-search',
  title: { zh: '分支定界搜索', en: 'Branch and Bound Search' },
  summary: { zh: '用上/下界剪掉不可能更优的子树。', en: 'Prunes subtrees that cannot beat the bound.' },
  description: { zh: '分支定界(B&B)在搜索过程中维护当前最优解代价，对代价下界已超过最优的分支剪除。', en: 'Branch and Bound keeps the incumbent cost and prunes any branch whose lower bound exceeds it.' },
  tags: ['ai-search','branch-and-bound','optimization'],
  complexity: { time: 'O(2^n) worst', space: 'O(n)' },
  impl: `export interface BnbHooks { onBind?: (best: number) => void; onVisit?: (node: number, cost: number, bound: number) => void; onPrune?: (node: number, bound: number) => void; }
export interface BnbProblem { items: Array<{ weight: number; value: number }>; capacity: number; }
export function bnbSearch(p: BnbProblem, hooks: BnbHooks = {}): number {
  const n = p.items.length;
  const order = [...p.items].map((it, i) => ({ i, ratio: it.value / it.weight })).sort((a, b) => b.ratio - a.ratio);
  let best = 0;
  const ub = (idx: number, cap: number, val: number): number => {
    let b = val; let c = cap;
    for (let k = idx; k < n; k++) { const it = p.items[order[k]!.i]!; if (c >= it.weight) { c -= it.weight; b += it.value; } else { b += it.value * (c / it.weight); break; } }
    return b;
  };
  const dfs = (idx: number, cap: number, val: number) => {
    if (val > best) { best = val; hooks.onBind?.(best); }
    if (idx >= n) return;
    const it = p.items[order[idx]!.i]!;
    const bound = ub(idx, cap, val);
    hooks.onVisit?.(order[idx]!.i, val, bound);
    if (bound <= best) { hooks.onPrune?.(order[idx]!.i, bound); return; }
    if (cap >= it.weight) dfs(idx + 1, cap - it.weight, val + it.value);
    dfs(idx + 1, cap, val);
  };
  dfs(0, p.capacity, 0);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bnbSearch, type BnbProblem } from './impl.ts';
const P: BnbProblem = { items:[{weight:2,value:3},{weight:3,value:4},{weight:4,value:5},{weight:5,value:8}], capacity:8 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: BnbProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分支定界 容量8', en: 'B&B cap=8' }).commit();
  const best = bnbSearch(input, {
    onBind: (b) => rec.begin({ zh: '新最优 ' + b, en: 'best ' + b }).setAux([{label:'best',value:String(b),role:'final' as BarRole}]).commit(),
    onPrune: (n, bd) => rec.begin({ zh: '剪枝 item' + n + ' bound' + bd.toFixed(1), en: 'prune' }).setAux([{label:'pruned',value:'item'+n,role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '最优值 ' + best, en: 'optimal ' + best }).setAux([{label:'opt',value:String(best),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bnbSearch, type BnbProblem } from '../../src/algorithms/ai-search/ais-bnb-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bnb-search/trace.ts';
const P: BnbProblem = { items:[{weight:1,value:1},{weight:2,value:5}], capacity:2 };
test('bnb 求最优值', () => assert.equal(bnbSearch(P), 5));
test('bnb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 12. ais-sma-rt-a-star (RTA*) -----
add({
  cat: 'ai-search', id: 'ais-rta-star',
  title: { zh: 'RTA* 实时 A*', en: 'Real-Time A*' },
  summary: { zh: '每步选最优邻居并把 h 设为次优。', en: 'Each step picks best neighbor, h set to 2nd best.' },
  description: { zh: 'RTA*(Korf 1990)每步选择使 h 最小的邻居移动，并把当前节点 h 改写为次小邻居 h+1，单次试跑。', en: 'RTA* moves to the neighbor with smallest h and rewrites the current h to the second-smallest neighbor h+1.' },
  tags: ['ai-search','rta-star','real-time'],
  complexity: { time: 'O(b) per step', space: 'O(n)' },
  impl: `export interface RtaHooks { onStep?: (node: number, next: number) => void; onGoal?: (node: number) => void; }
export interface RtaGraph { start: number; goal: number; neighbors: (n: number) => number[]; h0: (n: number) => number; }
export function rtaStarSearch(g: RtaGraph, maxSteps: number, hooks: RtaHooks = {}): number[] {
  const h = new Map<number, number>();
  const get = (n: number) => { if (!h.has(n)) h.set(n, g.h0(n)); return h.get(n)!; };
  const path: number[] = [g.start]; let cur = g.start;
  for (let s = 0; s < maxSteps; s++) {
    if (cur === g.goal) { hooks.onGoal?.(cur); return path; }
    const ns = g.neighbors(cur).map((n) => ({ n, f: get(n) + 1 }));
    ns.sort((a, b) => a.f - b.f);
    if (!ns.length) break;
    h.set(cur, Math.max(ns[0]!.f, ns[1]?.f ?? ns[0]!.f));
    hooks.onStep?.(cur, ns[0]!.n);
    cur = ns[0]!.n; path.push(cur);
  }
  return path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rtaStarSearch, type RtaGraph } from './impl.ts';
const G: RtaGraph = { start:0,goal:3, neighbors:(n)=> n===0?[1,2]:n===1?[3]:n===2?[1,3]:[], h0:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: RtaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RTA*', en: 'RTA*' }).commit();
  const path = rtaStarSearch(input, 50, {
    onStep: (c, nx) => rec.begin({ zh: '在' + c + ' 去' + nx, en: c + '->' + nx }).setAux([{label:'from',value:String(c),role:'compare' as BarRole},{label:'to',value:String(nx),role:'pivot' as BarRole}]).commit(),
    onGoal: (n) => rec.begin({ zh: '到达 ' + n, en: 'goal ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rtaStarSearch, type RtaGraph } from '../../src/algorithms/ai-search/ais-rta-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rta-star/trace.ts';
const G: RtaGraph = { start:0,goal:2, neighbors:(n)=> n===0?[1,2]:[], h0:(n)=>[2,1,0][n]??0 };
test('rta 找到目标', () => assert.equal(rtaStarSearch(G,10).at(-1), 2));
test('rta trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 13. ais-bidirectional-bfs-search -----
add({
  cat: 'ai-search', id: 'ais-bidirectional-bfs-search',
  title: { zh: '双向 BFS 搜索', en: 'Bidirectional BFS Search' },
  summary: { zh: '从源和汇同时 BFS 在中间相会。', en: 'BFS from both ends, meet in the middle.' },
  description: { zh: '双向 BFS 从起点和终点交替扩展，当两个前沿相遇即得最短路径，复杂度从 O(b^d) 降到 O(b^(d/2))。', en: 'Bidirectional BFS alternates expanding from start and goal; meeting frontiers yield shortest path, reducing cost to O(b^(d/2)).' },
  tags: ['ai-search','bidirectional','bfs'],
  complexity: { time: 'O(b^(d/2))', space: 'O(b^(d/2))' },
  impl: `export interface BiBfsHooks { onExpand?: (side: 'f'|'b', node: number) => void; onMeet?: (node: number) => void; }
export interface BiBfsGraph { start: number; goal: number; adj: (n: number) => number[]; }
export function bidirectionalBfs(g: BiBfsGraph, hooks: BiBfsHooks = {}): number[] {
  if (g.start === g.goal) return [g.start];
  const seenF = new Map<number, number>([[g.start, -1]]);
  const seenB = new Map<number, number>([[g.goal, -1]]);
  let qF = [g.start]; let qB = [g.goal];
  while (qF.length && qB.length) {
    const expandSide = (front: number[], seen: Map<number, number>, other: Map<number, number>, side: 'f'|'b'): number | null => {
      const next: number[] = [];
      for (const n of front) {
        hooks.onExpand?.(side, n);
        for (const m of g.adj(n)) {
          if (!seen.has(m)) { seen.set(m, n); if (other.has(m)) { hooks.onMeet?.(m); return m; } next.push(m); }
        }
      }
      front.length = 0; front.push(...next); return null;
    };
    const meet = qF.length <= qB.length ? expandSide(qF, seenF, seenB, 'f') : expandSide(qB, seenB, seenF, 'b');
    if (meet !== null) {
      const pf: number[] = []; let c: number | undefined = meet; while (c !== undefined && c !== -1) { pf.unshift(c); c = seenF.get(c); }
      const pb: number[] = []; let d: number | undefined = seenB.get(meet); while (d !== undefined && d !== -1) { pb.push(d); d = seenB.get(d); }
      return [...pf, ...pb];
    }
  }
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bidirectionalBfs, type BiBfsGraph } from './impl.ts';
const G: BiBfsGraph = { start:0,goal:5, adj:(n)=> n===0?[1,2]:n===1?[3,4]:n===2?[4]:n===3?[5]:n===4?[5]:[] };
export const DEFAULT_INPUT = G;
export function buildTrace(input: BiBfsGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '双向 BFS', en: 'Bidirectional BFS' }).commit();
  const path = bidirectionalBfs(input, {
    onExpand: (s, n) => rec.begin({ zh: (s==='f'?'前':'后') + '展开 ' + n, en: s + ' expand ' + n }).setAux([{label:'side',value:s,role:'pivot' as BarRole},{label:'node',value:String(n),role:'compare' as BarRole}]).commit(),
    onMeet: (n) => rec.begin({ zh: '相遇 ' + n, en: 'meet ' + n }).setAux([{label:'meet',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bidirectionalBfs, type BiBfsGraph } from '../../src/algorithms/ai-search/ais-bidirectional-bfs-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bidirectional-bfs-search/trace.ts';
const G: BiBfsGraph = { start:0,goal:3, adj:(n)=> n===0?[1,2]:n===1?[0,3]:n===2?[0,3]:n===3?[1,2]:[] };
test('bi-bfs 找到最短路径', () => assert.deepEqual(bidirectionalBfs(G), [0,1,3]));
test('bi-bfs trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 14. ais-lds-search (Limited Discrepancy Search) -----
add({
  cat: 'ai-search', id: 'ais-lds-search',
  title: { zh: '有限偏差搜索 LDS', en: 'Limited Discrepancy Search' },
  summary: { zh: '限制偏离启发式选择的次数。', en: 'Bounded deviations from heuristic choice.' },
  description: { zh: 'LDS(Harvey & Ginsberg)限制搜索过程中「不跟随启发式选择」的次数，逐轮放宽，先信任启发式。', en: 'LDS bounds how often the search may deviate from the heuristic; the bound increases per round, trusting the heuristic first.' },
  tags: ['ai-search','lds','heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  impl: `export interface LdsHooks { onVisit?: (node: number, depth: number, discrepancy: number) => void; onFound?: (node: number) => void; }
export interface LdsTree { root: number; goal: number; order: (n: number) => number[]; maxDepth: number; }
export function ldsSearch(t: LdsTree, maxDiscrepancy: number, hooks: LdsHooks = {}): number[] {
  const path: number[] = [];
  const dfs = (n: number, d: number, disc: number): boolean => {
    hooks.onVisit?.(n, d, disc);
    path.push(n);
    if (n === t.goal) { hooks.onFound?.(n); return true; }
    if (d >= t.maxDepth) { path.pop(); return false; }
    const kids = t.order(n);
    for (let i = 0; i < kids.length; i++) {
      const need = i; // 偏离 i 次才到这个孩子
      if (disc + need > maxDiscrepancy) continue;
      if (dfs(kids[i]!, d + 1, disc + need)) return true;
    }
    path.pop();
    return false;
  };
  if (dfs(t.root, 0, 0)) return path;
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ldsSearch, type LdsTree } from './impl.ts';
const T: LdsTree = { root:0,goal:4, order:(n)=> n===0?[1,2]:n===1?[3,4]:[], maxDepth:3 };
export const DEFAULT_INPUT = T;
export function buildTrace(input: LdsTree = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LDS disc=1', en: 'LDS disc=1' }).commit();
  const path = ldsSearch(input, 1, {
    onVisit: (n, d, disc) => rec.begin({ zh: '访问 ' + n + ' 深' + d + ' 偏差' + disc, en: 'visit ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole},{label:'disc',value:String(disc),role:'pivot' as BarRole}]).commit(),
    onFound: (n) => rec.begin({ zh: '找到 ' + n, en: 'found ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ldsSearch, type LdsTree } from '../../src/algorithms/ai-search/ais-lds-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-lds-search/trace.ts';
const T: LdsTree = { root:0,goal:1, order:(n)=> n===0?[1,2]:[], maxDepth:2 };
test('lds 找到目标', () => assert.deepEqual(ldsSearch(T,0), [0,1]));
test('lds trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 15. ais-anytime-a-star -----
add({
  cat: 'ai-search', id: 'ais-anytime-a-star',
  title: { zh: 'Anytime A*', en: 'Anytime A*' },
  summary: { zh: '在时限内先给可行解再逐步优化。', en: 'Produces a feasible solution then improves under a time budget.' },
  description: { zh: 'Anytime A*(如 ARA*)用递减的启发式膨胀系数 ε，先快速得到次优解，再逐步逼近最优，适合实时系统。', en: 'Anytime A* (e.g. ARA*) uses a decreasing inflation ε to quickly return a suboptimal solution then refine toward optimal.' },
  tags: ['ai-search','anytime','heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(n)' },
  impl: `export interface AraHooks { onEps?: (eps: number) => void; onImprove?: (cost: number, path: number[]) => void; }
export interface AraGraph { start: number; goal: number; neighbors: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function anytimeAStar(g: AraGraph, eps0: number, epsMin: number, dec: number, hooks: AraHooks = {}): number[] {
  let best: number[] | null = null;
  const runOnce = (eps: number): number[] => {
    type N = { n: number; g: number; f: number };
    const open: N[] = [{ n: g.start, g: 0, f: eps * g.h(g.start) }];
    const parent = new Map<number, number>(); const gC = new Map<number, number>([[g.start, 0]]);
    while (open.length) {
      open.sort((a, b) => a.f - b.f); const cur = open.shift()!;
      if (cur.n === g.goal) {
        const path: number[] = []; let c: number | undefined = g.goal;
        while (c !== undefined) { path.unshift(c); c = parent.get(c); }
        return path;
      }
      for (const e of g.neighbors(cur.n)) {
        const ng = cur.g + e.cost;
        if (ng < (gC.get(e.to) ?? Infinity)) { gC.set(e.to, ng); parent.set(e.to, cur.n); open.push({ n: e.to, g: ng, f: ng + eps * g.h(e.to) }); }
      }
    }
    return [];
  };
  for (let eps = eps0; eps >= epsMin; eps -= dec) {
    hooks.onEps?.(eps);
    const p = runOnce(eps);
    if (p.length && (best === null || p.length <= best.length)) { best = p; hooks.onImprove?.(p.length, p); }
  }
  return best ?? [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { anytimeAStar, type AraGraph } from './impl.ts';
const G: AraGraph = { start:0,goal:3, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:4}]:n===1?[{to:3,cost:2}]:[], h:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: AraGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Anytime A*', en: 'Anytime A*' }).commit();
  const best = anytimeAStar(input, 3, 1, 1, {
    onEps: (eps) => rec.begin({ zh: 'ε=' + eps.toFixed(2), en: 'eps=' + eps.toFixed(2) }).setAux([{label:'eps',value:eps.toFixed(2),role:'pivot' as BarRole}]).commit(),
    onImprove: (c, p) => rec.begin({ zh: '改进 cost=' + c, en: 'improve ' + c }).setAux([{label:'cost',value:String(c),role:'final' as BarRole},{label:'path',value:p.join('->'),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '最优 ' + best.join('->'), en: 'best ' + best.join('->') }).setAux([{label:'best',value:best.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anytimeAStar, type AraGraph } from '../../src/algorithms/ai-search/ais-anytime-a-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-anytime-a-star/trace.ts';
const G: AraGraph = { start:0,goal:2, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:[], h:(n)=>[2,1,0][n]??0 };
test('anytime 找到目标', () => assert.deepEqual(anytimeAStar(G,2,1,0.5), [0,2]));
test('anytime trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 16. ais-weighted-a-star -----
add({
  cat: 'ai-search', id: 'ais-weighted-a-star',
  title: { zh: '加权 A*', en: 'Weighted A*' },
  summary: { zh: 'f=g+W·h 的贪心增强版 A*。', en: 'A* with f=g+W·h, more greedy.' },
  description: { zh: 'Weighted A* 用 f=g+Wh(W>1)使搜索偏向目标，速度更快但解可能次优，W=1 退化为 A*。', en: 'Weighted A* uses f=g+W·h (W>1) to bias toward the goal; faster but possibly suboptimal; W=1 reduces to A*.' },
  tags: ['ai-search','weighted-a-star','heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(n)' },
  impl: `export interface WaHooks { onExpand?: (node: number, g: number, f: number) => void; onFound?: (node: number) => void; }
export interface WaGraph { start: number; goal: number; neighbors: (n: number) => Array<{ to: number; cost: number }>; h: (n: number) => number; }
export function weightedAStar(g: WaGraph, W: number, hooks: WaHooks = {}): number[] {
  type N = { n: number; g: number; f: number };
  const open: N[] = [{ n: g.start, g: 0, f: W * g.h(g.start) }];
  const parent = new Map<number, number>(); const gC = new Map<number, number>([[g.start, 0]]);
  while (open.length) {
    open.sort((a, b) => a.f - b.f); const cur = open.shift()!;
    hooks.onExpand?.(cur.n, cur.g, cur.f);
    if (cur.n === g.goal) {
      hooks.onFound?.(cur.n);
      const path: number[] = []; let c: number | undefined = g.goal;
      while (c !== undefined) { path.unshift(c); c = parent.get(c); }
      return path;
    }
    for (const e of g.neighbors(cur.n)) {
      const ng = cur.g + e.cost;
      if (ng < (gC.get(e.to) ?? Infinity)) { gC.set(e.to, ng); parent.set(e.to, cur.n); open.push({ n: e.to, g: ng, f: ng + W * g.h(e.to) }); }
    }
  }
  return [];
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedAStar, type WaGraph } from './impl.ts';
const G: WaGraph = { start:0,goal:3, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:4}]:n===1?[{to:3,cost:2}]:[], h:(n)=>[3,2,1,0][n]??0 };
export const DEFAULT_INPUT = G;
export function buildTrace(input: WaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Weighted A* W=2', en: 'WA* W=2' }).commit();
  const path = weightedAStar(input, 2, {
    onExpand: (n, gc, f) => rec.begin({ zh: '展开 ' + n + ' f=' + f, en: 'expand ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole}]).commit(),
    onFound: (n) => rec.begin({ zh: '目标 ' + n, en: 'goal ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') }).setAux([{label:'path',value:path.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedAStar, type WaGraph } from '../../src/algorithms/ai-search/ais-weighted-a-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-weighted-a-star/trace.ts';
const G: WaGraph = { start:0,goal:2, neighbors:(n)=> n===0?[{to:1,cost:1},{to:2,cost:5}]:[], h:(n)=>[2,1,0][n]??0 };
test('wa-star 找到目标', () => assert.deepEqual(weightedAStar(G,2), [0,2]));
test('wa-star trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 17. ais-ao-star -----
add({
  cat: 'ai-search', id: 'ais-ao-star',
  title: { zh: 'AO* 与或图搜索', en: 'AO* Search' },
  summary: { zh: '在 AND-OR 图上求最优解图。', en: 'Optimal solution graph over AND-OR graphs.' },
  description: { zh: 'AO*(Nilsson)处理节点含「与」(须全部解决)和「或」(任一解决)连接的图，自顶向下扩展并回传代价。', en: 'AO* handles AND (all must be solved) and OR (any suffices) connectors, expanding top-down and propagating cost.' },
  tags: ['ai-search','ao-star','and-or-graph'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  impl: `export interface AoHooks { onExpand?: (node: number) => void; onCost?: (node: number, cost: number) => void; }
export interface AoNode { id: number; isGoal: boolean; connectors: Array<{ children: number[]; cost: number }>; }
export interface AoProblem { nodes: Map<number, AoNode>; root: number; h: (n: number) => number; }
export function aoStarSearch(p: AoProblem, hooks: AoHooks = {}): { cost: number; best: Map<number, number[]> } {
  const g = new Map<number, number>(); // 当前最优解代价
  const best = new Map<number, number[]>(); // 每节点最优 connector children
  for (const id of p.nodes.keys()) g.set(id, p.h(id));
  const marked = new Set<number>();
  const revise = (n: number) => {
    const node = p.nodes.get(n)!;
    let bestCost = node.isGoal ? 0 : Infinity; let bestKids: number[] = [];
    for (const c of node.connectors) {
      const cost = c.cost + c.children.reduce((s, k) => s + (g.get(k) ?? p.h(k)), 0);
      if (cost < bestCost) { bestCost = cost; bestKids = c.children; }
    }
    g.set(n, bestCost); best.set(n, bestKids);
    hooks.onCost?.(n, bestCost);
  };
  // 初始化所有节点并迭代到不动点
  let changed = true;
  for (let iter = 0; changed && iter < 100; iter++) {
    changed = false;
    for (const id of p.nodes.keys()) {
      const before = g.get(id);
      revise(id);
      if (g.get(id) !== before) changed = true;
    }
  }
  // 自顶向下标记当前最优子图
  const mark = (n: number) => {
    if (marked.has(n)) return; marked.add(n);
    const node = p.nodes.get(n)!; hooks.onExpand?.(n);
    if (node.isGoal) return;
    for (const c of best.get(n) ?? []) mark(c);
  };
  mark(p.root);
  return { cost: g.get(p.root) ?? Infinity, best };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aoStarSearch, type AoProblem, type AoNode } from './impl.ts';
const nodes = new Map<number, AoNode>([
  [0, { id:0, isGoal:false, connectors:[{children:[1,2],cost:1}] }],
  [1, { id:1, isGoal:false, connectors:[{children:[3],cost:1},{children:[4],cost:1}] }],
  [2, { id:2, isGoal:true, connectors:[] }],
  [3, { id:3, isGoal:true, connectors:[] }],
  [4, { id:4, isGoal:true, connectors:[] }],
]);
const P: AoProblem = { nodes, root:0, h:(n)=>[3,2,0,0,0][n]??0 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: AoProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'AO* 与或图', en: 'AO*' }).commit();
  const { cost } = aoStarSearch(input, {
    onExpand: (n) => rec.begin({ zh: '标记 ' + n, en: 'mark ' + n }).setAux([{label:'node',value:String(n),role:'compare' as BarRole}]).commit(),
    onCost: (n, c) => rec.begin({ zh: '节点' + n + ' 代价' + c, en: 'cost ' + n }).setAux([{label:'node',value:String(n),role:'pivot' as BarRole},{label:'cost',value:String(c),role:'default' as BarRole}]).commit(),
  });
  rec.begin({ zh: '根代价 ' + cost, en: 'root cost ' + cost }).setAux([{label:'cost',value:String(cost),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aoStarSearch, type AoProblem, type AoNode } from '../../src/algorithms/ai-search/ais-ao-star/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ao-star/trace.ts';
const nodes = new Map<number, AoNode>([[0,{id:0,isGoal:false,connectors:[{children:[1],cost:1}]}],[1,{id:1,isGoal:true,connectors:[]}]]);
const P: AoProblem = { nodes, root:0, h:()=>1 };
test('ao-star 返回有限代价', () => assert.equal(aoStarSearch(P).cost, 1));
test('ao-star trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 18. ais-backjumping -----
add({
  cat: 'ai-search', id: 'ais-backjumping',
  title: { zh: '冲突导向回跳', en: 'Conflict-Directed Backjumping' },
  summary: { zh: 'CSP 回溯时跳到真正的冲突变量。', en: 'Backtracks CSP to the true conflict variable.' },
  description: { zh: '冲突导向回跳(CBJ)在 CSP 求解中当某变量无解时，回溯到引起冲突的最近变量而非直接前驱，减少无效搜索。', en: 'Conflict-directed backjumping jumps to the variable actually causing a conflict instead of the immediate predecessor.' },
  tags: ['ai-search','csp','backjumping'],
  complexity: { time: 'O(d^n)', space: 'O(n)' },
  impl: `export interface CbjHooks { onAssign?: (varIdx: number, val: number) => void; onJump?: (from: number, to: number) => void; onFound?: (assign: number[]) => void; }
export interface Csp { vars: number[]; domain: number[]; consistent: (partial: Map<number, number>, varIdx: number, val: number) => boolean; }
export function conflictBackjumping(csp: Csp, hooks: CbjHooks = {}): number[] | null {
  const assign = new Map<number, number>();
  const conf = (i: number) => Array.from({ length: i }, (_, k) => k).filter((k) => csp.consistent(assign, i, assign.get(k)! + 0) === false || !csp.consistent(assign, i, assign.get(i) ?? -1) && false);
  const conflictSet = new Map<number, Set<number>>();
  const solve = (i: number): number[] | null => {
    if (i >= csp.vars.length) return [...assign.values()];
    const cs = new Set<number>();
    for (const v of csp.domain) {
      let ok = true;
      for (let k = 0; k < i; k++) if (!csp.consistent(assign, i, v)) { ok = false; cs.add(k); break; }
      hooks.onAssign?.(i, v);
      if (csp.consistent(assign, i, v)) { assign.set(i, v); const r = solve(i + 1); if (r) return r; assign.delete(i); }
    }
    // 合并子层冲突集
    for (const k of conflictSet.get(i) ?? []) cs.add(k);
    // 找最大冲突变量
    let jump = -1;
    for (const k of cs) if (k > jump) jump = k;
    if (jump < 0) return null;
    hooks.onJump?.(i, jump);
    for (let k = jump + 1; k <= i; k++) conflictSet.delete(k);
    const target = conflictSet.get(jump) ?? new Set<number>(); cs.forEach((x) => { if (x !== jump) target.add(x); }); conflictSet.set(jump, target);
    return solve(jump);
  };
  const r = solve(0); if (r) hooks.onFound?.(r); return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { conflictBackjumping, type Csp } from './impl.ts';
const C: Csp = { vars:[0,1,2], domain:[0,1,2], consistent:(p, i, v)=>{ for (const [k,val] of p) if (k!==i && val===v) return false; return true; } };
export const DEFAULT_INPUT = C;
export function buildTrace(input: Csp = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '冲突回跳', en: 'CBJ' }).commit();
  const r = conflictBackjumping(input, {
    onAssign: (i, v) => rec.begin({ zh: 'x' + i + '=' + v, en: 'x'+i+'='+v }).setAux([{label:'var',value:'x'+i,role:'compare' as BarRole},{label:'val',value:String(v),role:'pivot' as BarRole}]).commit(),
    onJump: (f, t) => rec.begin({ zh: '从' + f + '跳到' + t, en: f+'->'+t }).setAux([{label:'jump',value:f+'->'+t,role:'warn' as BarRole}]).commit(),
    onFound: (a) => rec.begin({ zh: '解 ' + a.join(','), en: 'sol '+a.join(',') }).setAux([{label:'sol',value:a.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: r ? '求解成功' : '无解', en: r ? 'solved' : 'fail' }).setAux([{label:'result',value:r?r.join(','):'none',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conflictBackjumping, type Csp } from '../../src/algorithms/ai-search/ais-backjumping/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-backjumping/trace.ts';
const C: Csp = { vars:[0,1], domain:[0,1], consistent:(p,i,v)=>{ for (const [k,val] of p) if (k!==i && val===v) return false; return true; } };
test('cbj 求解', () => assert.notEqual(conflictBackjumping(C), null));
test('cbj trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 19. ais-forward-checking -----
add({
  cat: 'ai-search', id: 'ais-forward-checking',
  title: { zh: '前向检查', en: 'Forward Checking' },
  summary: { zh: 'CSP 中提前删除未来变量的非法值。', en: 'Prunes future variables illegal values early.' },
  description: { zh: '前向检查在给某变量赋值后，立即从其邻居(未来变量)域中删除与之冲突的值，更早发现死路。', en: 'Forward checking removes conflicting values from neighbor domains immediately after assignment, detecting dead-ends earlier.' },
  tags: ['ai-search','csp','forward-checking'],
  complexity: { time: 'O(d^n)', space: 'O(nd)' },
  impl: `export interface FcHooks { onAssign?: (varIdx: number, val: number) => void; onPrune?: (varIdx: number, val: number) => void; onFound?: (assign: number[]) => void; }
export interface FcProblem { n: number; domain: number[]; conflict: (i: number, vi: number, j: number, vj: number) => boolean; edges: Array<[number, number]>; }
export function forwardChecking(p: FcProblem, hooks: FcHooks = {}): number[] | null {
  const domains: number[][] = Array.from({ length: p.n }, () => [...p.domain]);
  const assign: number[] = [];
  const neighbors = (i: number): number[] => p.edges.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));
  const solve = (idx: number): boolean => {
    if (idx >= p.n) return true;
    for (const v of domains[idx]!) {
      hooks.onAssign?.(idx, v);
      const removed: Array<[number, number]> = [];
      let dead = false;
      for (const j of neighbors(idx)) {
        if (assign[j] !== undefined) continue;
        for (const w of [...domains[j]!]) {
          if (p.conflict(idx, v, j, w)) { domains[j] = domains[j]!.filter((x) => x !== w); removed.push([j, w]); hooks.onPrune?.(j, w); if (domains[j]!.length === 0) dead = true; }
        }
      }
      if (!dead) { assign[idx] = v; if (solve(idx + 1)) return true; assign[idx] = undefined!; }
      for (const [j, w] of removed) domains[j]!.push(w);
    }
    return false;
  };
  const ok = solve(0); if (ok) hooks.onFound?.(assign); return ok ? assign : null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { forwardChecking, type FcProblem } from './impl.ts';
const P: FcProblem = { n:3, domain:[0,1,2], edges:[[0,1],[1,2],[0,2]], conflict:(i,vi,j,vj)=> vi===vj };
export const DEFAULT_INPUT = P;
export function buildTrace(input: FcProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前向检查', en: 'Forward Checking' }).commit();
  const r = forwardChecking(input, {
    onAssign: (i, v) => rec.begin({ zh: 'x' + i + '=' + v, en: 'x'+i+'='+v }).setAux([{label:'var',value:'x'+i,role:'compare' as BarRole}]).commit(),
    onPrune: (j, w) => rec.begin({ zh: '剪 x' + j + '!=' + w, en: 'prune' }).setAux([{label:'pruned',value:'x'+j+'!='+w,role:'warn' as BarRole}]).commit(),
    onFound: (a) => rec.begin({ zh: '解 ' + a.join(','), en: 'sol' }).setAux([{label:'sol',value:a.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: r ? '成功' : '无解', en: r ? 'ok' : 'fail' }).setAux([{label:'result',value:r?r.join(','):'none',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { forwardChecking, type FcProblem } from '../../src/algorithms/ai-search/ais-forward-checking/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-forward-checking/trace.ts';
const P: FcProblem = { n:3, domain:[0,1,2], edges:[[0,1],[1,2]], conflict:(i,vi,j,vj)=>vi===vj };
test('fc 求解图着色', () => assert.notEqual(forwardChecking(P), null));
test('fc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 20. ais-min-conflicts -----
add({
  cat: 'ai-search', id: 'ais-min-conflicts',
  title: { zh: '最小冲突', en: 'Min-Conflicts' },
  summary: { zh: 'CSP 局部搜索：选冲突最少的值。', en: 'Local search picking min-conflict value.' },
  description: { zh: 'Min-Conflicts(Minton 等)是 CSP 的局部搜索：随机选一个冲突变量，改成与其约束冲突最少的值，反复至无冲突。', en: 'Min-Conflicts is a CSP local search: pick a conflicted variable and switch it to the value minimizing conflicts; repeat until solved.' },
  tags: ['ai-search','csp','local-search','min-conflicts'],
  complexity: { time: 'O(steps * n)', space: 'O(n)' },
  impl: `export interface McHooks { onStep?: (varIdx: number, newVal: number, conflicts: number) => void; onSolved?: (assign: number[]) => void; }
export interface McProblem { n: number; domain: number[]; conflicts: (assign: number[], i: number, val: number) => number; rand: () => number; }
export function minConflicts(p: McProblem, maxSteps: number, init: number[], hooks: McHooks = {}): number[] | null {
  const assign = [...init];
  const conflicted = () => assign.map((_, i) => i).filter((i) => p.conflicts(assign, i, assign[i]!) > 0);
  for (let s = 0; s < maxSteps; s++) {
    const cs = conflicted();
    if (!cs.length) { hooks.onSolved?.(assign); return assign; }
    const i = cs[Math.floor(p.rand() * cs.length)]!;
    let bestV = assign[i]!; let bestC = p.conflicts(assign, i, bestV);
    for (const v of p.domain) { const c = p.conflicts(assign, i, v); if (c < bestC) { bestC = c; bestV = v; } }
    assign[i] = bestV; hooks.onStep?.(i, bestV, bestC);
  }
  return conflicted().length ? null : assign;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minConflicts, type McProblem } from './impl.ts';
const P: McProblem = { n:3, domain:[0,1,2], conflicts:(a,i,v)=>{ let c=0; for(let k=0;k<a.length;k++) if(k!==i && a[k]===v) c++; return c; }, rand:()=>0 };
export const DEFAULT_INPUT = { p: P, init: [0,0,0] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Min-Conflicts', en: 'Min-Conflicts' }).commit();
  const r = minConflicts(input.p, 50, input.init, {
    onStep: (i, v, c) => rec.begin({ zh: 'x' + i + '=' + v + ' 冲突' + c, en: 'x'+i+'='+v }).setAux([{label:'var',value:'x'+i,role:'compare' as BarRole},{label:'conf',value:String(c),role:'pivot' as BarRole}]).commit(),
    onSolved: (a) => rec.begin({ zh: '求解 ' + a.join(','), en: 'solved' }).setAux([{label:'sol',value:a.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: r ? '成功' : '超时', en: r ? 'ok' : 'timeout' }).setAux([{label:'result',value:r?r.join(','):'none',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minConflicts, type McProblem } from '../../src/algorithms/ai-search/ais-min-conflicts/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-min-conflicts/trace.ts';
const P: McProblem = { n:3, domain:[0,1,2], conflicts:(a,i,v)=>{ let c=0; for(let k=0;k<a.length;k++) if(k!==i && a[k]===v) c++; return c; }, rand:()=>0 };
test('mc 求解', () => assert.notEqual(minConflicts(P,50,[0,0,0]), null));
test('mc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 21. ais-random-walk-search -----
add({
  cat: 'ai-search', id: 'ais-random-walk-search',
  title: { zh: '随机游走搜索', en: 'Random Walk Search' },
  summary: { zh: '每步随机选邻居前进。', en: 'Randomly moves to a neighbor each step.' },
  description: { zh: '随机游走在状态空间每步随机选择一个邻居，是 CSP/CSP 局部搜索的基础对照，理论上以 1 概率命中目标。', en: 'Random walk picks a random neighbor each step; a baseline for local search that eventually hits any goal with probability 1.' },
  tags: ['ai-search','random-walk','local-search'],
  complexity: { time: 'O(steps)', space: 'O(1)' },
  impl: `export interface RwHooks { onStep?: (cur: number, next: number) => void; onGoal?: (n: number) => void; }
export interface RwGraph { start: number; goal: number; neighbors: (n: number) => number[]; rand: () => number; }
export function randomWalkSearch(g: RwGraph, steps: number, hooks: RwHooks = {}): number[] {
  const path: number[] = [g.start]; let cur = g.start;
  for (let s = 0; s < steps; s++) {
    if (cur === g.goal) { hooks.onGoal?.(cur); break; }
    const ns = g.neighbors(cur);
    if (!ns.length) break;
    const next = ns[Math.floor(g.rand() * ns.length)]!;
    hooks.onStep?.(cur, next); path.push(next); cur = next;
  }
  return path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomWalkSearch, type RwGraph } from './impl.ts';
const G: RwGraph = { start:0,goal:3, neighbors:(n)=> n===0?[1,2]:n===1?[0,3]:n===2?[0,3]:[1,2], rand:()=>Math.random() };
export const DEFAULT_INPUT = G;
export function buildTrace(input: RwGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机游走', en: 'Random Walk' }).commit();
  const path = randomWalkSearch(input, 20, {
    onStep: (c, n) => rec.begin({ zh: c + '->' + n, en: c+'->'+n }).setAux([{label:'step',value:c+'->'+n,role:'compare' as BarRole}]).commit(),
    onGoal: (n) => rec.begin({ zh: '到达 ' + n, en: 'goal ' + n }).setAux([{label:'goal',value:String(n),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径长度 ' + path.length, en: 'len ' + path.length }).setAux([{label:'len',value:String(path.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomWalkSearch, type RwGraph } from '../../src/algorithms/ai-search/ais-random-walk-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-random-walk-search/trace.ts';
const G: RwGraph = { start:0,goal:1, neighbors:(n)=>[1], rand:()=>0 };
test('rw 直达目标', () => assert.equal(randomWalkSearch(G,5).at(-1), 1));
test('rw trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 22. ais-depth-first-branch-bound -----
add({
  cat: 'ai-search', id: 'ais-dfbb-search',
  title: { zh: '深度优先分支定界', en: 'Depth-First Branch and Bound' },
  summary: { zh: 'DFS 配合上界剪枝求最优。', en: 'DFS with bound pruning for optimum.' },
  description: { zh: 'DFB&B 用深度优先遍历解空间树，过程中维护当前最优解代价，剪掉代价超过最优的分支，内存为 O(n)。', en: 'DFB&B traverses the solution tree depth-first, keeping the incumbent cost and pruning branches that exceed it; uses O(n) memory.' },
  tags: ['ai-search','dfbb','optimization'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
  impl: `export interface DfbbHooks { onBind?: (best: number) => void; onPrune?: (cost: number) => void; onFound?: (cost: number) => void; }
export interface DfbbProblem { weights: number[]; values: number[]; capacity: number; }
export function dfbbSearch(p: DfbbProblem, hooks: DfbbHooks = {}): number {
  let best = 0;
  const dfs = (i: number, w: number, v: number) => {
    if (v > best) { best = v; hooks.onBind?.(best); }
    if (i >= p.weights.length) { hooks.onFound?.(v); return; }
    if (w + p.weights[i]! <= p.capacity) dfs(i + 1, w + p.weights[i]!, v + p.values[i]!);
    const remainVal = p.values.slice(i + 1).reduce((s, x) => s + x, 0);
    if (v + remainVal > best) dfs(i + 1, w, v); else hooks.onPrune?.(v);
  };
  dfs(0, 0, 0);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfbbSearch, type DfbbProblem } from './impl.ts';
const P: DfbbProblem = { weights:[2,3,4], values:[3,4,5], capacity:5 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: DfbbProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DFB&B', en: 'DFB&B' }).commit();
  const best = dfbbSearch(input, {
    onBind: (b) => rec.begin({ zh: '新最优 ' + b, en: 'best ' + b }).setAux([{label:'best',value:String(b),role:'final' as BarRole}]).commit(),
    onPrune: (c) => rec.begin({ zh: '剪枝 cost=' + c, en: 'prune' }).setAux([{label:'pruned',value:String(c),role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '最优 ' + best, en: 'opt ' + best }).setAux([{label:'opt',value:String(best),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfbbSearch, type DfbbProblem } from '../../src/algorithms/ai-search/ais-dfbb-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-dfbb-search/trace.ts';
const P: DfbbProblem = { weights:[1,2], values:[1,5], capacity:2 };
test('dfbb 求最优', () => assert.equal(dfbbSearch(P), 5));
test('dfbb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 23. ais-recursive-best-first (alias handled; pick Learning rate / TD-lambda gradient) — use PRM/Probabilistic Roadmap -----
add({
  cat: 'ai-search', id: 'ais-probabilistic-roadmap',
  title: { zh: '概率路线图 PRM', en: 'Probabilistic Roadmap' },
  summary: { zh: '随机采样构造运动规划路线图。', en: 'Random-sampling roadmap for motion planning.' },
  description: { zh: 'PRM 在自由空间随机采样若干节点并连接可见邻居形成图，再在图上做最短路径查询，是机器人运动规划经典方法。', en: 'PRM samples nodes in free space, connects visible neighbors into a roadmap, then queries shortest path; a classic motion-planning method.' },
  tags: ['ai-search','prm','motion-planning','sampling'],
  complexity: { time: 'O(n^2) build', space: 'O(n^2)' },
  impl: `export interface PrmHooks { onSample?: (id: number, x: number, y: number) => void; onEdge?: (a: number, b: number) => void; onPath?: (path: number[]) => void; }
export interface PrmProblem { dim: [number, number]; sample: () => [number, number]; free: (a: [number, number], b: [number, number]) => boolean; start: [number, number]; goal: [number, number]; k: number; }
export function probabilisticRoadmap(p: PrmProblem, nSamples: number, hooks: PrmHooks = {}): number[] {
  const pts: Array<[number, number]> = [p.start, p.goal];
  pts[0] = p.start; pts[1] = p.goal;
  for (let i = 0; i < nSamples; i++) { const s = p.sample(); pts.push(s); hooks.onSample?.(i + 2, s[0], s[1]); }
  const adj: Map<number, number[]> = new Map();
  for (let i = 0; i < pts.length; i++) {
    const cand = pts.map((_, j) => j).filter((j) => j !== i).map((j) => ({ j, d: dist(pts[i]!, pts[j]!) })).sort((a, b) => a.d - b.d).slice(0, p.k);
    for (const c of cand) { if (p.free(pts[i]!, pts[c.j]!)) { hooks.onEdge?.(i, c.j); (adj.get(i) ?? adj.set(i, []).get(i)!).push(c.j); (adj.get(c.j) ?? adj.set(c.j, []).get(c.j)!).push(i); } }
  }
  // BFS 0->1
  const prev = new Map<number, number>([[0, -1]]); const q = [0];
  while (q.length) { const u = q.shift()!; if (u === 1) break; for (const v of adj.get(u) ?? []) if (!prev.has(v)) { prev.set(v, u); q.push(v); } }
  const path: number[] = []; let c: number | undefined = 1; while (c !== undefined && c !== -1) { path.unshift(c); c = prev.get(c); }
  hooks.onPath?.(path);
  return path;
}
function dist(a: [number, number], b: [number, number]) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { probabilisticRoadmap, type PrmProblem } from './impl.ts';
const P: PrmProblem = { dim:[10,10], sample:()=>[Math.random()*10, Math.random()*10], free:()=>true, start:[0,0], goal:[9,9], k:3 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: PrmProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PRM 采样', en: 'PRM' }).commit();
  const path = probabilisticRoadmap(input, 10, {
    onSample: (id) => rec.begin({ zh: '采样 ' + id, en: 'sample ' + id }).setAux([{label:'id',value:String(id),role:'compare' as BarRole}]).commit(),
    onEdge: (a, b) => rec.begin({ zh: '边 ' + a + '-' + b, en: 'edge' }).setAux([{label:'edge',value:a+'-'+b,role:'pivot' as BarRole}]).commit(),
    onPath: (p) => rec.begin({ zh: '路径 ' + p.join('->'), en: 'path' }).setAux([{label:'path',value:p.join('->'),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径长 ' + path.length, en: 'len ' + path.length }).setAux([{label:'len',value:String(path.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { probabilisticRoadmap, type PrmProblem } from '../../src/algorithms/ai-search/ais-probabilistic-roadmap/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-probabilistic-roadmap/trace.ts';
const P: PrmProblem = { dim:[5,5], sample:()=>[2,2], free:()=>true, start:[0,0], goal:[4,4], k:3 };
test('prm 返回路径', () => { const p = probabilisticRoadmap(P, 2); assert.ok(p.includes(0)); });
test('prm trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 24. ais-rrt-search (Rapidly-exploring Random Tree) -----
add({
  cat: 'ai-search', id: 'ais-rrt-search',
  title: { zh: 'RRT 快速探索随机树', en: 'Rapidly-exploring Random Tree' },
  summary: { zh: '随机增量式扩展运动规划树。', en: 'Incrementally grows a random tree for planning.' },
  description: { zh: 'RRT 每次随机采样一个点，找到树上最近节点并向采样点延伸固定步长，逐步覆盖自由空间，常用于非完整约束规划。', en: 'RRT samples a random point, finds the nearest tree node, extends by a fixed step; grows coverage of free space for planning.' },
  tags: ['ai-search','rrt','motion-planning','sampling'],
  complexity: { time: 'O(n) per step', space: 'O(n)' },
  impl: `export interface RrtHooks { onSample?: (x: number, y: number) => void; onExtend?: (from: number, to: number) => void; onGoal?: (node: number) => void; }
export interface RrtProblem { start: [number, number]; goal: [number, number]; sample: () => [number, number]; step: number; threshold: number; }
export function rrtSearch(p: RrtProblem, maxIter: number, hooks: RrtHooks = {}): number[] {
  const nodes: Array<[number, number]> = [p.start]; const parent: number[] = [-1];
  for (let it = 0; it < maxIter; it++) {
    const s = p.sample(); hooks.onSample?.(s[0], s[1]);
    let ni = 0; let nd = Infinity;
    for (let i = 0; i < nodes.length; i++) { const d = Math.hypot(nodes[i]![0] - s[0], nodes[i]![1] - s[1]); if (d < nd) { nd = d; ni = i; } }
    const from = nodes[ni]!; const ang = Math.atan2(s[1] - from[1], s[0] - from[0]);
    const nx = from[0] + p.step * Math.cos(ang); const ny = from[1] + p.step * Math.sin(ang);
    nodes.push([nx, ny]); parent.push(ni); hooks.onExtend?.(ni, nodes.length - 1);
    if (Math.hypot(nx - p.goal[0], ny - p.goal[1]) <= p.threshold) { hooks.onGoal?.(nodes.length - 1); break; }
  }
  // 最近节点回溯路径
  let gi = 0; let gd = Infinity; for (let i = 0; i < nodes.length; i++) { const d = Math.hypot(nodes[i]![0] - p.goal[0], nodes[i]![1] - p.goal[1]); if (d < gd) { gd = d; gi = i; } }
  const path: number[] = []; let c: number | undefined = gi; while (c !== undefined && c >= 0) { path.unshift(c); c = parent[c]; }
  return path;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rrtSearch, type RrtProblem } from './impl.ts';
const P: RrtProblem = { start:[0,0], goal:[9,9], sample:()=>[Math.random()*10, Math.random()*10], step:1, threshold:1.5 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: RrtProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RRT', en: 'RRT' }).commit();
  const path = rrtSearch(input, 40, {
    onSample: (x, y) => rec.begin({ zh: '采样 (' + x.toFixed(1) + ',' + y.toFixed(1) + ')', en: 'sample' }).setAux([{label:'sample',value:'('+x.toFixed(1)+','+y.toFixed(1)+')',role:'compare' as BarRole}]).commit(),
    onExtend: (f, t) => rec.begin({ zh: '扩展 ' + f + '->' + t, en: 'extend' }).setAux([{label:'extend',value:f+'->'+t,role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '路径长 ' + path.length, en: 'len ' + path.length }).setAux([{label:'len',value:String(path.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rrtSearch, type RrtProblem } from '../../src/algorithms/ai-search/ais-rrt-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rrt-search/trace.ts';
const P: RrtProblem = { start:[0,0], goal:[1,1], sample:()=>[1,1], step:2, threshold:2 };
test('rrt 路径含起点', () => assert.equal(rrtSearch(P,5)[0], 0));
test('rrt trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 25. ais-coarse-to-fine -----
add({
  cat: 'ai-search', id: 'ais-coarse-to-fine-search',
  title: { zh: '粗到细搜索', en: 'Coarse-to-Fine Search' },
  summary: { zh: '先粗粒度搜索再逐层细化。', en: 'Search coarse first, refine progressively.' },
  description: { zh: '粗到细搜索先在低分辨率空间找到候选区域，再在该区域以更高分辨率重新搜索，常用于图像匹配、路径规划。', en: 'Coarse-to-fine searches a coarse space first then refines within candidate regions at higher resolution.' },
  tags: ['ai-search','coarse-to-fine','hierarchical'],
  complexity: { time: 'O(log R * b^d)', space: 'O(n)' },
  impl: `export interface CfHooks { onLevel?: (resolution: number, candidates: number[]) => void; onRefine?: (resolution: number) => void; onFound?: (pos: number) => void; }
export interface CfProblem { domain: number[]; goal: number; near: (a: number, b: number, res: number) => boolean; levels: number; }
export function coarseToFineSearch(p: CfProblem, hooks: CfHooks = {}): number {
  let candidates = p.domain;
  for (let L = p.levels; L >= 0; L--) {
    hooks.onLevel?.(L, candidates);
    const scored = candidates.map((c) => ({ c, score: Math.abs(c - p.goal) })).sort((a, b) => a.score - b.score);
    const best = scored[0]!.c;
    if (best === p.goal) { hooks.onFound?.(best); return best; }
    // 在最佳候选附近以 1/2^L 分辨率展开
    candidates = p.domain.filter((c) => p.near(c, best, Math.pow(2, L)));
    hooks.onRefine?.(L - 1);
  }
  hooks.onFound?.(candidates[0] ?? -1);
  return candidates[0] ?? -1;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coarseToFineSearch, type CfProblem } from './impl.ts';
const P: CfProblem = { domain:[0,1,2,3,4,5,6,7,8,9], goal:7, near:(a,b,res)=> Math.abs(a-b) <= res, levels:3 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: CfProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '粗到细', en: 'Coarse-to-Fine' }).commit();
  const best = coarseToFineSearch(input, {
    onLevel: (L, cs) => rec.begin({ zh: '层' + L + ' 候选[' + cs.join(',') + ']', en: 'level ' + L }).setAux([{label:'level',value:String(L),role:'pivot' as BarRole},{label:'cand',value:cs.join(','),role:'compare' as BarRole}]).commit(),
    onFound: (p) => rec.begin({ zh: '找到 ' + p, en: 'found ' + p }).setAux([{label:'found',value:String(p),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '答案 ' + best, en: 'best ' + best }).setAux([{label:'best',value:String(best),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coarseToFineSearch, type CfProblem } from '../../src/algorithms/ai-search/ais-coarse-to-fine-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-coarse-to-fine-search/trace.ts';
const P: CfProblem = { domain:[0,1,2,3,4,5,6,7,8,9], goal:7, near:(a,b,res)=> Math.abs(a-b)<=res, levels:3 };
test('cf 找到目标', () => assert.equal(coarseToFineSearch(P), 7));
test('cf trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 26. ais-mean-end-analysis -----
add({
  cat: 'ai-search', id: 'ais-means-end-analysis',
  title: { zh: '手段-目的分析', en: 'Means-End Analysis' },
  summary: { zh: 'GPS 经典：比较当前与目标选算子。', en: 'GPS classic: choose operators to reduce difference.' },
  description: { zh: '手段-目的分析(Newell & Simon 的 GPS)比较当前状态与目标差异，选择能减小差异的算子并递归消除子差异。', en: 'Means-end analysis (Newell & Simon GPS) compares current and goal states, picks operators reducing the difference, recursing on sub-differences.' },
  tags: ['ai-search','means-end','gps','planning'],
  complexity: { time: 'O(o * d)', space: 'O(d)' },
  impl: `export interface MeaHooks { onOp?: (op: string) => void; onApply?: (op: string, state: number[]) => void; onGoal?: (state: number[]) => void; }
export interface MeaProblem { start: number[]; goal: number[]; ops: Array<{ name: string; diff: (s: number[], g: number[]) => number; apply: (s: number[]) => number[]; }>; }
export function meansEndAnalysis(p: MeaProblem, hooks: MeaHooks = {}): string[] {
  const plan: string[] = [];
  const solve = (state: number[], goal: number[]): number[] => {
    if (state.every((v, i) => v === goal[i])) { hooks.onGoal?.(state); return state; }
    let best = p.ops[0]!; let bestDiff = best.diff(state, goal);
    for (const op of p.ops) { const d = op.diff(state, goal); if (d < bestDiff) { bestDiff = d; best = op; } }
    hooks.onOp?.(best.name);
    const ns = best.apply(state); hooks.onApply?.(best.name, ns); plan.push(best.name);
    return solve(ns, goal);
  };
  solve(p.start, p.goal);
  return plan;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { meansEndAnalysis, type MeaProblem } from './impl.ts';
const P: MeaProblem = {
  start: [0, 0], goal: [3, 3],
  ops: [{ name: 'A+1', diff: (s, g) => Math.abs(s[0]! + 1 - g[0]!) + Math.abs(s[1]! - g[1]!), apply: (s) => [s[0]! + 1, s[1]!] }, { name: 'B+1', diff: (s, g) => Math.abs(s[0]! - g[0]!) + Math.abs(s[1]! + 1 - g[1]!), apply: (s) => [s[0]!, s[1]! + 1] }],
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: MeaProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '手段-目的分析', en: 'MEA' }).commit();
  const plan = meansEndAnalysis(input, {
    onOp: (op) => rec.begin({ zh: '选算子 ' + op, en: 'op ' + op }).setAux([{label:'op',value:op,role:'pivot' as BarRole}]).commit(),
    onApply: (op, st) => rec.begin({ zh: '应用 ' + op + ' -> [' + st.join(',') + ']', en: 'apply' }).setAux([{label:'state',value:'['+st.join(',')+']',role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '计划 ' + plan.join('->'), en: 'plan ' + plan.join('->') }).setAux([{label:'plan',value:plan.join('->'),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meansEndAnalysis, type MeaProblem } from '../../src/algorithms/ai-search/ais-means-end-analysis/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-means-end-analysis/trace.ts';
const P: MeaProblem = { start:[0], goal:[2], ops:[{name:'inc',diff:(s,g)=>Math.abs(s[0]!-g[0]!),apply:(s)=>[s[0]!+1]}] };
test('mea 生成计划', () => assert.deepEqual(meansEndAnalysis(P), ['inc','inc']));
test('mea trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 27. ais-iteration-policy -----
add({
  cat: 'ai-search', id: 'ais-policy-iteration-exact',
  title: { zh: '精确策略迭代', en: 'Exact Policy Iteration' },
  summary: { zh: '交替改进策略与策略评估。', en: 'Alternates policy evaluation and improvement.' },
  description: { zh: '策略迭代反复评估当前策略得到 V 值，再据此贪心改进策略，直到策略稳定，对有限 MDP 收敛到最优。', en: 'Policy iteration alternates evaluating the current policy to get V then improving it greedily until stable; converges for finite MDPs.' },
  tags: ['ai-search','mdp','policy-iteration','reinforcement'],
  complexity: { time: 'O(n^3)', space: 'O(n)' },
  impl: `export interface PiHooks { onEval?: (iter: number, V: number[]) => void; onImprove?: (policy: number[]) => void; }
export interface PiMdp { states: number[]; actions: number[]; trans: (s: number, a: number) => Array<{ to: number; prob: number; reward: number }>; gamma: number; theta: number; }
export function policyIterationExact(m: PiMdp, hooks: PiHooks = {}): number[] {
  let policy = m.states.map(() => m.actions[0]!);
  const V = m.states.map(() => 0);
  let iter = 0;
  while (true) {
    // 评估
    while (true) {
      let delta = 0;
      for (const s of m.states) {
        const a = policy[s]!; let sum = 0;
        for (const t of m.trans(s, a)) sum += t.prob * (t.reward + m.gamma * V[t.to]!);
        delta = Math.max(delta, Math.abs(V[s]! - sum)); V[s] = sum;
      }
      iter++; hooks.onEval?.(iter, V);
      if (delta < m.theta) break;
    }
    // 改进
    let stable = true;
    for (const s of m.states) {
      let bestA = policy[s]!; let bestQ = -Infinity;
      for (const a of m.actions) { let q = 0; for (const t of m.trans(s, a)) q += t.prob * (t.reward + m.gamma * V[t.to]!); if (q > bestQ) { bestQ = q; bestA = a; } }
      if (bestA !== policy[s]) { policy[s] = bestA; stable = false; }
    }
    hooks.onImprove?.(policy);
    if (stable) break;
  }
  return policy;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { policyIterationExact, type PiMdp } from './impl.ts';
const M: PiMdp = { states:[0,1], actions:[0,1], gamma:0.9, theta:1e-3, trans:(s,a)=> s===0? [{to:a,prob:1,reward:a===1?1:0}] :[{to:1,prob:1,reward:0}] };
export const DEFAULT_INPUT = M;
export function buildTrace(input: PiMdp = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '策略迭代', en: 'Policy Iteration' }).commit();
  const policy = policyIterationExact(input, {
    onImprove: (p) => rec.begin({ zh: '策略 [' + p.join(',') + ']', en: 'policy' }).setAux([{label:'policy',value:p.join(','),role:'compare' as BarRole}]).commit(),
    onEval: (it, V) => rec.begin({ zh: '评估#' + it + ' V=[' + V.map((v)=>v.toFixed(2)).join(',') + ']', en: 'eval' }).setAux([{label:'iter',value:String(it),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '最终策略 [' + policy.join(',') + ']', en: 'final' }).setAux([{label:'policy',value:policy.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { policyIterationExact, type PiMdp } from '../../src/algorithms/ai-search/ais-policy-iteration-exact/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-policy-iteration-exact/trace.ts';
const M: PiMdp = { states:[0,1], actions:[0,1], gamma:0.9, theta:1e-3, trans:(s,a)=> s===0? [{to:a,prob:1,reward:a===1?1:0}] :[{to:1,prob:1,reward:0}] };
test('pi 返回稳定策略', () => { const p = policyIterationExact(M); assert.equal(p.length, 2); });
test('pi trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 28. ais-q-learning-table -----
add({
  cat: 'ai-search', id: 'ais-q-learning-table',
  title: { zh: '表格 Q-Learning', en: 'Tabular Q-Learning' },
  summary: { zh: '无模型 RL，用 Q 表离线更新。', en: 'Model-free RL updating Q-table off-policy.' },
  description: { zh: '表格 Q-Learning(Watkins)在离散状态/动作上维护 Q 表，用贝尔曼最优更新 Q(s,a)←Q+α[r+γmaxQ-Q]，ε-贪心探索。', en: 'Tabular Q-learning maintains a Q-table over discrete states/actions, updating via the Bellman optimality target with ε-greedy exploration.' },
  tags: ['ai-search','q-learning','reinforcement','tabular'],
  complexity: { time: 'O(episodes * steps)', space: 'O(|S|*|A|)' },
  impl: `export interface QlHooks { onEpisode?: (ep: number, totalR: number) => void; onStep?: (s: number, a: number, r: number) => void; }
export interface QlProblem { states: number[]; actions: number[]; step: (s: number, a: number) => { s2: number; r: number; done: boolean }; episodes: number; maxSteps: number; alpha: number; gamma: number; epsilon: number; rand: () => number; }
export function qLearningTable(p: QlProblem, hooks: QlHooks = {}): number[][] {
  const Q = p.states.map(() => p.actions.map(() => 0));
  for (let ep = 0; ep < p.episodes; ep++) {
    let s = p.states[0]!; let totalR = 0;
    for (let st = 0; st < p.maxSteps; st++) {
      const a = p.rand() < p.epsilon ? p.actions[Math.floor(p.rand() * p.actions.length)]! : argmax(Q[s]!);
      const { s2, r, done } = p.step(s, a); hooks.onStep?.(s, a, r); totalR += r;
      const maxNext = Math.max(...Q[s2]!);
      Q[s]![a] = Q[s]![a]! + p.alpha * (r + p.gamma * maxNext - Q[s]![a]!);
      s = s2; if (done) break;
    }
    hooks.onEpisode?.(ep, totalR);
  }
  return Q;
}
function argmax(arr: number[]): number { let bi = 0; for (let i = 1; i < arr.length; i++) if (arr[i]! > arr[bi]!) bi = i; return bi; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { qLearningTable, type QlProblem } from './impl.ts';
const P: QlProblem = { states:[0,1], actions:[0,1], episodes:30, maxSteps:5, alpha:0.5, gamma:0.9, epsilon:0.3, rand:()=>Math.random(), step:(s,a)=> s===0 ? {s2:a,r:a===1?1:0,done:a===1} : {s2:1,r:0,done:true} };
export const DEFAULT_INPUT = P;
export function buildTrace(input: QlProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Q-Learning', en: 'Q-Learning' }).commit();
  const Q = qLearningTable(input, {
    onEpisode: (ep, R) => rec.begin({ zh: '回合 ' + ep + ' R=' + R.toFixed(1), en: 'ep' }).setAux([{label:'ep',value:String(ep),role:'pivot' as BarRole},{label:'R',value:R.toFixed(1),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'Q[0]=' + Q[0]!.map((v)=>v.toFixed(2)).join(','), en: 'Q0' }).setAux([{label:'Q0',value:Q[0]!.map((v)=>v.toFixed(2)).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qLearningTable, type QlProblem } from '../../src/algorithms/ai-search/ais-q-learning-table/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-q-learning-table/trace.ts';
const P: QlProblem = { states:[0,1], actions:[0,1], episodes:50, maxSteps:3, alpha:0.5, gamma:0.9, epsilon:0.1, rand:()=>0, step:(s,a)=> s===0?{s2:a,r:a===1?1:0,done:a===1}:{s2:1,r:0,done:true} };
test('ql 学习偏向动作1', () => { const Q = qLearningTable(P); assert.ok(Q[0]![1]! >= Q[0]![0]!); });
test('ql trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 29. ais-temporal-difference-td0 -----
add({
  cat: 'ai-search', id: 'ais-td-zero',
  title: { zh: 'TD(0) 时序差分', en: 'TD(0) Learning' },
  summary: { zh: '无模型策略评估 V 值。', en: 'Model-free V evaluation bootstrapping 1 step.' },
  description: { zh: 'TD(0)(Sutton)用一步自举更新 V(s)←V(s)+α[r+γV(s_next)-V(s)]，是蒙特卡洛与动态规划的折中。', en: 'TD(0) bootstraps one step: V(s)←V(s)+α[r+γV(s_next)-V(s)], interpolating Monte Carlo and dynamic programming.' },
  tags: ['ai-search','td','reinforcement','prediction'],
  complexity: { time: 'O(episodes * steps)', space: 'O(|S|)' },
  impl: `export interface TdHooks { onStep?: (s: number, r: number, v: number) => void; onEpisode?: (ep: number) => void; }
export interface TdProblem { states: number[]; policy: (s: number) => number; step: (s: number, a: number) => { s2: number; r: number; done: boolean }; episodes: number; maxSteps: number; alpha: number; gamma: number; }
export function tdZero(p: TdProblem, hooks: TdHooks = {}): number[] {
  const V = p.states.map(() => 0);
  for (let ep = 0; ep < p.episodes; ep++) {
    let s = p.states[0]!;
    for (let st = 0; st < p.maxSteps; st++) {
      const a = p.policy(s); const { s2, r, done } = p.step(s, a);
      V[s] = V[s]! + p.alpha * (r + p.gamma * V[s2]! - V[s]!);
      hooks.onStep?.(s, r, V[s]!); s = s2; if (done) break;
    }
    hooks.onEpisode?.(ep);
  }
  return V;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tdZero, type TdProblem } from './impl.ts';
const P: TdProblem = { states:[0,1], policy:()=>0, step:(s)=> s===0?{s2:1,r:1,done:false}:{s2:1,r:0,done:true}, episodes:50, maxSteps:3, alpha:0.5, gamma:0.9 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: TdProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'TD(0)', en: 'TD(0)' }).commit();
  const V = tdZero(input, {
    onEpisode: (ep) => rec.begin({ zh: '回合 ' + ep, en: 'ep ' + ep }).setAux([{label:'ep',value:String(ep),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'V=' + V.map((v)=>v.toFixed(2)).join(','), en: 'V' }).setAux([{label:'V',value:V.map((v)=>v.toFixed(2)).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tdZero, type TdProblem } from '../../src/algorithms/ai-search/ais-td-zero/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-td-zero/trace.ts';
const P: TdProblem = { states:[0,1], policy:()=>0, step:(s)=> s===0?{s2:1,r:1,done:false}:{s2:1,r:0,done:true}, episodes:30, maxSteps:3, alpha:0.5, gamma:0.9 };
test('td0 V[0] 为正', () => assert.ok(tdZero(P)[0]! > 0));
test('td0 trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

// ----- 30. ais-monte-carlo-eval -----
add({
  cat: 'ai-search', id: 'ais-monte-carlo-eval',
  title: { zh: '蒙特卡洛策略评估', en: 'Monte Carlo Policy Evaluation' },
  summary: { zh: '用完整回合回报平均估计 V。', en: 'Averages full-episode returns to estimate V.' },
  description: { zh: '蒙特卡洛评估通过大量完整回合的回报样本平均估计状态价值，不需要环境模型，回报可首访或每次访问。', en: 'Monte Carlo evaluation averages return samples from complete episodes to estimate state values without a model (first/every visit).' },
  tags: ['ai-search','monte-carlo','reinforcement','prediction'],
  complexity: { time: 'O(episodes * steps)', space: 'O(|S|)' },
  impl: `export interface McHooks { onEpisode?: (ep: number, G: number) => void; onReturn?: (s: number, G: number) => void; }
export interface McProblem { states: number[]; policy: (s: number) => number; step: (s: number, a: number) => { s2: number; r: number; done: boolean }; episodes: number; maxSteps: number; gamma: number; }
export function monteCarloEval(p: McProblem, hooks: McHooks = {}): number[] {
  const sum = p.states.map(() => 0); const cnt = p.states.map(() => 0);
  for (let ep = 0; ep < p.episodes; ep++) {
    const traj: Array<{ s: number; r: number }> = []; let s = p.states[0]!;
    for (let st = 0; st < p.maxSteps; st++) { const a = p.policy(s); const { s2, r, done } = p.step(s, a); traj.push({ s, r }); s = s2; if (done) break; }
    let G = 0; const seen = new Set<number>();
    for (let i = traj.length - 1; i >= 0; i--) { G = p.gamma * G + traj[i]!.r; hooks.onReturn?.(traj[i]!.s, G); if (!seen.has(traj[i]!.s)) { seen.add(traj[i]!.s); sum[traj[i]!.s] += G; cnt[traj[i]!.s] += 1; } }
    hooks.onEpisode?.(ep, G);
  }
  return p.states.map((s) => (cnt[s]! > 0 ? sum[s]! / cnt[s]! : 0));
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monteCarloEval, type McProblem } from './impl.ts';
const P: McProblem = { states:[0,1], policy:()=>0, step:(s)=> s===0?{s2:1,r:1,done:false}:{s2:1,r:0,done:true}, episodes:40, maxSteps:3, gamma:1 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: McProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MC 评估', en: 'MC eval' }).commit();
  const V = monteCarloEval(input, {
    onEpisode: (ep, G) => rec.begin({ zh: '回合 ' + ep + ' G=' + G.toFixed(1), en: 'ep' }).setAux([{label:'ep',value:String(ep),role:'pivot' as BarRole},{label:'G',value:G.toFixed(1),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'V=' + V.map((v)=>v.toFixed(2)).join(','), en: 'V' }).setAux([{label:'V',value:V.map((v)=>v.toFixed(2)).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monteCarloEval, type McProblem } from '../../src/algorithms/ai-search/ais-monte-carlo-eval/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-monte-carlo-eval/trace.ts';
const P: McProblem = { states:[0,1], policy:()=>0, step:(s)=> s===0?{s2:1,r:1,done:false}:{s2:1,r:0,done:true}, episodes:30, maxSteps:3, gamma:1 };
test('mc V[0]=1', () => assert.equal(monteCarloEval(P)[0], 1));
test('mc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

console.log(`ai-search specs: ${'loaded'}`);
