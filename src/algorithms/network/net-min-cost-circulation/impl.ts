// =============================================================================
// 最小费用环流（消圈算法）· 纯算法实现
// 教学：从「每条边流满」的初始环流出发，用 SPFA 找负费用环并增广。
// 注意：满流不一定满足环流守恒；这里仅在每点守恒的「初始环流」上工作。
// 输入要求：edges 应满足 sum_in == sum_out per vertex（已是环流）。
// =============================================================================
export interface MinCostCirculationHooks {
  onNegativeCycle?: (cycle: number[], gain: number) => void;
  onResult?: (totalCost: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  cost: number;
  rev: number;
}

export interface CirculationInput {
  n: number;
  edges: Array<{ from: number; to: number; cap: number; cost: number }>;
}

export function minCostCirculation(
  input: CirculationInput,
  hooks: MinCostCirculationHooks = {},
): number {
  const { n } = input;
  const adj: Arc[][] = Array.from({ length: n }, () => []);
  for (const e of input.edges) {
    adj[e.from]!.push({ to: e.to, cap: e.cap, cost: e.cost, rev: adj[e.to]!.length });
    adj[e.to]!.push({ to: e.from, cap: 0, cost: -e.cost, rev: adj[e.from]!.length - 1 });
  }

  const totalCost = (): number => {
    let s = 0;
    for (let u = 0; u < n; u++) {
      for (let i = 0; i < adj[u]!.length; i++) {
        const a = adj[u]![i]!;
        // 只统计「前向」边（即原输入方向，cap 残量 < 原始 cap 表示已用）
        // 这里用 cost>0 作为前向边启发（教学）
        if (a.cost > 0) {
          const rev = adj[a.to]![a.rev]!;
          s += rev.cap * a.cost; // rev.cap = 已用流量
        }
      }
    }
    return s;
  };

  // SPFA 找负费用环
  const findNegCycle = (): number[] | null => {
    const dist = new Array<number>(n).fill(0);
    const prev = new Array<number>(n).fill(-1);
    const prevArc = new Array<number>(n).fill(-1);
    const inQueue = new Array<boolean>(n).fill(true);
    const cnt = new Array<number>(n).fill(0);
    const queue: number[] = [];
    for (let v = 0; v < n; v++) queue.push(v);
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++]!;
      inQueue[u] = false;
      for (let i = 0; i < adj[u]!.length; i++) {
        const a = adj[u]![i]!;
        if (a.cap > 0 && dist[u]! + a.cost < dist[a.to]!) {
          dist[a.to] = dist[u]! + a.cost;
          prev[a.to] = u;
          prevArc[a.to] = i;
          cnt[a.to] = cnt[u]! + 1;
          if (cnt[a.to]! >= n) {
            // 出现负环：从 a.to 回溯
            const cycle: number[] = [];
            let cur = a.to;
            const seen = new Set<number>();
            while (!seen.has(cur)) {
              seen.add(cur);
              cycle.push(cur);
              cur = prev[cur]!;
            }
            cycle.push(cur);
            cycle.reverse();
            // 截取从 cur 开始的环
            const start = cycle.indexOf(cur, 1);
            return start >= 0 ? cycle.slice(start) : cycle;
          }
          if (!inQueue[a.to]) {
            inQueue[a.to] = true;
            queue.push(a.to);
          }
        }
      }
    }
    return null;
  };

  let iter = 0;
  while (iter < 1000) {
    iter++;
    const cycle = findNegCycle();
    if (!cycle) break;
    // 找环上最小残量
    let minCap = Infinity;
    let costGain = 0;
    for (let i = 0; i + 1 < cycle.length; i++) {
      const u = cycle[i]!;
      const v = cycle[i + 1]!;
      const ai = adj[u]!.findIndex((a) => a.to === v && a.cap > 0);
      if (ai < 0) {
        minCap = 0;
        break;
      }
      minCap = Math.min(minCap, adj[u]![ai]!.cap);
      costGain += adj[u]![ai]!.cost;
    }
    if (minCap <= 0) break;
    hooks.onNegativeCycle?.([...cycle], costGain * minCap);
    // 增广
    for (let i = 0; i + 1 < cycle.length; i++) {
      const u = cycle[i]!;
      const v = cycle[i + 1]!;
      const ai = adj[u]!.findIndex((a) => a.to === v && a.cap > 0);
      adj[u]![ai]!.cap -= minCap;
      adj[v]![adj[u]![ai]!.rev]!.cap += minCap;
    }
  }
  const cost = totalCost();
  hooks.onResult?.(cost);
  return cost;
}
