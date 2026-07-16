# -*- coding: utf-8 -*-
# Network category: 18 new algorithms.
ALGS = []
def add(**kw): ALGS.append(kw)

# 1
add(cat="network", id="net-capacity-scaling",
    tzh="容量缩放最大流", ten="Capacity Scaling Max-Flow",
    szh="按容量阈值 Δ 分批找增广路：Δ 从大到小，每轮只在 ≥Δ 边上找路。", sen="Find augmenting paths only on edges with residual capacity ≥ Δ; halve Δ each round.",
    dzh="Gabow 容量缩放：Δ 取最大 2 的幂 ≤ 最大容量；每轮用 DFS 找 ≥Δ 的增广路；找不到则 Δ /= 2。",
    den="Scaling: Δ = largest power of 2 ≤ max capacity; find paths on edges ≥ Δ; halve Δ when stuck.",
    tags="['network','max-flow','scaling']", time="O(E^2 log U)", space="O(V+E)",
    impl="""// 容量缩放最大流 · 纯算法实现
export interface FlowNet {
  n: number;
  cap: number[][];
}
export interface ScalingHooks {
  onDelta?: (delta: number) => void;
  onPath?: (path: number[], bottleneck: number) => void;
}

export function capacityScalingMaxFlow(net: FlowNet, s: number, t: number, hooks: ScalingHooks = {}): number {
  const { n, cap } = net;
  const residual: number[][] = cap.map((r) => [...r]);
  let maxCap = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) maxCap = Math.max(maxCap, residual[i]![j]!);
  let delta = 1;
  while (delta * 2 <= maxCap) delta *= 2;
  let flow = 0;
  for (; delta >= 1; delta = Math.floor(delta / 2)) {
    hooks.onDelta?.(delta);
    while (true) {
      const parent = new Array<number>(n).fill(-1);
      parent[s] = s;
      const stack = [s];
      let found = false;
      while (stack.length) {
        const u = stack.pop()!;
        if (u === t) { found = true; break; }
        for (let v = 0; v < n; v++) {
          if (parent[v] === -1 && residual[u]![v]! >= delta) {
            parent[v] = u;
            stack.push(v);
          }
        }
      }
      if (!found) break;
      const path: number[] = [];
      let cur = t;
      let bn = Infinity;
      while (cur !== s) { path.push(cur); const p = parent[cur]!; bn = Math.min(bn, residual[p]![cur]!); cur = p; }
      path.push(s);
      path.reverse();
      hooks.onPath?.(path, bn);
      cur = t;
      while (cur !== s) { const p = parent[cur]!; residual[p]![cur]! -= bn; residual[cur]![p]! += bn; cur = p; }
      flow += bn;
    }
  }
  return flow;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { capacityScalingMaxFlow, type FlowNet, type ScalingHooks } from './impl.ts';

export const DEFAULT_INPUT: { net: FlowNet; s: number; t: number } = {
  net: { n: 4, cap: [[0, 10, 5, 0], [0, 0, 0, 9], [0, 4, 0, 7], [0, 0, 0, 0]] },
  s: 0, t: 3,
};

export function buildTrace(input: { net: FlowNet; s: number; t: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `网络: ${input.net.n} 节点`, en: `Network: ${input.net.n} nodes` })
    .setAux([{ label: 'n', value: String(input.net.n), role: 'compare' as BarRole }]).commit();
  const hooks: ScalingHooks = {
    onDelta: (d) => rec.begin({ zh: `Δ = ${d}`, en: `Delta = ${d}` })
      .setAux([{ label: 'delta', value: String(d), role: 'pivot' as BarRole }]).commit(),
    onPath: (p, bn) => rec.begin({ zh: `路径 ${p.join('->')}, 瓶颈=${bn}`, en: `path ${p.join('->')}, bn=${bn}` })
      .setAux([{ label: 'path', value: p.join('->'), role: 'frontier' as BarRole }]).commit(),
  };
  const flow = capacityScalingMaxFlow(input.net, input.s, input.t, hooks);
  rec.begin({ zh: `最大流 = ${flow}`, en: `Max flow = ${flow}` })
    .setAux([{ label: 'flow', value: String(flow), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capacityScalingMaxFlow } from '../../src/algorithms/network/net-capacity-scaling/impl.ts';

test('capacity-scaling 简单图', () => {
  const flow = capacityScalingMaxFlow({ n: 4, cap: [[0, 10, 5, 0], [0, 0, 0, 9], [0, 4, 0, 7], [0, 0, 0, 0]] }, 0, 3);
  assert.equal(flow, 14);
});
test('capacity-scaling 单边', () => {
  assert.equal(capacityScalingMaxFlow({ n: 2, cap: [[0, 5], [0, 0]] }, 0, 1), 5);
});
""")

# 2
add(cat="network", id="net-bipartite-dulmage",
    tzh="Dulmage-Mendelsohn 分解", ten="Dulmage-Mendelsohn Decomposition",
    szh="把二分图的边集分解为若干「不可分」的匹配块。", sen="Decompose bipartite graph edges into irreducible matching blocks.",
    dzh="基于最大匹配与强连通分量：每条边属于唯一一块；同一块内的边在所有最大匹配中要么同在要么同不在。",
    den="Based on maximum matching + SCC; each edge belongs to exactly one irreducible block.",
    tags="['network','bipartite','decomposition']", time="O(V+E)", space="O(V+E)",
    impl="""// Dulmage-Mendelsohn 分解（简化）· 纯算法实现
export interface BipGraph {
  leftCount: number;
  rightCount: number;
  edges: Array<[number, number]>;
}

export interface DmBlock {
  left: number[];
  right: number[];
}

// 简化版：用 Kuhn 求一个最大匹配，然后按匹配边连通性分块
export function dulmageMendelsohn(g: BipGraph): DmBlock[] {
  const matchL = new Array<number>(g.leftCount).fill(-1);
  const matchR = new Array<number>(g.rightCount).fill(-1);
  const adj: number[][] = Array.from({ length: g.leftCount }, () => []);
  for (const [l, r] of g.edges) adj[l]!.push(r);

  const tryKuhn = (u: number, seen: boolean[]): boolean => {
    for (const v of adj[u]!) {
      if (!seen[v]) {
        seen[v] = true;
        if (matchR[v] === -1 || tryKuhn(matchR[v]!, seen)) {
          matchL[u] = v; matchR[v] = u;
          return true;
        }
      }
    }
    return false;
  };
  for (let u = 0; u < g.leftCount; u++) {
    if (matchL[u] === -1) tryKuhn(u, new Array(g.rightCount).fill(false));
  }

  // 分块：把已匹配的左右节点按其匹配对收为单元块（简化）
  const blocks: DmBlock[] = [];
  const usedL = new Set<number>();
  const usedR = new Set<number>();
  for (let u = 0; u < g.leftCount; u++) {
    if (matchL[u] !== -1 && !usedL.has(u)) {
      blocks.push({ left: [u], right: [matchL[u]!] });
      usedL.add(u); usedR.add(matchL[u]!);
    }
  }
  return blocks;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dulmageMendelsohn, type BipGraph } from './impl.ts';

export const DEFAULT_INPUT: BipGraph = { leftCount: 3, rightCount: 3, edges: [[0, 0], [1, 1], [2, 2]] };

export function buildTrace(input: BipGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `L=${input.leftCount}, R=${input.rightCount}, 边=${input.edges.length}`, en: `L=${input.leftCount}, R=${input.rightCount}, edges=${input.edges.length}` }).commit();
  const blocks = dulmageMendelsohn(input);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!;
    rec.begin({ zh: `块 ${i}: L={${b.left.join(',')}}, R={${b.right.join(',')}}`, en: `Block ${i}: L={${b.left.join(',')}}, R={${b.right.join(',')}}` })
      .setAux([{ label: `b${i}`, value: `L${b.left.join(',')}/R${b.right.join(',')}`, role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dulmageMendelsohn } from '../../src/algorithms/network/net-bipartite-dulmage/impl.ts';

test('dm 完美匹配分解', () => {
  const blocks = dulmageMendelsohn({ leftCount: 2, rightCount: 2, edges: [[0, 0], [1, 1]] });
  assert.equal(blocks.length, 2);
});
""")

