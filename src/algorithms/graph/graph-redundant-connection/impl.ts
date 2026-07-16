// =============================================================================
// 冗余连接 · 纯算法实现（并查集）
// =============================================================================

export interface RedundantConnectionHooks {
  onUnion?: (a: number, b: number) => void;
  onCycle?: (a: number, b: number) => void;
  onResult?: (edge: [number, number]) => void;
}

class UF {
  parent: Map<number, number> = new Map();
  rank: Map<number, number> = new Map();
  find(x: number): number {
    if ((this.parent.get(x) ?? x) === x) return x;
    const r = this.find(this.parent.get(x) ?? x);
    this.parent.set(x, r);
    return r;
  }
  make(x: number): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    const raRank = this.rank.get(ra) ?? 0;
    const rbRank = this.rank.get(rb) ?? 0;
    if (raRank < rbRank) this.parent.set(ra, rb);
    else if (raRank > rbRank) this.parent.set(rb, ra);
    else {
      this.parent.set(rb, ra);
      this.rank.set(ra, raRank + 1);
    }
    return true;
  }
}

export function findRedundantConnection(
  edges: ReadonlyArray<[number, number]>,
  hooks: RedundantConnectionHooks = {},
): [number, number] {
  const uf = new UF();
  for (const e of edges) {
    uf.make(e[0]);
    uf.make(e[1]);
    if (!uf.union(e[0], e[1])) {
      hooks.onCycle?.(e[0], e[1]);
      hooks.onResult?.(e);
      return e;
    }
    hooks.onUnion?.(e[0], e[1]);
  }
  // 不应到达（题目保证有环）
  hooks.onResult?.([-1, -1]);
  return [-1, -1];
}
