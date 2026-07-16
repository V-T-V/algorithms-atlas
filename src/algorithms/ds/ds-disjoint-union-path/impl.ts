// =============================================================================
// 并查集（路径压缩）· 纯算法实现
// =============================================================================

export interface DsuPathHooks {
  onFind?: (x: number, root: number) => void;
  onUnion?: (rootA: number, rootB: number) => void;
  onCompress?: (x: number, root: number) => void;
}

export class DsuPath {
  parent: number[];
  /** 当前连通分量数。 */
  count: number;
  private hooks: DsuPathHooks;

  constructor(n: number, hooks: DsuPathHooks = {}) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.count = n;
    this.hooks = hooks;
  }

  /** 查找 x 的根，沿途路径压缩。 */
  find(x: number): number {
    const root = this.findRec(x);
    this.hooks.onFind?.(x, root);
    return root;
  }

  private findRec(x: number): number {
    const p = this.parent[x]!;
    if (p === x) return x;
    // 路径压缩：递归到根后把 x 直接挂根
    const root = this.findRec(p);
    if (this.parent[x] !== root) {
      this.parent[x] = root;
      this.hooks.onCompress?.(x, root);
    }
    return root;
  }

  /** 合并 x、y 所在集合。返回是否真正合并（先前不同集合）。 */
  union(x: number, y: number): boolean {
    const ra = this.find(x);
    const rb = this.find(y);
    if (ra === rb) return false;
    // 无按秩：直接把 ra 挂到 rb 下
    this.parent[ra] = rb;
    this.count--;
    this.hooks.onUnion?.(ra, rb);
    return true;
  }

  /** 判定 x、y 是否同集合。 */
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}
