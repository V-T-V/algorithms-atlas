export interface UFHooks {
  onUnion?: (a: string, b: string) => void;
  onFind?: (root: string) => void;
}
export class UnionFind {
  parent: Map<string, string> = new Map();
  rank: Map<string, number> = new Map();
  constructor(ns: string[]) {
    for (const n of ns) {
      this.parent.set(n, n);
      this.rank.set(n, 0);
    }
  }
  find(x: string, hooks?: UFHooks): string {
    const p = this.parent.get(x)!;
    if (p === x) return x;
    const r = this.find(p, hooks);
    this.parent.set(x, r);
    hooks?.onFind?.(r);
    return r;
  }
  union(a: string, b: string, hooks: UFHooks = {}): boolean {
    const ra = this.find(a, hooks),
      rb = this.find(b, hooks);
    if (ra === rb) return false;
    const ra2 = this.rank.get(ra)!,
      rb2 = this.rank.get(rb)!;
    if (ra2 < rb2) this.parent.set(ra, rb);
    else if (ra2 > rb2) this.parent.set(rb, ra);
    else {
      this.parent.set(rb, ra);
      this.rank.set(ra, ra2 + 1);
    }
    hooks.onUnion?.(a, b);
    return true;
  }
  count(): number {
    const roots = new Set<string>();
    for (const n of this.parent.keys()) roots.add(this.find(n));
    return roots.size;
  }
}
