// =============================================================================
// 相似字符串组 · 纯算法实现（并查集）
// =============================================================================

export interface SimilarGroupsHooks {
  onPair?: (i: number, j: number, similar: boolean) => void;
  onResult?: (groups: number) => void;
}

class IntUF {
  parent: number[];
  rank: number[];
  parts: number;
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
    this.parts = n;
  }
  find(x: number): number {
    if (this.parent[x]! !== x) this.parent[x] = this.find(this.parent[x]!);
    return this.parent[x]!;
  }
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra]! < this.rank[rb]!) this.parent[ra] = rb;
    else if (this.rank[ra]! > this.rank[rb]!) this.parent[rb] = ra;
    else {
      this.parent[rb] = ra;
      this.rank[ra]!++;
    }
    this.parts--;
    return true;
  }
}

function isSimilar(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff++;
      if (diff > 2) return false;
    }
  }
  return true;
}

export function numSimilarGroups(strs: string[], hooks: SimilarGroupsHooks = {}): number {
  const n = strs.length;
  const uf = new IntUF(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sim = isSimilar(strs[i]!, strs[j]!);
      hooks.onPair?.(i, j, sim);
      if (sim) uf.union(i, j);
    }
  }
  hooks.onResult?.(uf.parts);
  return uf.parts;
}
