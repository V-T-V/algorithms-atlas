// =============================================================================
// 并查集连通分量 · 纯算法实现
// 按秩合并 + 路径压缩。
// =============================================================================

export interface UfComponentHooks {
  onUnion?: (a: string, b: string, root: string) => void;
  onResult?: (count: number, rootOf: Map<string, string>) => void;
}

export class UnionFind {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();
  parts: number;

  constructor(nodes: readonly string[]) {
    for (const n of nodes) {
      this.parent.set(n, n);
      this.rank.set(n, 0);
    }
    this.parts = nodes.length;
  }

  find(x: string): string {
    const p = this.parent.get(x) ?? x;
    if (p !== x) {
      const root = this.find(p);
      this.parent.set(x, root); // 路径压缩
      return root;
    }
    return x;
  }

  union(a: string, b: string, hooks?: UfComponentHooks): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    const rankA = this.rank.get(ra) ?? 0;
    const rankB = this.rank.get(rb) ?? 0;
    let root: string;
    if (rankA < rankB) {
      this.parent.set(ra, rb);
      root = rb;
    } else if (rankA > rankB) {
      this.parent.set(rb, ra);
      root = ra;
    } else {
      this.parent.set(rb, ra);
      this.rank.set(ra, rankA + 1);
      root = ra;
    }
    this.parts--;
    hooks?.onUnion?.(a, b, root);
    return true;
  }

  rootMap(): Map<string, string> {
    const m = new Map<string, string>();
    for (const k of this.parent.keys()) m.set(k, this.find(k));
    return m;
  }
}

export function ufComponentCount(
  nodes: readonly string[],
  edges: ReadonlyArray<{ from: string; to: string }>,
  hooks: UfComponentHooks = {},
): number {
  const uf = new UnionFind(nodes);
  for (const e of edges) uf.union(e.from, e.to, hooks);
  hooks.onResult?.(uf.parts, uf.rootMap());
  return uf.parts;
}