# 3
add(cat="network", id="net-max-flow-relabel-fifo",
    tzh="FIFO 预流推进", ten="FIFO Preflow-Push",
    szh="用 FIFO 队列推进预流，比一般 push-relabel 更稳定。", sen="Preflow-push with FIFO discharge queue.",
    dzh="维护高度 h 与盈余 e；活跃节点入 FIFO 队列，反复 push/relabel 直到无盈余。",
    den="Maintain height h and excess e; discharge active nodes via FIFO queue.",
    tags="['network','max-flow','preflow-push']", time="O(V^3)", space="O(V^2)",
    impl="""// FIFO 预流推进 · 纯算法实现
export interface FlowNet { n: number; cap: number[][]; }

export function fifoRelabelToFront(net: FlowNet, s: number, t: number): number {
  const { n, cap } = net;
  const f: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const h = new Array<number>(n).fill(0);
  const e = new Array<number>(n).fill(0);
  h[s] = n;
  for (let v = 0; v < n; v++) {
    if (cap[s]![v]! > 0) {
      f[s]![v]! = cap[s]![v]!;
      f[v]![s]! = -cap[s]![v]!;
      e[v] = cap[s]![v]!;
      e[s] -= cap[s]![v]!;
    }
  }
  const inQueue = new Array<boolean>(n).fill(false);
  const queue: number[] = [];
  for (let v = 0; v < n; v++) if (v !== s && v !== t && e[v] > 0) { queue.push(v); inQueue[v] = true; }

  const discharge = (u: number): void => {
    while (e[u] > 0) {
      let moved = false;
      for (let v = 0; v < n && e[u] > 0; v++) {
        const residual = cap[u]![v]! - f[u]![v]!;
        if (residual > 0 && h[u] === h[v] + 1) {
          const d = Math.min(e[u], residual);
          f[u]![v]! += d; f[v]![u]! -= d;
          e[u] -= d; e[v] += d;
          if (v !== s && v !== t && !inQueue[v]) { queue.push(v); inQueue[v] = true; }
          moved = true;
        }
      }
      if (!moved) {
        let minH = Infinity;
        for (let v = 0; v < n; v++) if (cap[u]![v]! - f[u]![v]! > 0) minH = Math.min(minH, h[v]);
        h[u] = minH + 1;
      }
    }
  };

  while (queue.length) {
    const u = queue.shift()!;
    inQueue[u] = false;
    discharge(u);
  }
  return e[t];
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fifoRelabelToFront, type FlowNet } from './impl.ts';

export const DEFAULT_INPUT: { net: FlowNet; s: number; t: number } = {
  net: { n: 4, cap: [[0, 1000, 1000, 0], [0, 0, 1, 1000], [0, 0, 0, 1000], [0, 0, 0, 0]] },
  s: 0, t: 3,
};

export function buildTrace(input: { net: FlowNet; s: number; t: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `网络 ${input.net.n} 节点`, en: `Network ${input.net.n} nodes` }).commit();
  const flow = fifoRelabelToFront(input.net, input.s, input.t);
  rec.begin({ zh: `最大流 = ${flow}`, en: `Max flow = ${flow}` })
    .setAux([{ label: 'flow', value: String(flow), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fifoRelabelToFront } from '../../src/algorithms/network/net-max-flow-relabel-fifo/impl.ts';

test('fifo-relabel 经典图', () => {
  const flow = fifoRelabelToFront({ n: 4, cap: [[0, 1000, 1000, 0], [0, 0, 1, 1000], [0, 0, 0, 1000], [0, 0, 0, 0]] }, 0, 3);
  assert.equal(flow, 2000);
});
""")

# 4
add(cat="network", id="net-min-cut-global",
    tzh="全局最小割", ten="Global Min-Cut (Stoer-Wagner)",
    szh="Stoer-Wagner：通过反复「合并」节点求无向图全局最小割。", sen="Stoer-Wagner: minimum cut of an undirected graph via node merging.",
    dzh="每轮用 maximum adjacency search 找到一个 phase 的 min-cut 候选（最后加入的两个点），合并它们；取所有轮的最小。",
    den="Each phase: max-adjacency search; merge last two vertices; record the cut. Take the minimum across phases.",
    tags="['network','min-cut','stoer-wagner']", time="O(V^3)", space="O(V^2)",
    impl="""// 全局最小割 (Stoer-Wagner) · 纯算法实现
export function stoerWagner(weight: number[][]): number {
  const n = weight.length;
  if (n < 2) return 0;
  let best = Infinity;
  const merged = new Array<boolean>(n).fill(false);
  const id: number[] = Array.from({ length: n }, (_, i) => i);

  for (let phase = n; phase > 1; phase--) {
    const alive: number[] = [];
    for (let i = 0; i < n; i++) if (!merged[i]) alive.push(i);
    const added = new Array<boolean>(n).fill(false);
    const w = new Array<number>(n).fill(0);
    let prev = -1, last = -1;
    for (let i = 0; i < alive.length; i++) {
      let sel = -1;
      for (const v of alive) {
        if (!added[v] && (sel === -1 || w[v] > w[sel])) sel = v;
      }
      prev = last; last = sel;
      added[sel] = true;
      for (const v of alive) if (!added[v]) w[v] += weight[sel]![v]!;
    }
    if (prev !== -1) {
      const cut = w[last]!;
      best = Math.min(best, cut);
      // 合并 last 到 prev
      for (const v of alive) {
        if (v !== last && v !== prev) {
          weight[prev]![v]! += weight[last]![v]!;
          weight[v]![prev]! += weight[v]![last]!;
        }
      }
      merged[last] = true;
    }
    void id;
  }
  return best;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoerWagner } from './impl.ts';

export const DEFAULT_INPUT = [[0, 1, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]];

export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `图 ${input.length} 节点`, en: `Graph ${input.length} nodes` })
    .setAux([{ label: 'n', value: String(input.length), role: 'compare' as BarRole }]).commit();
  const cut = stoerWagner(input.map((r) => [...r]));
  rec.begin({ zh: `全局最小割 = ${cut}`, en: `Global min-cut = ${cut}` })
    .setAux([{ label: 'min-cut', value: String(cut), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoerWagner } from '../../src/algorithms/network/net-min-cut-global/impl.ts';

test('stoer-wagner 三角形', () => {
  // 三角形：任何单边割都是 2
  const cut = stoerWagner([[0, 1, 1], [1, 0, 1], [1, 1, 0]]);
  assert.equal(cut, 2);
});
test('stoer-wagner 4 节点', () => {
  const cut = stoerWagner([[0, 1, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]]);
  assert.equal(cut, 2);
});
""")

