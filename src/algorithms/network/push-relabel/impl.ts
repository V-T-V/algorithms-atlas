// =============================================================================
// 预流推进最大流（Push-Relabel）· 纯算法实现
// 高度标号 + 推送/重标，带「当前弧」优化。零 DOM 依赖，可独立单测。
// 节点用 0..n-1 的整数下标表示。
// =============================================================================

export interface PushRelabelEdgeInput {
  from: number;
  to: number;
  cap: number;
}

/** 事件钩子。 */
export interface PushRelabelHooks {
  /** 饱和/非饱和推送：从 u 推送 flow 到 v，给出推送后两点的超额流。 */
  onPush?: (u: number, v: number, flow: number, excessU: number, excessV: number) => void;
  /** 节点 u 被重标号：旧高度 → 新高度。 */
  onRelabel?: (u: number, oldH: number, newH: number) => void;
  /** 进入节点 u 进行处理（被选中为有超额流的非源汇节点）。 */
  onDischarge?: (u: number, excess: number, height: number) => void;
  /** 算法结束，给出最大流。 */
  onDone?: (maxFlow: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/**
 * 预流推进最大流（Goldberg-Tarjan，含当前弧优化）。
 *
 * @param n 节点数（0..n-1）
 * @param edges 边 {from, to, cap}
 * @param s 源
 * @param t 汇
 * @param hooks 可选钩子
 * @returns 最大流值
 */
export function pushRelabel(
  n: number,
  edges: readonly PushRelabelEdgeInput[],
  s: number,
  t: number,
  hooks: PushRelabelHooks = {},
): number {
  if (n <= 0 || s === t) {
    hooks.onDone?.(0);
    return 0;
  }

  const g: Arc[][] = Array.from({ length: n }, () => []);
  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
  };
  for (const e of edges) {
    if (e.cap > 0) addEdge(e.from, e.to, e.cap);
  }

  const height = new Array<number>(n).fill(0);
  const excess = new Array<number>(n).fill(0);
  const cur = new Array<number>(n).fill(0);

  height[s] = n;
  // 把源点的出边饱和推送，建立预流
  const sArcs = g[s]!;
  for (let i = 0; i < sArcs.length; i++) {
    const a = sArcs[i]!;
    const flow = a.cap;
    if (flow > 0) {
      a.cap -= flow;
      g[a.to]![a.rev]!.cap += flow;
      excess[s] = (excess[s] ?? 0) - flow;
      excess[a.to] = (excess[a.to] ?? 0) + flow;
      hooks.onPush?.(s, a.to, flow, excess[s]!, excess[a.to]!);
    }
  }

  // 对节点 u 做一次 discharge：处理直到它的超额流为 0
  const discharge = (u: number): void => {
    hooks.onDischarge?.(u, excess[u]!, height[u]!);
    while (excess[u]! > 0) {
      const arcs = g[u]!;
      const i = cur[u]!;
      if (i < arcs.length) {
        const a = arcs[i]!;
        if (a.cap > 0 && height[u]! === height[a.to]! + 1) {
          // PUSH
          const flow = Math.min(excess[u]!, a.cap);
          a.cap -= flow;
          g[a.to]![a.rev]!.cap += flow;
          excess[u] = (excess[u] ?? 0) - flow;
          excess[a.to] = (excess[a.to] ?? 0) + flow;
          hooks.onPush?.(u, a.to, flow, excess[u]!, excess[a.to]!);
        } else {
          cur[u] = cur[u]! + 1;
        }
      } else {
        // RELABEL：所有邻居扫描完，提高高度
        let minH = Infinity;
        for (let k = 0; k < arcs.length; k++) {
          const a = arcs[k]!;
          if (a.cap > 0 && height[a.to]! < minH) minH = height[a.to]!;
        }
        const oldH = height[u]!;
        const newH = minH + 1;
        height[u] = newH;
        cur[u] = 0;
        hooks.onRelabel?.(u, oldH, newH);
      }
    }
  };

  // 主循环：反复扫描所有非源汇节点；用「重标号次数上限」防退化
  // 经典 FIFO 选择，这里用简单循环直到收敛
  let changed = true;
  let guard = 0;
  const limit = n * n * (n + 2) + 100;
  while (changed && guard++ < limit) {
    changed = false;
    for (let u = 0; u < n; u++) {
      if (u === s || u === t) continue;
      if (excess[u]! > 0) {
        const before = excess[u]!;
        const hBefore = height[u]!;
        discharge(u);
        if (excess[u]! !== before || height[u]! !== hBefore) changed = true;
      }
    }
  }

  const maxFlow = excess[t]!;
  hooks.onDone?.(maxFlow);
  return maxFlow;
}
