// =============================================================================
// Splay 树（伸展树）
// =============================================================================

interface SplayNode {
  key: number;
  left: SplayNode | null;
  right: SplayNode | null;
  parent: SplayNode | null;
}

export interface SplayHooks {
  onSplay?: (key: number) => void;
  onAccess?: (key: number) => void;
  onDone?: (size: number) => void;
}

export class SplayTree2 {
  private root: SplayNode | null = null;
  private size = 0;
  constructor(private hooks: SplayHooks = {}) {}

  private rotate(p: SplayNode): void {
    const q = p.parent!;
    if (q.left === p) {
      q.left = p.right;
      if (p.right) p.right.parent = q;
      p.right = q;
    } else {
      q.right = p.left;
      if (p.left) p.left.parent = q;
      p.left = q;
    }
    p.parent = q.parent;
    if (q.parent) {
      if (q.parent.left === q) q.parent.left = p;
      else q.parent.right = p;
    } else {
      this.root = p;
    }
    q.parent = p;
  }

  private splay(node: SplayNode): void {
    while (node.parent) {
      const p = node.parent;
      const g = p.parent;
      if (!g) {
        this.rotate(node);
      } else if ((g.left === p) === (p.left === node)) {
        // zig-zig
        this.rotate(p);
        this.rotate(node);
      } else {
        // zig-zag
        this.rotate(node);
        this.rotate(node);
      }
    }
    this.hooks.onSplay?.(node.key);
  }

  insert(key: number): void {
    if (!this.root) {
      this.root = { key, left: null, right: null, parent: null };
      this.size++;
      return;
    }
    let cur: SplayNode | null = this.root;
    let parent: SplayNode | null = null;
    while (cur) {
      parent = cur;
      cur = key < cur.key ? cur.left : cur.right;
      if (key === parent.key) {
        this.splay(parent);
        return;
      }
    }
    const node: SplayNode = { key, left: null, right: null, parent };
    if (key < parent!.key) parent!.left = node;
    else parent!.right = node;
    this.size++;
    this.splay(node);
  }

  contains(key: number): boolean {
    let cur = this.root;
    let last: SplayNode | null = null;
    while (cur) {
      last = cur;
      if (key === cur.key) {
        this.splay(cur);
        return true;
      }
      cur = key < cur.key ? cur.left : cur.right;
    }
    if (last) this.splay(last);
    return false;
  }

  get count(): number {
    return this.size;
  }

  toArray(): number[] {
    const out: number[] = [];
    const dfs = (n: SplayNode | null): void => {
      if (!n) return;
      dfs(n.left);
      out.push(n.key);
      dfs(n.right);
    };
    dfs(this.root);
    return out;
  }
}
