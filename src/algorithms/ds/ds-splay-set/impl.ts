// =============================================================================
// 伸展树（Splay Tree）集合 · 纯算法实现
// =============================================================================

export interface SplayHooks {
  onSplay?: (key: number) => void;
  onRotate?: (dir: 'zig-left' | 'zig-right') => void;
  onInsert?: (key: number) => void;
  onDelete?: (key: number) => void;
  onVisit?: (key: number) => void;
}

interface SplayNode {
  key: number;
  left: SplayNode | null;
  right: SplayNode | null;
}

export class SplaySet {
  private root: SplayNode | null = null;
  private count = 0;
  private hooks: SplayHooks;

  constructor(hooks: SplayHooks = {}) {
    this.hooks = hooks;
  }

  get size(): number {
    return this.count;
  }

  private rotateRight(y: SplayNode): SplayNode {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    return x;
  }

  private rotateLeft(x: SplayNode): SplayNode {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    return y;
  }

  /** 把键 key 的节点伸展到根（若存在）；否则把最后一个访问节点伸展到根。 */
  private splay(root: SplayNode, key: number): SplayNode {
    if (root === null) return root;
    const header: SplayNode = { key: 0, left: null, right: null };
    let leftMax = header;
    let rightMin = header;
    let t = root;
    while (true) {
      if (key < t.key) {
        if (t.left === null) break;
        if (key < t.left.key) {
          // zig-zig
          this.hooks.onRotate?.('zig-right');
          t = this.rotateRight(t);
          if (t.left === null) break;
        }
        rightMin.left = t;
        rightMin = t;
        t = t.left!;
        rightMin.left = null;
      } else if (key > t.key) {
        if (t.right === null) break;
        if (key > t.right.key) {
          this.hooks.onRotate?.('zig-left');
          t = this.rotateLeft(t);
          if (t.right === null) break;
        }
        leftMax.right = t;
        leftMax = t;
        t = t.right!;
        leftMax.right = null;
      } else {
        break;
      }
    }
    leftMax.right = t.left;
    rightMin.left = t.right;
    t.left = header.right;
    t.right = header.left;
    this.hooks.onSplay?.(key);
    return t;
  }

  search(key: number): boolean {
    if (this.root === null) return false;
    this.root = this.splay(this.root, key);
    return this.root.key === key;
  }

  insert(key: number): boolean {
    if (this.root === null) {
      this.root = { key, left: null, right: null };
      this.count++;
      this.hooks.onInsert?.(key);
      return true;
    }
    this.root = this.splay(this.root, key);
    if (this.root.key === key) return false; // 已存在
    const node: SplayNode = { key, left: null, right: null };
    if (key < this.root.key) {
      node.right = this.root;
      node.left = this.root.left;
      this.root.left = null;
    } else {
      node.left = this.root;
      node.right = this.root.right;
      this.root.right = null;
    }
    this.root = node;
    this.count++;
    this.hooks.onInsert?.(key);
    return true;
  }

  delete(key: number): boolean {
    if (this.root === null) return false;
    this.root = this.splay(this.root, key);
    if (this.root.key !== key) return false;
    this.hooks.onDelete?.(key);
    if (this.root.left === null) {
      this.root = this.root.right;
    } else {
      const rightSub = this.root.right;
      this.root = this.splay(this.root.left, key);
      this.root.right = rightSub;
    }
    this.count--;
    return true;
  }

  inorder(): number[] {
    const out: number[] = [];
    const rec = (n: SplayNode | null): void => {
      if (n === null) return;
      rec(n.left);
      this.hooks.onVisit?.(n.key);
      out.push(n.key);
      rec(n.right);
    };
    rec(this.root);
    return out;
  }
}