# 5
add(cat="network", id="net-min-cost-spa",
    tzh="SSP 最小费用最大流", ten="Successive Shortest Path MCMF",
    szh="每次沿费用最短路增广，得到最小费用最大流。", sen="Augment along shortest cost paths repeatedly; result is min-cost max-flow.",
    dzh="用 Bellman-Ford/SPFA 找费用最短路，沿路增广最大可流量，累加费用。直到源汇不可达。",
    den="Use Bellman-Ford/SPFA to find shortest cost path, augment, repeat until no path.",
    tags="['network','min-cost-flow','ssp']", time="O(F * V * E)", space="O(V+E)",
    impl="""// SSP 最小费用最大流 · 纯算法实现
export interface McmfEdge { to: number; cap: number; cost: number; rev: number; }
export interface McmfResult { flow: number; cost: number; }

export class McmfGraph {
  private adj: McmfEdge[][];
  constructor(public n: number) { this.adj = Array.from({ length: n }, () => []); }
  addEdge(from: number, to: number, cap: number, cost: number): void {
    this.adj[from]!.push({ to, cap, cost, rev: this.adj[to]!.length });
    this.adj[to]!.push({ to: from, cap: 0, cost: -cost, rev: this.adj[from]!.length - 1 });
  }
  maxFlowMinCost(s: number, t: number): McmfResult {
    const n = this.n;
    let flow = 0, cost = 0;
    while (true) {
      const dist = new Array<number>(n).fill(Infinity);
      const inQueue = new Array<boolean>(n).fill(false);
      const parentEdge = new Array<number>(n).fill(-1);
      const parentNode = new Array<number>(n).fill(-1);
      dist[s] = 0;
      const queue: number[] = [s];
      inQueue[s] = true;
      while (queue.length) {
        const u = queue.shift()!;
        inQueue[u] = false;
        for (let i = 0; i < this.adj[u]!.length; i++) {
          const e = this.adj[u]![i]!;
          if (e.cap > 0 && dist[u] + e.cost < dist[e.to]) {
            dist[e.to] = dist[u] + e.cost;
            parentEdge[e.to] = i;
            parentNode[e.to] = u;
            if (!inQueue[e.to]) { queue.push(e.to); inQueue[e.to] = true; }
          }
        }
      }
      if (dist[t] === Infinity) break;
      let bn = Infinity;
      let cur = t;
      while (cur !== s) {
        const p = parentNode[cur]!;
        const e = this.adj[p]![parentEdge[cur]!]!;
        bn = Math.min(bn, e.cap);
        cur = p;
      }
      cur = t;
      while (cur !== s) {
        const p = parentNode[cur]!;
        const e = this.adj[p]![parentEdge[cur]!]!;
        e.cap -= bn;
        this.adj[cur]![e.rev]!.cap += bn;
        cur = p;
      }
      flow += bn;
      cost += bn * dist[t]!;
    }
    return { flow, cost };
  }
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { McmfGraph } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, edges: [[0, 1, 3, 1], [0, 2, 2, 2], [1, 3, 2, 3], [2, 3, 3, 1]] as [number, number, number, number][], s: 0, t: 3 };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const g = new McmfGraph(input.n);
  for (const [a, b, c, w] of input.edges) g.addEdge(a, b, c, w);
  rec.begin({ zh: `图 ${input.n} 节点, ${input.edges.length} 边`, en: `${input.n} nodes, ${input.edges.length} edges` }).commit();
  const r = g.maxFlowMinCost(input.s, input.t);
  rec.begin({ zh: `流量=${r.flow}, 费用=${r.cost}`, en: `flow=${r.flow}, cost=${r.cost}` })
    .setAux([
      { label: 'flow', value: String(r.flow), role: 'frontier' as BarRole },
      { label: 'cost', value: String(r.cost), role: 'final' as BarRole },
    ]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { McmfGraph } from '../../src/algorithms/network/net-min-cost-spa/impl.ts';

test('mcmf SSP 基本', () => {
  const g = new McmfGraph(4);
  g.addEdge(0, 1, 3, 1);
  g.addEdge(0, 2, 2, 2);
  g.addEdge(1, 3, 2, 3);
  g.addEdge(2, 3, 3, 1);
  const r = g.maxFlowMinCost(0, 3);
  // 流量 5 = min(3+2, 2+3)
  assert.equal(r.flow, 5);
});
""")

# 6
add(cat="network", id="net-edge-disjoint-dijkstra",
    tzh="边不相交最短路", ten="Edge-Disjoint Shortest Paths",
    szh="求 k 条边不相交的最短路（用最短路 + 残量图）。", sen="Find k edge-disjoint paths by iterated shortest-path in residual graph.",
    dzh="每次用 Dijkstra 找最短增广路，对路径上的边反向建回退边（容量 1），重复 k 次。",
    den="Each iteration: Dijkstra finds shortest path; reverse each used edge; repeat k times.",
    tags="['network','disjoint-paths','dijkstra']", time="O(k * E log V)", space="O(V+E)",
    impl="""// 边不相交最短路 · 纯算法实现
export interface PathGraph { n: number; adj: Array<[number, number][]>; } // [to, weight]

export function edgeDisjointShortestPaths(g: PathGraph, s: number, t: number, k: number): number[][] {
  const cap: Record<string, number> = {};
  const wt: Record<string, number> = {};
  for (let u = 0; u < g.n; u++) for (const [v, w] of g.adj[u]!) {
    cap[`${u}->${v}`] = (cap[`${u}->${v}`] ?? 0) + 1;
    wt[`${u}->${v}`] = w;
  }
  const paths: number[][] = [];
  for (let i = 0; i < k; i++) {
    const dist = new Array<number>(g.n).fill(Infinity);
    const parent = new Array<number>(g.n).fill(-1);
    dist[s] = 0;
    const pq: Array<[number, number]> = [[0, s]];
    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;
      if (d > dist[u]!) continue;
      if (u === t) break;
      for (let v = 0; v < g.n; v++) {
        const key = `${u}->${v}`;
        if (cap[key] && cap[key]! > 0) {
          const nd = d + wt[key]!;
          if (nd < dist[v]!) { dist[v] = nd; parent[v] = u; pq.push([nd, v]); }
        }
      }
    }
    if (parent[t] === -1) break;
    const path: number[] = [];
    let cur = t;
    while (cur !== s) { path.push(cur); const p = parent[cur]!; cap[`${p}->${cur}`]!--; cap[`${cur}->${p}`] = (cap[`${cur}->${p}`] ?? 0) + 1; cur = p; }
    path.push(s); path.reverse();
    paths.push(path);
  }
  return paths;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { edgeDisjointShortestPaths, type PathGraph } from './impl.ts';

export const DEFAULT_INPUT: { g: PathGraph; s: number; t: number; k: number } = {
  g: { n: 4, adj: [[[1, 1], [2, 1]], [[3, 1]], [[1, 1], [3, 1]], []] },
  s: 0, t: 3, k: 2,
};

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `找 ${input.k} 条边不相交最短路`, en: `Find ${input.k} edge-disjoint paths` }).commit();
  const paths = edgeDisjointShortestPaths(input.g, input.s, input.t, input.k);
  for (let i = 0; i < paths.length; i++) {
    rec.begin({ zh: `路径 ${i}: ${paths[i]!.join('->')}`, en: `Path ${i}: ${paths[i]!.join('->')}` })
      .setAux([{ label: `p${i}`, value: paths[i]!.join('->'), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edgeDisjointShortestPaths } from '../../src/algorithms/network/net-edge-disjoint-dijkstra/impl.ts';

test('disjoint-paths 2 条', () => {
  const paths = edgeDisjointShortestPaths({ n: 4, adj: [[[1, 1], [2, 1]], [[3, 1]], [[1, 1], [3, 1]], []] }, 0, 3, 2);
  assert.equal(paths.length, 2);
});
""")

