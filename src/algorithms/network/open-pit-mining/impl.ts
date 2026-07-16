// =============================================================================
// 露天矿开采（最大权闭合子图）· 纯算法实现
// 1. 按列排列的块，每块有权重（收益-成本，可正可负）
// 2. 约束：挖某块必须挖上方块 -> 依赖边
// 3. s -> 正权块 cap=w；负权块 -> t cap=|w|
// 4. 最大权闭合 = ∑正权 - 最小割
// =============================================================================

export interface MineBlock {
  /** 块的扁平索引。 */
  idx: number;
  /** 所在列。 */
  col: number;
  /** 所在深度（0=地表，越大越深）。 */
  depth: number;
  /** 权重（收益 - 成本，可为负）。 */
  weight: number;
}

export interface MineInput {
  /** 列数。 */
  cols: number;
  /** 每列深度（块数）。 */
  depths: number[];
  /** 块权重，按列优先、深度从浅到深排列。 */
  weights: number[];
}

export interface MineResult {
  /** 最大利润。 */
  maxProfit: number;
  /** 最小割。 */
  minCut: number;
  /** 选中挖的块的扁平索引数组。 */
  mined: number[];
  /** 所有正权块权重之和。 */
  positiveSum: number;
}

export interface MineHooks {
  onBuildGraph?: (
    nodeCount: number,
    source: number,
    sink: number,
    edgeCount: number,
    positiveSum: number,
  ) => void;
  onAugment?: (totalFlow: number) => void;
  onDone?: (result: MineResult) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

const INF = 1e9;

/**
 * 解露天矿开采（最大权闭合子图）。
 *
 * @param input 矿体描述
 * @param hooks 钩子
 */
export function openPitMining(input: MineInput, hooks: MineHooks = {}): MineResult {
  const { cols, depths, weights } = input;
  const N = weights.length;
  if (N === 0) {
    const r: MineResult = { maxProfit: 0, minCut: 0, mined: [], positiveSum: 0 };
    hooks.onDone?.(r);
    return r;
  }

  // 每个块 -> 节点 0..N-1；s=N; t=N+1
  const s = N;
  const t = N + 1;
  const n = N + 2;

  // 计算 col/depth -> 扁平 idx 的映射
  // weights 按 [col0 d0,d1,...][col1 d0,d1,...] 排列
  const colStart: number[] = [0];
  for (let c = 0; c < cols - 1; c++) colStart.push(colStart[c]! + depths[c]!);
  const idxOf = (col: number, depth: number): number => colStart[col]! + depth;

  const g: Arc[][] = Array.from({ length: n }, () => []);
  let edgeCount = 0;
  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
    edgeCount++;
  };

  // —— 正权块 -> s→u cap=w；负权块 -> v→t cap=|w| ——
  let positiveSum = 0;
  for (let i = 0; i < N; i++) {
    const w = weights[i]!;
    if (w > 0) {
      addEdge(s, i, w);
      positiveSum += w;
    } else if (w < 0) {
      addEdge(i, t, -w);
    }
  }

  // —— 依赖边：挖块 (col, depth) 必须挖上方 (col, depth-1) ——
  // 即 u(深) -> v(浅) 容量 ∞，强制闭合
  for (let c = 0; c < cols; c++) {
    for (let d = 1; d < depths[c]!; d++) {
      const deeper = idxOf(c, d);
      const above = idxOf(c, d - 1);
      addEdge(deeper, above, INF);
    }
  }

  hooks.onBuildGraph?.(n, s, t, edgeCount, positiveSum);

  // —— Edmonds-Karp ——
  let maxFlow = 0;
  const bfsAugment = (): boolean => {
    const parent = new Array<number>(n).fill(-1);
    const parentArcIdx = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          parent[a.to] = u;
          parentArcIdx[a.to] = i;
          if (a.to === t) {
            // 找瓶颈
            let bottleneck = Infinity;
            let cur = t;
            while (cur !== s) {
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              if (arc.cap < bottleneck) bottleneck = arc.cap;
              cur = p;
            }
            // 推进
            cur = t;
            while (cur !== s) {
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              arc.cap -= bottleneck;
              g[cur]![arc.rev]!.cap += bottleneck;
              cur = p;
            }
            maxFlow += bottleneck;
            return true;
          }
          queue.push(a.to);
        }
      }
    }
    return false;
  };

  while (bfsAugment()) {
    hooks.onAugment?.(maxFlow);
  }

  // —— 最小割后，从 s BFS：可达 = 选中挖的块 ——
  const visited = new Array<boolean>(n).fill(false);
  visited[s] = true;
  const queue: number[] = [s];
  let head = 0;
  const mined: number[] = [];
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    if (u < N) mined.push(u);
    const arcs = g[u]!;
    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i]!;
      if (a.cap > 0 && !visited[a.to]) {
        visited[a.to] = true;
        queue.push(a.to);
      }
    }
  }

  const r: MineResult = {
    maxProfit: positiveSum - maxFlow,
    minCut: maxFlow,
    mined,
    positiveSum,
  };
  hooks.onDone?.(r);
  return r;
}
