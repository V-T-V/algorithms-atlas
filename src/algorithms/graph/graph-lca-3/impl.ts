// =============================================================================
// LCA 倍增
// =============================================================================

export interface TreeInput {
  /** 节点 id */
  nodes: readonly string[];
  /** 父子边：from=父，to=子；根的父为 null */
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

export interface LcaHooks {
  onDepth?: (u: string, depth: number) => void;
  onLift?: (u: string, ancestor: string, k: number) => void;
  onQuery?: (u: string, v: string, lca: string) => void;
  onDone?: () => void;
}

export class LCA {
  private readonly up: Map<string, string[]>;
  private readonly depth: Map<string, number>;
  private readonly LOG: number;
  constructor(input: TreeInput, hooks: LcaHooks = {}) {
    const adj = new Map<string, string[]>();
    for (const n of input.nodes) adj.set(n, []);
    for (const e of input.edges) adj.get(e.from)?.push(e.to);
    this.depth = new Map<string, number>();
    this.up = new Map<string, string[]>();
    this.LOG = Math.max(1, Math.ceil(Math.log2(Math.max(1, input.nodes.length))));
    // BFS 计算深度
    const queue: string[] = [input.root];
    this.depth.set(input.root, 0);
    this.up.set(input.root, [input.root, input.root]);
    hooks.onDepth?.(input.root, 0);
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of adj.get(u) ?? []) {
        this.depth.set(v, this.depth.get(u)! + 1);
        this.up.set(v, [u]);
        hooks.onDepth?.(v, this.depth.get(v)!);
        queue.push(v);
      }
    }
    // 倍增表
    for (let k = 1; k <= this.LOG; k++) {
      for (const v of input.nodes) {
        const prev = this.up.get(v)?.[k - 1]!;
        const grand = this.up.get(prev)?.[k - 1] ?? prev;
        this.up.get(v)!.push(grand);
        hooks.onLift?.(v, grand, k);
      }
    }
    hooks.onDone?.();
  }
  query(u: string, v: string, hooks?: LcaHooks): string {
    let a = u;
    let b = v;
    if ((this.depth.get(a) ?? 0) < (this.depth.get(b) ?? 0)) {
      const t = a;
      a = b;
      b = t;
    }
    const da = this.depth.get(a)!;
    const db = this.depth.get(b)!;
    const diff = da - db;
    for (let k = 0; k <= this.LOG; k++) {
      if ((diff >> k) & 1) a = this.up.get(a)![k]!;
    }
    if (a === b) {
      hooks?.onQuery?.(u, v, a);
      return a;
    }
    for (let k = this.LOG; k >= 0; k--) {
      if (this.up.get(a)![k] !== this.up.get(b)![k]) {
        a = this.up.get(a)![k]!;
        b = this.up.get(b)![k]!;
      }
    }
    const lca = this.up.get(a)![0]!;
    hooks?.onQuery?.(u, v, lca);
    return lca;
  }
}