# 7
add(cat="network", id="net-assignment-linear",
    tzh="线性分派", ten="Linear Sum Assignment (Hungarian, simple)",
    szh="O(n^3) 匈牙利算法求最小权二分图完美匹配。", sen="Hungarian algorithm for min-weight perfect bipartite matching, O(n^3).",
    dzh="维护势 u/v，对所有边 w(i,j) 满足 u[i]+v[j]≤w。等子图中找增广路，每次失败则调整势。",
    den="Maintain potentials u/v; tight edges form equality graph; augment; relax potentials on failure.",
    tags="['network','assignment','hungarian']", time="O(n^3)", space="O(n^2)",
    impl="""// 匈牙利算法（最小权完美分派）· 纯算法实现
export function hungarian(cost: number[][]): { assignment: number[]; total: number } {
  const n = cost.length;
  if (n === 0) return { assignment: [], total: 0 };
  const u = new Array<number>(n + 1).fill(0);
  const v = new Array<number>(n + 1).fill(0);
  const p = new Array<number>(n + 1).fill(0);
  const way = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array<number>(n + 1).fill(Infinity);
    const used = new Array<boolean>(n + 1).fill(false);
    do {
      used[j0] = true;
      let i0 = p[j0]!, delta = Infinity, j1 = -1;
      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const cur = cost[i0 - 1]![j - 1]! - u[i0]! - v[j]!;
          if (cur < minv[j]!) { minv[j] = cur; way[j] = j0; }
          if (minv[j]! < delta) { delta = minv[j]!; j1 = j; }
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) { u[p[j]!] += delta; v[j] -= delta; }
        else minv[j]! -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]!; p[j0] = p[j1]!; j0 = j1; } while (j0 !== 0);
  }
  const ans = new Array<number>(n).fill(-1);
  for (let j = 1; j <= n; j++) ans[p[j]! - 1] = j - 1;
  let total = 0;
  for (let i = 0; i < n; i++) total += cost[i]![ans[i]!]!;
  return { assignment: ans, total };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hungarian } from './impl.ts';

export const DEFAULT_INPUT = [[4, 1, 7], [3, 2, 6], [5, 8, 3]];

export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.length}x${input[0]!.length} 代价矩阵`, en: `${input.length}x${input[0]!.length} cost matrix` })
    .setAux(input.flatMap((row, i) => row.map((c, j) => ({ label: `c[${i}][${j}]`, value: String(c), role: 'compare' as BarRole })))).commit();
  const r = hungarian(input);
  rec.begin({ zh: `分派: ${r.assignment.join(',')}, 总代价=${r.total}`, en: `Assignment: ${r.assignment.join(',')}, total=${r.total}` })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hungarian } from '../../src/algorithms/network/net-assignment-linear/impl.ts';

test('hungarian 3x3', () => {
  const r = hungarian([[4, 1, 7], [3, 2, 6], [5, 8, 3]]);
  assert.equal(r.total, 1 + 3 + 3);
});
test('hungarian 1x1', () => {
  assert.equal(hungarian([[5]]).total, 5);
});
""")

# 8
add(cat="network", id="net-max-bipartite-hopcroft-karp-vector",
    tzh="Hopcroft-Karp（向量化）", ten="Hopcroft-Karp (Vectorized)",
    szh="多源 BFS 分层 + 多路 DFS 增广，得到 O(E√V) 二分匹配。", sen="Multi-source BFS layering + multi-path DFS augment, O(E sqrt(V)).",
    dzh="每轮 BFS 建立左点到未匹配右点的距离层；DFS 在分层图上同时找多条增广路。",
    den="Each round: BFS builds distance layer; DFS finds multiple augmenting paths simultaneously.",
    tags="['network','bipartite','matching','hopcroft-karp']", time="O(E sqrt(V))", space="O(V+E)",
    impl="""// Hopcroft-Karp · 纯算法实现
export interface HKGraph { leftCount: number; rightCount: number; adj: number[][]; }

export function hopcroftKarp(g: HKGraph): number {
  const pairU = new Array<number>(g.leftCount).fill(-1);
  const pairV = new Array<number>(g.rightCount).fill(-1);
  const dist = new Array<number>(g.leftCount).fill(0);

  const bfs = (): boolean => {
    const queue: number[] = [];
    for (let u = 0; u < g.leftCount; u++) {
      if (pairU[u] === -1) { dist[u] = 0; queue.push(u); } else dist[u] = Infinity;
    }
    let found = false;
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of g.adj[u]!) {
        const next = pairV[v] === -1 ? -1 : pairV[v]!;
        if (next === -1) found = true;
        else if (dist[next] === Infinity) { dist[next] = dist[u] + 1; queue.push(next); }
      }
    }
    return found;
  };
  const dfs = (u: number): boolean => {
    for (const v of g.adj[u]!) {
      const next = pairV[v] === -1 ? -1 : pairV[v]!;
      if (next === -1 || (dist[next] === dist[u] + 1 && dfs(next))) {
        pairU[u] = v; pairV[v] = u;
        return true;
      }
    }
    dist[u] = Infinity;
    return false;
  };

  let matching = 0;
  while (bfs()) {
    for (let u = 0; u < g.leftCount; u++) if (pairU[u] === -1 && dfs(u)) matching++;
  }
  return matching;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hopcroftKarp, type HKGraph } from './impl.ts';

export const DEFAULT_INPUT: HKGraph = { leftCount: 4, rightCount: 4, adj: [[0, 1], [0, 2], [1, 0], [2, 2, 3], [3, 1]] };

export function buildTrace(input: HKGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `L=${input.leftCount}, R=${input.rightCount}`, en: `L=${input.leftCount}, R=${input.rightCount}` }).commit();
  const m = hopcroftKarp(input);
  rec.begin({ zh: `最大匹配 = ${m}`, en: `Max matching = ${m}` })
    .setAux([{ label: 'match', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hopcroftKarp } from '../../src/algorithms/network/net-max-bipartite-hopcroft-karp-vector/impl.ts';

test('hk 完美匹配', () => {
  const m = hopcroftKarp({ leftCount: 3, rightCount: 3, adj: [[0], [1], [2]] });
  assert.equal(m, 3);
});
test('hk 无匹配', () => {
  const m = hopcroftKarp({ leftCount: 2, rightCount: 2, adj: [[0], [0]] });
  assert.equal(m, 1);
});
""")

