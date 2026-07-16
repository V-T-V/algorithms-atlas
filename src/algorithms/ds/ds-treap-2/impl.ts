// =============================================================================
// Treap（树堆）
// =============================================================================

interface TreapNode {
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
}

export interface TreapHooks {
  onRotate?: (kind: 'left' | 'right', key: number) => void;
  onInsert?: (key: number, priority: number) => void;
  onDone?: (size: number) => void;
}

export class Treap2 {
  private root: TreapNode | null = null;
  private size = 0;
  private rngState = 998244353;
  constructor(private hooks: TreapHooks = {}) {}
  private rand(): number {
    this.rngState = (this.rngState * 1103515245 + 12345) & 0x7fffffff;
    return this.rngState;
  }
  private rotateRight(p: TreapNode): TreapNode {
    const q = p.left!;
    p.left = q.right;
    q.right = p;
    this.hooks.onRotate?.('right', q.key);
    return q;
  }
  private rotateLeft(p: TreapNode): TreapNode {
    const q = p.right!;
    p.right = q.left;
    q.left = p;
    this.hooks.onRotate?.('left', q.key);
    return q;
  }
  private insertNode(node: TreapNode | null, key: number, prio: number): TreapNode {
    if (node === null) return { key, priority: prio, left: null, right: null };
    if (key < node.key) {
      node.left = this.insertNode(node.left, key, prio);
      if (node.left!.priority > node.priority) node = this.rotateRight(node);
    } else if (key > node.key) {
      node.right = this.insertNode(node.right, key, prio);
      if (node.right!.priority > node.priority) node = this.rotateLeft(node);
    }
    return node;
  }
  insert(key: number): void {
    const prio = this.rand();
    this.hooks.onInsert?.(key, prio);
    this.root = this.insertNode(this.root, key, prio);
    this.size++;
  }
  contains(key: number): boolean {
    let cur = this.root;
    while (cur) {
      if (key === cur.key) return true;
      cur = key < cur.key ? cur.left : cur.right;
    }
    return false;
  }
  get count(): number {
    return this.size;
  }
  /** 中序遍历（升序）。 */
  toArray(): number[] {
    const out: number[] = [];
    const dfs = (n: TreapNode | null): void => {
      if (!n) return;
      dfs(n.left);
      out.push(n.key);
      dfs(n.right);
    };
    dfs(this.root);
    return out;
  }
}
