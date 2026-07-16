// =============================================================================
// 可持久化线段树（单点赋值 + 前缀和）
// 维护定义域 [0, M)，每个版本对应一个数组快照
// =============================================================================

interface PNode {
  sum: number;
  lc: number;
  rc: number;
}

export interface PersistSegHooks {
  onClone?: (oldId: number, newId: number) => void;
  onVersion?: (version: number, root: number) => void;
}

export class PersistSeg2 {
  private nodes: PNode[] = [{ sum: 0, lc: 0, rc: 0 }]; // index 0 为空节点
  private roots: number[] = [];
  constructor(
    public readonly M: number,
    private hooks: PersistSegHooks = {},
  ) {
    // 版本 0：空树
    this.roots.push(this.buildEmpty(0, M - 1));
    this.hooks.onVersion?.(0, this.roots[0]!);
  }
  private buildEmpty(l: number, r: number): number {
    const id = this.nodes.length;
    this.nodes.push({ sum: 0, lc: 0, rc: 0 });
    if (l === r) return id;
    const m = (l + r) >> 1;
    this.nodes[id]!.lc = this.buildEmpty(l, m);
    this.nodes[id]!.rc = this.buildEmpty(m + 1, r);
    return id;
  }
  private clone(src: number): number {
    const id = this.nodes.length;
    this.nodes.push({ ...this.nodes[src]! });
    this.hooks.onClone?.(src, id);
    return id;
  }
  /** 在最新版本基础上单点赋值 arr[pos] = val，返回新版本号。 */
  update(pos: number, val: number): number {
    const prevRoot = this.roots[this.roots.length - 1]!;
    const newRoot = this.updateRec(this.clone(prevRoot), 0, this.M - 1, pos, val);
    const version = this.roots.length;
    this.roots.push(newRoot);
    this.hooks.onVersion?.(version, newRoot);
    return version;
  }
  private updateRec(node: number, l: number, r: number, pos: number, val: number): number {
    if (l === r) {
      this.nodes[node]!.sum = val;
      return node;
    }
    const m = (l + r) >> 1;
    if (pos <= m) {
      const oldLc = this.nodes[node]!.lc;
      this.nodes[node]!.lc = this.updateRec(this.clone(oldLc), l, m, pos, val);
    } else {
      const oldRc = this.nodes[node]!.rc;
      this.nodes[node]!.rc = this.updateRec(this.clone(oldRc), m + 1, r, pos, val);
    }
    const lc = this.nodes[node]!.lc;
    const rc = this.nodes[node]!.rc;
    this.nodes[node]!.sum = this.nodes[lc]!.sum + this.nodes[rc]!.sum;
    return node;
  }
  /** 在版本 v 上查 [0, p] 的前缀和。 */
  prefix(version: number, p: number): number {
    if (version < 0 || version >= this.roots.length) return 0;
    return this.queryRec(this.roots[version]!, 0, this.M - 1, 0, p);
  }
  private queryRec(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql || node === 0) return 0;
    if (ql <= l && r <= qr) return this.nodes[node]!.sum;
    const m = (l + r) >> 1;
    return (
      this.queryRec(this.nodes[node]!.lc, l, m, ql, qr) +
      this.queryRec(this.nodes[node]!.rc, m + 1, r, ql, qr)
    );
  }
  get versionCount(): number {
    return this.roots.length;
  }
  get nodeCount(): number {
    return this.nodes.length;
  }
}