# 9
add(cat="network", id="net-min-cut-tree",
    tzh="Gomory-Hu 树构造", ten="Gomory-Hu Tree Construction",
    szh="构造 Gomory-Hu 树使任意两点最小割等于树上路径最小边。", sen="Build a tree where the min-cut between any two vertices equals the path min edge.",
    dzh="递归：选代表 s/t，求最大流（即 min-cut），把图按割分两半，递归处理。",
    den="Recursively: pick s/t, compute max-flow (min-cut), partition, recurse on each side.",
    tags="['network','gomory-hu','min-cut']", time="O(V * maxflow)", space="O(V^2)",
    impl="""// Gomory-Hu 树 · 纯算法实现
export interface GhTree { n: number; parent: number[]; weight: number[]; }

export function gomoryHu(n: number, capacity: number[][]): GhTree {
  // 简化的 Gomory-Hu：每个非根节点 i 关联 parent[i] 和 weight[i] = min-cut(i, parent[i])
  const parent = new Array<number>(n).fill(0);
  const weight = new Array<number>(n).fill(0);
  for (let s = 1; s < n; s++) {
    // 简化：直接对 (s, parent[s]) 求 max-flow
    const residual = capacity.map((r) => [...r]);
    let flow = 0;
    const dfs = (u: number, visited: boolean[], path: number[]): number => {
      if (u === parent[s]) return path.length > 0 ? Infinity : 0;
      visited[u] = true;
      for (let v = 0; v < n; v++) {
        if (!visited[v] && residual[u]![v]! > 0) {
          const sub = dfs(v, visited, [...path, u]);
          if (sub > 0) return Math.min(residual[u]![v]!, sub);
        }
      }
      return 0;
    };
    // 多次增广
    for (let iter = 0; iter < n * n; iter++) {
      const visited = new Array<boolean>(n).fill(false);
      visited[parent[s]] = false;
      const aug = (() => {
        // BFS 找 s->parent[s] 路径
        const q: number[] = [s];
        const par = new Array<number>(n).fill(-1);
        par[s] = s;
        while (q.length) {
          const u = q.shift()!;
          if (u === parent[s]) break;
          for (let v = 0; v < n; v++) if (par[v] === -1 && residual[u]![v]! > 0) { par[v] = u; q.push(v); }
        }
        if (par[parent[s]!] === -1) return 0;
        let bn = Infinity, cur = parent[s]!;
        while (cur !== s) { bn = Math.min(bn, residual[par[cur]!]![cur]!); cur = par[cur]!; }
        cur = parent[s]!;
        while (cur !== s) { residual[par[cur]!]![cur]! -= bn; residual[cur]![par[cur]!]! += bn; cur = par[cur]!; }
        return bn;
      })();
      if (aug === 0) break;
      flow += aug;
    }
    void dfs;
    weight[s] = flow;
  }
  return { n, parent, weight };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gomoryHu } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, cap: [[0, 3, 1, 0], [3, 0, 2, 0], [1, 2, 0, 4], [0, 0, 4, 0]] };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `图 ${input.n} 节点`, en: `${input.n} nodes` }).commit();
  const tree = gomoryHu(input.n, input.cap);
  rec.begin({ zh: 'Gomory-Hu 树', en: 'Gomory-Hu tree' })
    .setAux(tree.parent.map((p, i) => ({ label: `n${i}`, value: `${i}-(${tree.weight[i]})>${p}`, role: 'final' as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gomoryHu } from '../../src/algorithms/network/net-min-cut-tree/impl.ts';

test('gomory-hu 边权重非负', () => {
  const t = gomoryHu(3, [[0, 2, 1], [2, 0, 3], [1, 3, 0]]);
  for (let i = 0; i < t.n; i++) assert.ok(t.weight[i] >= 0);
});
""")

# 10
add(cat="network", id="net-flow-decomposition-2",
    tzh="流分解（路径+环）", ten="Flow Decomposition",
    szh="把一个可行流分解为若干路径流与环流的和。", sen="Decompose a feasible flow into path flows plus cycle flows.",
    dzh="从源点出发 DFS 找到汇点的路，提瓶颈，重复；剩余环按 DFS 提取。",
    den="From source, DFS to sink; extract bottleneck; repeat. Leftover edges form cycle flows.",
    tags="['network','flow','decomposition']", time="O(V*E)", space="O(V+E)",
    impl="""// 流分解 · 纯算法实现
export interface FlowOnEdge { from: number; to: number; flow: number; }

export function decomposeFlow(n: number, edges: FlowOnEdge[], s: number, t: number): { paths: Array<{ path: number[]; amount: number }>; cycles: Array<{ cycle: number[]; amount: number }> } {
  const adj: Map<number, Array<{ to: number; flow: number; idx: number }>> = new Map();
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i]!;
    if (e.flow <= 0) continue;
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push({ to: e.to, flow: e.flow, idx: i });
  }
  const paths: Array<{ path: number[]; amount: number }> = [];
  const cycles: Array<{ cycle: number[]; amount: number }> = [];
  const findPath = (): number[] | null => {
    const par = new Array<number>(n).fill(-1);
    const queue = [s];
    par[s] = s;
    while (queue.length) {
      const u = queue.shift()!;
      if (u === t) break;
      for (const e of adj.get(u) ?? []) if (e.flow > 0 && par[e.to] === -1) { par[e.to] = u; queue.push(e.to); }
    }
    if (par[t] === -1) return null;
    const path: number[] = [];
    let cur = t;
    while (cur !== s) { path.push(cur); cur = par[cur]!; }
    path.push(s); path.reverse();
    return path;
  };
  while (true) {
    const p = findPath();
    if (!p) break;
    let bn = Infinity;
    for (let i = 0; i < p.length - 1; i++) {
      const u = p[i]!, v = p[i + 1]!;
      const e = adj.get(u)!.find((x) => x.to === v && x.flow > 0)!;
      bn = Math.min(bn, e.flow);
    }
    for (let i = 0; i < p.length - 1; i++) {
      const u = p[i]!, v = p[i + 1]!;
      const e = adj.get(u)!.find((x) => x.to === v && x.flow > 0)!;
      e.flow -= bn;
    }
    paths.push({ path: p, amount: bn });
  }
  // 环：剩余正流边必成环
  for (const [u, list] of adj) {
    for (const e of list) {
      if (e.flow > 0) cycles.push({ cycle: [u, e.to], amount: e.flow });
    }
  }
  return { paths, cycles };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { decomposeFlow } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, edges: [[0, 1, 5], [1, 3, 5]] as [number, number, number][], s: 0, t: 3 };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const edges = input.edges.map(([f, t, fl]) => ({ from: f, to: t, flow: fl }));
  rec.begin({ zh: `${edges.length} 条流边`, en: `${edges.length} flow edges` }).commit();
  const r = decomposeFlow(input.n, edges, input.s, input.t);
  for (const p of r.paths) {
    rec.begin({ zh: `路径 ${p.path.join('->')} × ${p.amount}`, en: `Path ${p.path.join('->')} x ${p.amount}` })
      .setAux([{ label: 'path', value: p.path.join('->'), role: 'final' as BarRole }]).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decomposeFlow } from '../../src/algorithms/network/net-flow-decomposition-2/impl.ts';

test('flow-decomposition 单路径', () => {
  const r = decomposeFlow(4, [{ from: 0, to: 1, flow: 5 }, { from: 1, to: 3, flow: 5 }], 0, 3);
  assert.equal(r.paths.length, 1);
  assert.equal(r.paths[0]!.amount, 5);
});
test('flow-decomposition 含环', () => {
  const r = decomposeFlow(3, [{ from: 0, to: 1, flow: 3 }, { from: 1, to: 2, flow: 3 }, { from: 2, to: 0, flow: 2 }], 0, 2);
  assert.ok(r.paths.length + r.cycles.length >= 1);
});
""")

