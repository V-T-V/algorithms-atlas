// =============================================================================
// 可撤销 Kruskal（Rollback Union-Find）
// 并查集按秩合并、不路径压缩，记录操作栈以支持回退。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface RollbackDsuHooks {
  onMerge?: (u: string, v: string, weight: number) => void;
  onSkip?: (u: string, v: string, weight: number) => void;
  onRollback?: (steps: number) => void;
  onResult?: (
    totalWeight: number,
    edges: Array<{ from: string; to: string; weight: number }>,
  ) => void;
}

export interface KruskalRollbackResult {
  totalWeight: number;
  mstEdges: Array<{ from: string; to: string; weight: number }>;
}

/** 可撤销并查集（按秩合并，无路径压缩）。 */
export class RollbackDsu {
  private parent: Map<string, string>;
  private rank: Map<string, number>;
  private log: Array<{ who: string; prevParent: string; loser: string; prevRankWinner: number }>;

  constructor(nodes: readonly string[]) {
    this.parent = new Map();
    this.rank = new Map();
    this.log = [];
    for (const n of nodes) {
      this.parent.set(n, n);
      this.rank.set(n, 0);
    }
  }

  find(x: string): string {
    let cur = x;
    while (this.parent.get(cur) !== cur) cur = this.parent.get(cur)!;
    return cur;
  }

  /** 合并 u,v；返回是否真的合并了。 */
  union(u: string, v: string): boolean {
    const ru = this.find(u);
    const rv = this.find(v);
    if (ru === rv) return false;
    const rankU = this.rank.get(ru) ?? 0;
    const rankV = this.rank.get(rv) ?? 0;
    if (rankU < rankV) {
      this.log.push({ who: ru, prevParent: ru, loser: ru, prevRankWinner: rankV });
      this.parent.set(ru, rv);
    } else {
      this.log.push({ who: rv, prevParent: rv, loser: rv, prevRankWinner: rankU });
      this.parent.set(rv, ru);
      if (rankU === rankV) this.rank.set(ru, rankU + 1);
    }
    return true;
  }

  /** 回退到 checkpoint 之前的状态。返回实际回退步数。 */
  rollback(checkpoint: number): number {
    const target = Math.max(0, checkpoint);
    let steps = 0;
    while (this.log.length > target) {
      const op = this.log.pop()!;
      this.parent.set(op.loser, op.prevParent);
      // 恢复 rank：若当时是因为相等而 +1，则减回
      const winner = this.find(op.loser) === op.loser ? op.loser : this.find(op.loser);
      const winnerRank = this.rank.get(winner) ?? 0;
      // 简化：把 winner 的 rank 还原到记录值（prevRankWinner 为合并时 winner 的旧 rank）
      this.rank.set(winner, op.prevRankWinner);
      void winnerRank;
      steps++;
    }
    return steps;
  }

  /** 当前操作栈大小（用作 checkpoint）。 */
  checkpoint(): number {
    return this.log.length;
  }
}

export function kruskalRollback(
  input: GraphInput,
  hooks: RollbackDsuHooks = {},
): KruskalRollbackResult {
  const { nodes, edges } = input;
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);

  const dsu = new RollbackDsu(nodes);
  const mst: Array<{ from: string; to: string; weight: number }> = [];
  let total = 0;

  for (const e of sorted) {
    if (dsu.find(e.from) !== dsu.find(e.to)) {
      dsu.union(e.from, e.to);
      mst.push(e);
      total += e.weight;
      hooks.onMerge?.(e.from, e.to, e.weight);
    } else {
      hooks.onSkip?.(e.from, e.to, e.weight);
    }
  }

  // 演示撤销能力：回退最后一步合并
  const cp = dsu.checkpoint();
  void cp;
  const beforeRollback = dsu.checkpoint();
  if (beforeRollback > 0) {
    const steps = dsu.rollback(beforeRollback - 1);
    hooks.onRollback?.(steps);
    // 重新合并（恢复 MST 正确性）
    if (mst.length > 0) {
      const last = mst[mst.length - 1]!;
      dsu.union(last.from, last.to);
    }
  }

  hooks.onResult?.(total, mst);
  return { totalWeight: total, mstEdges: mst };
}
