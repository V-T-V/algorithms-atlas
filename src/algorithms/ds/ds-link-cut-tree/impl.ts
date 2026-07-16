// =============================================================================
// Link-Cut Tree · 纯算法实现
// 维护一片森林，支持 link / cut / connected / findRoot。
// =============================================================================

export interface LctHooks {
  onAccess?: (u: number) => void;
  onMakeroot?: (u: number) => void;
  onLink?: (u: number, v: number) => void;
  onCut?: (u: number, v: number) => void;
  onSplay?: (u: number) => void;
}

interface LctNode {
  parent: number; // Splay 中的父，或虚边指向的原父
  children: [number, number]; // [left, right] 在 Splay 中；-1 表空
  rev: boolean; // 翻转标记
}

const NONE = -1;

export class LinkCutTree {
  private nodes: LctNode[];
  private hooks: LctHooks;

  constructor(n: number, hooks: LctHooks = {}) {
    this.hooks = hooks;
    this.nodes = Array.from({ length: n }, () => ({
      parent: NONE,
      children: [NONE, NONE],
      rev: false,
    }));
  }

  private isRoot(x: number): boolean {
    const p = this.nodes[x]!.parent;
    if (p === NONE) return true;
    return this.nodes[p]!.children[0] !== x && this.nodes[p]!.children[1] !== x;
  }

  private pushDown(x: number): void {
    if (!this.nodes[x]!.rev) return;
    const [l, r] = this.nodes[x]!.children;
    this.nodes[x]!.children = [r, l];
    if (l !== NONE) this.nodes[l]!.rev = !this.nodes[l]!.rev;
    if (r !== NONE) this.nodes[r]!.rev = !this.nodes[r]!.rev;
    this.nodes[x]!.rev = false;
  }

  private pushAll(x: number): void {
    const stack: number[] = [];
    let cur = x;
    while (!this.isRoot(cur)) {
      stack.push(cur);
      cur = this.nodes[cur]!.parent;
    }
    stack.push(cur);
    while (stack.length > 0) this.pushDown(stack.pop()!);
  }

  private rotate(x: number): void {
    const p = this.nodes[x]!.parent;
    const g = this.nodes[p]!.parent;
    const isRight = this.nodes[p]!.children[0] === x; // x 是 p 的左子 → 右旋
    const d: 0 | 1 = isRight ? 0 : 1; // x 在 p 的哪侧
    // 把 x 的「内侧子」挂到 p
    const child = this.nodes[x]!.children[1 - d]!;
    this.nodes[p]!.children[d] = child;
    if (child !== NONE) this.nodes[child]!.parent = p;
    // p 挂到 x
    this.nodes[x]!.children[1 - d] = p;
    this.nodes[p]!.parent = x;
    // x 接到 g
    this.nodes[x]!.parent = g;
    if (g !== NONE && (this.nodes[g]!.children[0] === p || this.nodes[g]!.children[1] === p)) {
      if (this.nodes[g]!.children[0] === p) this.nodes[g]!.children[0] = x;
      else this.nodes[g]!.children[1] = x;
    }
  }

  private splay(x: number): void {
    this.pushAll(x);
    while (!this.isRoot(x)) {
      const p = this.nodes[x]!.parent;
      const g = this.nodes[p]!.parent;
      if (!this.isRoot(p)) {
        const xIsLeft = this.nodes[p]!.children[0] === x;
        const pIsLeft = this.nodes[g]!.children[0] === p;
        if (xIsLeft === pIsLeft) this.rotate(p);
        else this.rotate(x);
      }
      this.rotate(x);
    }
    this.hooks.onSplay?.(x);
  }

  /** access(x)：把 x 到根的路径变为一条实链，x 成为所在 Splay 的最右节点。 */
  access(x: number): void {
    let last = NONE;
    let cur = x;
    while (cur !== NONE) {
      this.splay(cur);
      this.nodes[cur]!.children[1] = last; // 断开右子（原重链下段）
      if (last !== NONE) this.nodes[last]!.parent = cur;
      last = cur;
      cur = this.nodes[cur]!.parent; // 跳虚边
    }
    this.splay(x);
    this.hooks.onAccess?.(x);
  }

  /** makeroot(x)：把 x 变成所在树的根。 */
  makeroot(x: number): void {
    this.access(x);
    this.nodes[x]!.rev = !this.nodes[x]!.rev;
    this.hooks.onMakeroot?.(x);
  }

  /** findRoot(x)：返回 x 所在树的根。 */
  findRoot(x: number): number {
    this.access(x);
    let cur = x;
    while (this.nodes[cur]!.children[0] !== NONE) {
      this.pushDown(cur);
      cur = this.nodes[cur]!.children[0]!;
    }
    this.splay(cur);
    return cur;
  }

  /** connected(u,v)：u、v 是否在同一棵树。 */
  connected(u: number, v: number): boolean {
    if (u === v) return true;
    return this.findRoot(u) === this.findRoot(v);
  }

  /** link(u,v)：把 u（树根）连到 v。要求 u、v 原本不连通。 */
  link(u: number, v: number): boolean {
    if (this.connected(u, v)) return false;
    this.makeroot(u);
    this.nodes[u]!.parent = v; // 虚边
    this.hooks.onLink?.(u, v);
    return true;
  }

  /** cut(u,v)：断开边 u-v。要求该边存在。 */
  cut(u: number, v: number): boolean {
    if (!this.connected(u, v)) return false;
    this.makeroot(u);
    this.access(v);
    // 现在 v 的左子应为 u（u 是根，v 是其直连子）
    if (this.nodes[v]!.children[0] !== u) return false;
    this.nodes[v]!.children[0] = NONE;
    this.nodes[u]!.parent = NONE;
    this.hooks.onCut?.(u, v);
    return true;
  }
}