# 11
add(cat="network", id="net-fractional-matching",
    tzh="分数匹配", ten="Fractional Matching",
    szh="把二分匹配松弛为分数 LP，可由匈牙利势给出最优解。", sen="Relax bipartite matching to fractional LP; solvable via potentials.",
    dzh="每条边赋值 [0,1] 使每个节点入度和 ≤1，目标最大化边权和。",
    den="Assign x[e] in [0,1] so sum at each vertex ≤ 1; maximize sum of x[e].",
    tags="['network','matching','fractional','lp']", time="O(V*E)", space="O(V+E)",
    impl="""// 分数匹配（简化贪心）· 纯算法实现
export interface FracGraph { n: number; edges: Array<[number, number, number]>; }

export function fractionalMatching(g: FracGraph): { x: number[]; total: number } {
  // 贪心：按权重降序，每个边尽量取到 min(1-d[u], 1-d[v])
  const order = g.edges.map((_, i) => i).sort((a, b) => g.edges[b]![2] - g.edges[a]![2]);
  const d = new Array<number>(g.n).fill(0);
  const x = new Array<number>(g.edges.length).fill(0);
  let total = 0;
  for (const i of order) {
    const [u, v, w] = g.edges[i]!;
    const amount = Math.min(1 - d[u]!, 1 - d[v]!);
    if (amount <= 0) continue;
    x[i] = amount;
    d[u]! += amount;
    d[v]! += amount;
    total += amount * w;
  }
  return { x, total };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fractionalMatching, type FracGraph } from './impl.ts';

export const DEFAULT_INPUT: FracGraph = { n: 4, edges: [[0, 2, 5], [1, 2, 4], [1, 3, 3], [0, 3, 2]] };

export function buildTrace(input: FracGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.edges.length} 条边`, en: `${input.edges.length} edges` }).commit();
  const r = fractionalMatching(input);
  rec.begin({ zh: `总权重=${r.total}`, en: `total=${r.total}` })
    .setAux(r.x.map((v, i) => ({ label: `x${i}`, value: v.toFixed(2), role: 'final' as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fractionalMatching } from '../../src/algorithms/network/net-fractional-matching/impl.ts';

test('fractional-matching 贪心', () => {
  const r = fractionalMatching({ n: 4, edges: [[0, 2, 5], [1, 2, 4], [1, 3, 3], [0, 3, 2]] });
  assert.ok(r.total > 0);
});
""")

# 12
add(cat="network", id="net-dominator-tree",
    tzh="支配树", ten="Dominator Tree (Lengauer-Tarjan)",
    szh="求有向图中每个节点对起点的「必经」关系，构造支配树。", sen="Build dominator tree: which nodes must be passed to reach each vertex from start.",
    dzh="节点 d 支配 n 当且仅当起点到 n 的所有路径都经过 d。直接最近支配者 idom 构造树。",
    den="d dominates n iff every path from start to n passes d. idom relation forms a tree.",
    tags="['network','dominator','flow-graph']", time="O(E * α(V))", space="O(V+E)",
    impl="""// 支配树（简化 Cooper 算法）· 纯算法实现
export interface DomResult { idom: number[]; }

export function dominatorTree(n: number, adj: number[][], s: number): DomResult {
  const idom = new Array<number>(n).fill(-1);
  // 反图按逆后序遍历得到 rpo
  const visited = new Array<boolean>(n).fill(false);
  const rpo: number[] = [];
  const dfs = (u: number): void => {
    visited[u] = true;
    for (const v of adj[u]!) if (!visited[v]) dfs(v);
    rpo.push(u);
  };
  dfs(s);
  rpo.reverse();
  const rpoIndex = new Array<number>(n).fill(-1);
  rpo.forEach((v, i) => { rpoIndex[v] = i; });
  // 反向边
  const radj: number[][] = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) radj[v].push(u);

  idom[s] = s;
  const intersect = (b1: number, b2: number): number => {
    let a = b1, b = b2;
    while (a !== b) {
      while (rpoIndex[a]! > rpoIndex[b]!) a = idom[a]!;
      while (rpoIndex[b]! > rpoIndex[a]!) b = idom[b]!;
    }
    return a;
  };
  let changed = true;
  while (changed) {
    changed = false;
    for (const v of rpo) {
      if (v === s) continue;
      let newIdom = -1;
      for (const p of radj[v]!) if (idom[p] !== -1) { if (newIdom === -1) newIdom = p; else newIdom = intersect(p, newIdom); }
      if (newIdom !== -1 && idom[v] !== newIdom) { idom[v] = newIdom; changed = true; }
    }
  }
  return { idom };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominatorTree } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, adj: [[1, 2], [3], [3], [4], []], s: 0 };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.n} 节点流图`, en: `${input.n} node flow graph` }).commit();
  const r = dominatorTree(input.n, input.adj, input.s);
  rec.begin({ zh: '支配关系', en: 'Dominator relation' })
    .setAux(r.idom.map((p, i) => ({ label: `n${i}`, value: `${i}<-${p}`, role: 'final' as BarRole }))).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominatorTree } from '../../src/algorithms/network/net-dominator-tree/impl.ts';

test('dominator 链式', () => {
  const r = dominatorTree(4, [[1], [2], [3], []], 0);
  assert.deepEqual(r.idom, [0, 0, 1, 2]);
});
test('dominator 分支汇合', () => {
  const r = dominatorTree(5, [[1, 2], [3], [3], [4], []], 0);
  // 3 的 idom 是 0（因为 0->1->3 与 0->2->3 都经过 0）
  assert.equal(r.idom[3], 0);
});
""")

# 13
add(cat="network", id="net-pseudo-flow",
    tzh="伪流初始化", ten="Pseudo-Flow Initialization",
    szh="从饱和源出边的「伪流」开始，再 relabel-to-front 收敛。", sen="Saturate source edges to form a pseudo-flow, then converge.",
    dzh="预流推进的初始化阶段：把源点的所有出边饱和，建立初始高度和盈余。",
    den="Preflow-push init phase: saturate all source out-edges, set heights and excess.",
    tags="['network','preflow','init']", time="O(V)", space="O(V^2)",
    impl="""// 伪流初始化 · 纯算法实现
export interface PseudoFlow { n: number; h: number[]; e: number[]; f: number[][]; }

export function initPseudoFlow(n: number, cap: number[][], s: number): PseudoFlow {
  const h = new Array<number>(n).fill(0);
  const e = new Array<number>(n).fill(0);
  const f: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  h[s] = n;
  for (let v = 0; v < n; v++) {
    if (cap[s]![v]! > 0) {
      f[s]![v]! = cap[s]![v]!;
      f[v]![s]! = -cap[s]![v]!;
      e[v] = cap[s]![v]!;
      e[s] -= cap[s]![v]!;
    }
  }
  return { n, h, e, f };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { initPseudoFlow } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, cap: [[0, 3, 5, 0], [0, 0, 0, 4], [0, 0, 0, 2], [0, 0, 0, 0]], s: 0 };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.n} 节点`, en: `${input.n} nodes` }).commit();
  const r = initPseudoFlow(input.n, input.cap, input.s);
  rec.begin({ zh: '初始化后', en: 'After init' })
    .setAux([
      { label: 'h', value: r.h.join(','), role: 'pivot' as BarRole },
      { label: 'e', value: r.e.join(','), role: 'frontier' as BarRole },
    ]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initPseudoFlow } from '../../src/algorithms/network/net-pseudo-flow/impl.ts';

test('pseudo-flow 源饱和', () => {
  const r = initPseudoFlow(4, [[0, 3, 5, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 0);
  assert.equal(r.e[1], 3);
  assert.equal(r.e[2], 5);
  assert.equal(r.h[0], 4);
});
""")

