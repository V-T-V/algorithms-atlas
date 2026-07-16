// =============================================================================
// 区间调度转网络流 · 纯算法实现
// 1. 构造链式流网络
// 2. 调用 BFS 增广（Edmonds-Karp）求最大流
// =============================================================================

export interface IntervalInput {
  /** 区间 [start, end)。 */
  start: number;
  end: number;
}

export interface IsnEdge {
  from: number;
  to: number;
  cap: number;
  /** 该边对应的区间索引（若是区间边）；否则 -1。 */
  intervalIdx: number;
  /** 类型：'chain'（链边）| 'interval'（区间边）| 'aux'（源汇边）。 */
  type: 'chain' | 'interval' | 'aux';
}

export interface IsnHooks {
  onBuildNetwork?: (edges: IsnEdge[], nodeCount: number, source: number, sink: number) => void;
  onAugment?: (
    path: number[],
    flow: number,
    totalFlow: number,
    selectedIntervals: number[],
  ) => void;
  onDone?: (maxSelected: number, selectedIntervals: number[]) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
  intervalIdx: number;
}

/**
 * 用最大流求区间调度的最大选择数。
 *
 * @param intervals 区间数组 [start, end)
 * @param k 每时刻最多选 k 个
 * @param hooks 钩子
 * @returns 选中区间的索引数组
 */
export function intervalScheduling(
  intervals: readonly IntervalInput[],
  k: number,
  hooks: IsnHooks = {},
): number[] {
  if (intervals.length === 0) {
    hooks.onDone?.(0, []);
    return [];
  }

  // 收集所有端点
  const points = new Set<number>();
  for (const it of intervals) {
    points.add(it.start);
    points.add(it.end);
  }
  const sorted = Array.from(points).sort((a, b) => a - b);
  // 时间点 -> 节点 id（0..m-1）
  const pointIdx = new Map<number, number>();
  sorted.forEach((p, i) => pointIdx.set(p, i));
  const m = sorted.length;
  // 节点编号：0..m-1 是时间点；s = m; t = m+1
  const s = m;
  const t = m + 1;
  const n = m + 2;

  const isnEdges: IsnEdge[] = [];
  isnEdges.push({ from: s, to: 0, cap: Infinity, intervalIdx: -1, type: 'aux' });
  for (let i = 0; i + 1 < m; i++) {
    isnEdges.push({ from: i, to: i + 1, cap: k, intervalIdx: -1, type: 'chain' });
  }
  isnEdges.push({ from: m - 1, to: t, cap: Infinity, intervalIdx: -1, type: 'aux' });
  intervals.forEach((it, i) => {
    const u = pointIdx.get(it.start)!;
    const v = pointIdx.get(it.end)!;
    isnEdges.push({ from: u, to: v, cap: 1, intervalIdx: i, type: 'interval' });
  });

  hooks.onBuildNetwork?.(isnEdges, n, s, t);

  // 构造残量网络
  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number, intervalIdx: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length, intervalIdx });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1, intervalIdx });
  };
  for (const e of isnEdges) {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap, e.intervalIdx);
  }

  // BFS 增广
  let maxFlow = 0;
  const selected: number[] = [];

  const bfsAugment = (): { path: number[]; flow: number; intervals: number[] } | null => {
    const parent = new Array<number>(n).fill(-1);
    const parentArcIdx = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      for (let i = 0; i < g[u]!.length; i++) {
        const a = g[u]![i]!;
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          parent[a.to] = u;
          parentArcIdx[a.to] = i;
          if (a.to === t) {
            // 重建路径
            const path: number[] = [];
            const intervals: number[] = [];
            let cur = t;
            let bottleneck = Infinity;
            while (cur !== s) {
              path.unshift(cur);
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              if (arc.cap < bottleneck) bottleneck = arc.cap;
              if (arc.intervalIdx >= 0) intervals.push(arc.intervalIdx);
              cur = p;
            }
            path.unshift(s);
            // 推进
            cur = t;
            while (cur !== s) {
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              arc.cap -= bottleneck;
              g[cur]![arc.rev]!.cap += bottleneck;
              cur = p;
            }
            return { path, flow: bottleneck, intervals };
          }
          queue.push(a.to);
        }
      }
    }
    return null;
  };

  for (;;) {
    const found = bfsAugment();
    if (!found) break;
    maxFlow += found.flow;
    selected.push(...found.intervals);
    hooks.onAugment?.(found.path, found.flow, maxFlow, [...selected]);
  }

  hooks.onDone?.(maxFlow, selected);
  return selected;
}

/** 贪心参考解：按结束时间排序，用计数维护每时刻占用。 */
export function greedyReference(intervals: readonly IntervalInput[], k: number): number {
  const sorted = intervals
    .map((it, i) => ({ ...it, i }))
    .sort((a, b) => a.end - b.end || a.start - b.start);
  // 简化：用「活跃区间数」判断（小规模）
  // 这里只对 k=1 给出标准贪心；k>1 用流解
  if (k !== 1) return -1; // 信号：调用方应改用流解
  let count = 0;
  let lastEnd = -Infinity;
  for (const it of sorted) {
    if (it.start >= lastEnd) {
      count++;
      lastEnd = it.end;
    }
  }
  return count;
}
