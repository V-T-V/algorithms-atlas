// =============================================================================
// Stoer-Wagner 全局最小割（带合并记录）· 纯算法实现
// =============================================================================
export interface StoerWagner2Hooks {
  onPhase?: (a: number, b: number, cut: number) => void;
  onMerge?: (a: number, b: number) => void;
  onResult?: (minCut: number) => void;
}

export interface StoerWagner2Input {
  n: number;
  edges: Array<{ from: number; to: number; w: number }>;
}

export function stoerWagner2(input: StoerWagner2Input, hooks: StoerWagner2Hooks = {}): number {
  const { n } = input;
  if (n < 2) return 0;
  // 邻接矩阵； contracted[v]=true 表示已合并
  const W: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (const e of input.edges) {
    W[e.from]![e.to]! += e.w;
    W[e.to]![e.from]! += e.w;
  }
  const merged = new Array<boolean>(n).fill(false);
  let best = Infinity;

  for (let phase = 0; phase < n - 1; phase++) {
    // 在「未合并」节点上跑 maximum adjacency search
    const added = new Array<boolean>(n).fill(false);
    const wSum = new Array<number>(n).fill(0);
    let nodesLeft = 0;
    const live: number[] = [];
    for (let v = 0; v < n; v++)
      if (!merged[v]) {
        live.push(v);
        nodesLeft++;
      }
    if (nodesLeft < 2) break;
    let last = -1;
    let prev = -1;
    for (let it = 0; it < nodesLeft; it++) {
      // 选 wSum 最大的未加入节点
      let sel = -1;
      for (const v of live) {
        if (added[v]) continue;
        if (sel === -1 || wSum[v]! > wSum[sel]!) sel = v;
      }
      added[sel!] = true;
      prev = last;
      last = sel;
      for (const v of live) {
        if (!added[v]) wSum[v]! += W[sel!]![v]!;
      }
    }
    // 阶段割 = wSum[last]（最后加入节点与之前集合的总边权）
    const cut = wSum[last!]!;
    hooks.onPhase?.(prev!, last!, cut);
    if (cut < best) best = cut;
    // 合并 last -> prev：把 last 的边累加到 prev
    for (const v of live) {
      if (v === last || v === prev) continue;
      W[prev!]![v]! += W[last!]![v]!;
      W[v]![prev!]! += W[v]![last!]!;
    }
    merged[last!] = true;
    hooks.onMerge?.(prev!, last!);
  }
  hooks.onResult?.(best);
  return best;
}