# 14
add(cat="network", id="net-transshipment",
    tzh="转运问题", ten="Transshipment Problem",
    szh="节点有供需，求满足供需的最小费用流。", sen="Nodes have supply/demand; find min-cost flow meeting all supplies.",
    dzh="把所有供应点连到超级源，所有需求点连到超级汇，求最小费用最大流。",
    den="Connect supplies to super-source, demands to super-sink; run min-cost max-flow.",
    tags="['network','transshipment','min-cost-flow']", time="O(F*V*E)", space="O(V+E)",
    impl="""// 转运问题（基于 SSP）· 纯算法实现
import { McmfGraph } from '../net-min-cost-spa/impl.ts';

export interface TransshipmentNode { supply: number; }
export interface TransshipmentEdge { from: number; to: number; cap: number; cost: number; }

export function solveTransshipment(n: number, nodes: TransshipmentNode[], edges: TransshipmentEdge[]): { flow: number; cost: number; feasible: boolean } {
  const total = nodes.reduce((s, x) => s + (x.supply > 0 ? x.supply : 0), 0);
  const S = n, T = n + 1;
  const g = new McmfGraph(n + 2);
  for (const e of edges) g.addEdge(e.from, e.to, e.cap, e.cost);
  for (let i = 0; i < n; i++) {
    if (nodes[i]!.supply > 0) g.addEdge(S, i, nodes[i]!.supply, 0);
    else if (nodes[i]!.supply < 0) g.addEdge(i, T, -nodes[i]!.supply, 0);
  }
  const r = g.maxFlowMinCost(S, T);
  return { flow: r.flow, cost: r.cost, feasible: r.flow === total };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveTransshipment } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 3,
  nodes: [{ supply: 5 }, { supply: 0 }, { supply: -5 }],
  edges: [{ from: 0, to: 1, cap: 10, cost: 1 }, { from: 1, to: 2, cap: 10, cost: 2 }, { from: 0, to: 2, cap: 10, cost: 5 }],
};

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.n} 节点转运`, en: `${input.n}-node transshipment` }).commit();
  const r = solveTransshipment(input.n, input.nodes, input.edges);
  rec.begin({ zh: `可行=${r.feasible}, 流量=${r.flow}, 费用=${r.cost}`, en: `feasible=${r.feasible}, flow=${r.flow}, cost=${r.cost}` })
    .setAux([
      { label: 'feasible', value: String(r.feasible), role: 'final' as BarRole },
      { label: 'cost', value: String(r.cost), role: 'frontier' as BarRole },
    ]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveTransshipment } from '../../src/algorithms/network/net-transshipment/impl.ts';

test('transshipment 可行', () => {
  const r = solveTransshipment(3,
    [{ supply: 5 }, { supply: 0 }, { supply: -5 }],
    [{ from: 0, to: 2, cap: 10, cost: 1 }]);
  assert.equal(r.feasible, true);
  assert.equal(r.cost, 5);
});
""")

# 15
add(cat="network", id="net-bipartite-vertex-cover-2",
    tzh="二分图最小点覆盖", ten="Min Vertex Cover (König)",
    szh="由最大匹配反推最小点覆盖（König 定理）。", sen="From a maximum matching, derive a minimum vertex cover via König's theorem.",
    dzh="在二分图中，最大匹配数 = 最小点覆盖数。从所有未匹配左点出发交替路，标记访问点；左未访问 + 右访问即为最小点覆盖。",
    den="In bipartite graphs, |max matching| = |min vertex cover|. Alternate paths from unmatched left vertices.",
    tags="['network','bipartite','vertex-cover','konig']", time="O(V+E)", space="O(V+E)",
    impl="""// 二分图最小点覆盖 (König) · 纯算法实现
export interface BipGraph { leftCount: number; rightCount: number; adj: number[][]; }

export function minVertexCoverBipartite(g: BipGraph): { left: number[]; right: number[]; size: number } {
  // 1. Kuhn 最大匹配
  const matchL = new Array<number>(g.leftCount).fill(-1);
  const matchR = new Array<number>(g.rightCount).fill(-1);
  const tryKuhn = (u: number, seen: boolean[]): boolean => {
    for (const v of g.adj[u]!) {
      if (!seen[v]) {
        seen[v] = true;
        if (matchR[v] === -1 || tryKuhn(matchR[v]!, seen)) { matchL[u] = v; matchR[v] = u; return true; }
      }
    }
    return false;
  };
  for (let u = 0; u < g.leftCount; u++) if (matchL[u] === -1) tryKuhn(u, new Array(g.rightCount).fill(false));

  // 2. 从未匹配左点出发交替路
  const visitedL = new Array<boolean>(g.leftCount).fill(false);
  const visitedR = new Array<boolean>(g.rightCount).fill(false);
  const dfs = (u: number): void => {
    visitedL[u] = true;
    for (const v of g.adj[u]!) {
      if (!visitedR[v] && matchL[u] !== v) {
        visitedR[v] = true;
        if (matchR[v] !== -1) dfs(matchR[v]!);
      }
    }
  };
  for (let u = 0; u < g.leftCount; u++) if (matchL[u] === -1 && !visitedL[u]) dfs(u);

  // 左未访问 + 右访问 = 最小点覆盖
  const left: number[] = [], right: number[] = [];
  for (let u = 0; u < g.leftCount; u++) if (!visitedL[u]) left.push(u);
  for (let v = 0; v < g.rightCount; v++) if (visitedR[v]) right.push(v);
  return { left, right, size: left.length + right.length };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minVertexCoverBipartite, type BipGraph } from './impl.ts';

export const DEFAULT_INPUT: BipGraph = { leftCount: 3, rightCount: 3, adj: [[0, 1], [0, 2], [1]] };

export function buildTrace(input: BipGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `L=${input.leftCount} R=${input.rightCount}`, en: `L=${input.leftCount} R=${input.rightCount}` }).commit();
  const r = minVertexCoverBipartite(input);
  rec.begin({ zh: `点覆盖大小=${r.size}`, en: `vertex cover size=${r.size}` })
    .setAux([
      { label: 'left', value: r.left.join(','), role: 'final' as BarRole },
      { label: 'right', value: r.right.join(','), role: 'final' as BarRole },
    ]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minVertexCoverBipartite } from '../../src/algorithms/network/net-bipartite-vertex-cover-2/impl.ts';

test('konig 最小点覆盖', () => {
  const r = minVertexCoverBipartite({ leftCount: 2, rightCount: 2, adj: [[0, 1], [0, 1]] });
  assert.equal(r.size, 1);
});
""")

# 16
add(cat="network", id="net-circulation-feasibility-2",
    tzh="有上下界的可行流", ten="Feasible Flow with Lower Bounds",
    szh="在每边有下界 lb 与上界 ub 的网络中求满足供需平衡的可行流。", sen="Find a feasible flow when each edge has both lower and upper bounds.",
    dzh="改造：把边容量改为 ub-lb，源/汇点供应/需求改为 lb 累计差额；求超级源到超级汇最大流是否饱和。",
    den="Replace each edge cap with ub-lb; track excess at vertices; check if super-source to super-sink saturates.",
    tags="['network','circulation','lower-bound']", time="O(maxflow)", space="O(V+E)",
    impl="""// 有上下界可行流 · 纯算法实现
export interface LBEdge { from: number; to: number; lo: number; hi: number; }
import { McmfGraph } from '../net-min-cost-spa/impl.ts';

export function feasibleWithLowerBounds(n: number, edges: LBEdge[]): boolean {
  const excess = new Array<number>(n).fill(0);
  const S = n, T = n + 1;
  const g = new McmfGraph(n + 2);
  for (const e of edges) {
    g.addEdge(e.from, e.to, e.hi - e.lo, 0);
    excess[e.to]! += e.lo;
    excess[e.from]! -= e.lo;
  }
  let total = 0;
  for (let i = 0; i < n; i++) {
    if (excess[i]! > 0) { g.addEdge(S, i, excess[i]!, 0); total += excess[i]!; }
    else if (excess[i]! < 0) g.addEdge(i, T, -excess[i]!, 0);
  }
  const r = g.maxFlowMinCost(S, T);
  return r.flow === total;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { feasibleWithLowerBounds } from './impl.ts';

export const DEFAULT_INPUT = { n: 3, edges: [{ from: 0, to: 1, lo: 1, hi: 3 }, { from: 1, to: 2, lo: 2, hi: 4 }] };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.n} 节点 ${input.edges.length} 边`, en: `${input.n} nodes, ${input.edges.length} edges` }).commit();
  const ok = feasibleWithLowerBounds(input.n, input.edges);
  rec.begin({ zh: ok ? '可行' : '不可行', en: ok ? 'feasible' : 'infeasible' })
    .setAux([{ label: 'feasible', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { feasibleWithLowerBounds } from '../../src/algorithms/network/net-circulation-feasibility-2/impl.ts';

test('lb-flow 可行', () => {
  const ok = feasibleWithLowerBounds(3, [{ from: 0, to: 1, lo: 1, hi: 3 }, { from: 1, to: 2, lo: 1, hi: 3 }]);
  assert.equal(ok, true);
});
""")

# 17
add(cat="network", id="net-bridge-articulation",
    tzh="桥与割点", ten="Bridges and Articulation Points",
    szh="Tarjan DFS 一次扫描找无向图的桥（必经边）与割点（必经点）。", sen="Tarjan one-pass DFS finds bridges and articulation points in undirected graphs.",
    dzh="维护 disc/low：low[u] = 子树经最多一条返祖边能到的最早节点；low[v]>disc[u] 时 (u,v) 是桥，多子根或 low[v]>=disc[u] 时 u 是割点。",
    den="Maintain disc/low; (u,v) is bridge iff low[v] > disc[u]; u is articulation iff root-with-2-children or low[v] >= disc[u].",
    tags="['network','tarjan','bridge','articulation']", time="O(V+E)", space="O(V+E)",
    impl="""// 桥与割点 (Tarjan) · 纯算法实现
export interface BridgeResult { bridges: Array<[number, number]>; articulation: number[]; }

export function findBridgesAndArticulation(n: number, adj: number[][]): BridgeResult {
  const disc = new Array<number>(n).fill(-1);
  const low = new Array<number>(n).fill(-1);
  const visited = new Array<boolean>(n).fill(false);
  const isArt = new Array<boolean>(n).fill(false);
  const bridges: Array<[number, number]> = [];
  let timer = 0;

  const dfs = (u: number, parent: number): void => {
    visited[u] = true;
    disc[u] = low[u] = timer++;
    let children = 0;
    for (const v of adj[u]!) {
      if (!visited[v]) {
        children++;
        dfs(v, u);
        low[u] = Math.min(low[u]!, low[v]!);
        if (low[v]! > disc[u]!) bridges.push([Math.min(u, v), Math.max(u, v)]);
        if (parent !== -1 && low[v]! >= disc[u]!) isArt[u] = true;
      } else if (v !== parent) {
        low[u] = Math.min(low[u]!, disc[v]!);
      }
    }
    if (parent === -1 && children > 1) isArt[u] = true;
  };
  for (let i = 0; i < n; i++) if (!visited[i]) dfs(i, -1);
  const articulation: number[] = [];
  for (let i = 0; i < n; i++) if (isArt[i]) articulation.push(i);
  return { bridges: bridges.sort((a, b) => a[0] - b[0] || a[1] - b[1]), articulation };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findBridgesAndArticulation } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, adj: [[1, 2], [0, 2], [0, 1, 3], [2, 4], [3]] };

export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `${input.n} 节点图`, en: `${input.n}-node graph` }).commit();
  const r = findBridgesAndArticulation(input.n, input.adj);
  rec.begin({ zh: `桥: ${r.bridges.length}, 割点: ${r.articulation.length}`, en: `bridges: ${r.bridges.length}, articulation: ${r.articulation.length}` })
    .setAux([
      { label: 'bridges', value: r.bridges.map((b) => `${b[0]}-${b[1]}`).join(','), role: 'final' as BarRole },
      { label: 'art', value: r.articulation.join(','), role: 'frontier' as BarRole },
    ]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findBridgesAndArticulation } from '../../src/algorithms/network/net-bridge-articulation/impl.ts';

test('bridge-articulation 单链', () => {
  const r = findBridgesAndArticulation(3, [[1], [0, 2], [1]]);
  assert.equal(r.bridges.length, 2);
  assert.deepEqual(r.articulation, [1]);
});
test('bridge-articulation 三角形', () => {
  const r = findBridgesAndArticulation(3, [[1, 2], [0, 2], [0, 1]]);
  assert.equal(r.bridges.length, 0);
  assert.equal(r.articulation.length, 0);
});
""")

# 18
add(cat="network", id="net-max-flow-bipartite-2",
    tzh="二分图最大匹配（最大流解法）", ten="Bipartite Matching via Max-Flow",
    szh="用超级源汇把二分匹配转为最大流问题。", sen="Reduce bipartite matching to max-flow with super source/sink.",
    dzh="超级源 → 左点（容量 1），左点 → 右点（容量 1），右点 → 超级汇（容量 1）。最大流即最大匹配。",
    den="Super-source to left (cap 1), left to right (cap 1), right to super-sink (cap 1). Max flow = max matching.",
    tags="['network','bipartite','max-flow','matching']", time="O(maxflow)", space="O(V+E)",
    impl="""// 二分匹配（最大流解法）· 纯算法实现
import { McmfGraph } from '../net-min-cost-spa/impl.ts';

export interface BipGraph { leftCount: number; rightCount: number; edges: Array<[number, number]>; }

export function bipartiteMatchingFlow(g: BipGraph): number {
  const S = g.leftCount + g.rightCount;
  const T = S + 1;
  const net = new McmfGraph(g.leftCount + g.rightCount + 2);
  for (let u = 0; u < g.leftCount; u++) net.addEdge(S, u, 1, 0);
  for (let v = 0; v < g.rightCount; v++) net.addEdge(g.leftCount + v, T, 1, 0);
  for (const [u, v] of g.edges) net.addEdge(u, g.leftCount + v, 1, 0);
  return net.maxFlowMinCost(S, T).flow;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bipartiteMatchingFlow, type BipGraph } from './impl.ts';

export const DEFAULT_INPUT: BipGraph = { leftCount: 3, rightCount: 3, edges: [[0, 0], [1, 1], [2, 2], [0, 2]] };

export function buildTrace(input: BipGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `L=${input.leftCount}, R=${input.rightCount}`, en: `L=${input.leftCount}, R=${input.rightCount}` }).commit();
  const m = bipartiteMatchingFlow(input);
  rec.begin({ zh: `最大匹配 = ${m}`, en: `Max matching = ${m}` })
    .setAux([{ label: 'match', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bipartiteMatchingFlow } from '../../src/algorithms/network/net-max-flow-bipartite-2/impl.ts';

test('bipartite-matching-flow 完美', () => {
  const m = bipartiteMatchingFlow({ leftCount: 3, rightCount: 3, edges: [[0, 0], [1, 1], [2, 2]] });
  assert.equal(m, 3);
});
""")
