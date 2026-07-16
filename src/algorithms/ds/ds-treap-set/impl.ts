// =============================================================================
// Treap（随机化平衡 BST 集合）· 纯算法实现
// =============================================================================

export interface TreapHooks {
  onRotate?: (dir: 'left' | 'right', key: number) => void;
  onInsert?: (key: number, prio: number) => void;
  onDelete?: (key: number) => void;
  onVisit?: (key: number) => void;
}

interface TreapNode {
  key: number;
  prio: number; // 随机优先级，大根堆
  left: TreapNode | null;
  right: TreapNode | null;
}

export class TreapSet {
  private root: TreapNode | null = null;
  private count = 0;
  private hooks: TreapHooks;

  constructor(hooks: TreapHooks = {}) {
    this.hooks = hooks;
  }

  get size(): number {
    return this.count;
  }

  private randomPrio(): number {
    return Math.floor(Math.random() * 0x100000000);
  }

  search(key: number): boolean {
    let cur = this.root;
    while (cur !== null) {
      if (key === cur.key) return true;
      cur = key < cur.key ? cur.left : cur.right;
    }
    return false;
  }

  insert(key: number): boolean {
    const before = this.count;
    this.root = this.insertRec(this.root, key);
    return this.count > before;
  }

  private insertRec(node: TreapNode | null, key: number): TreapNode {
    if (node === null) {
      this.count++;
      const prio = this.randomPrio();
      this.hooks.onInsert?.(key, prio);
      return { key, prio, left: null, right: null };
    }
    if (key < node.key) {
      node.left = this.insertRec(node.left, key);
      if (node.left!.prio > node.prio) {
        this.hooks.onRotate?.('right', key);
        return this.rotateRight(node);
      }
    } else if (key > node.key) {
      node.right = this.insertRec(node.right, key);
      if (node.right!.prio > node.prio) {
        this.hooks.onRotate?.('left', key);
        return this.rotateLeft(node);
      }
    }
    return node;
  }

  delete(key: number): boolean {
    const before = this.count;
    this.root = this.deleteRec(this.root, key);
    return this.count < before;
  }

  private deleteRec(node: TreapNode | null, key: number): TreapNode | null {
    if (node === null) return null;
    if (key < node.key) {
      node.left = this.deleteRec(node.left, key);
      return node;
    }
    if (key > node.key) {
      node.right = this.deleteRec(node.right, key);
      return node;
    }
    // 找到目标
    this.hooks.onDelete?.(key);
    if (node.left === null) {
      this.count--;
      return node.right;
    }
    if (node.right === null) {
      this.count--;
      return node.left;
    }
    // 两子都非空：把优先级较小的子节点旋转上来
    if (node.left.prio > node.right.prio) {
      node = this.rotateRight(node);
      node.right = this.deleteRec(node.right, key);
    } else {
      node = this.rotateLeft(node);
      node.left = this.deleteRec(node.left, key);
    }
    return node;
  }

  private rotateRight(y: TreapNode): TreapNode {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    return x;
  }

  private rotateLeft(x: TreapNode): TreapNode {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    return y;
  }

  /** 中序遍历（升序）。 */
  inorder(): number[] {
    const out: number[] = [];
    const rec = (n: TreapNode | null): void => {
      if (n === null) return;
      rec(n.left);
      this.hooks.onVisit?.(n.key);
      out.push(n.key);
      rec(n.right);
    };
    rec(this.root);
    return out;
  }

  /** 最小值。 */
  min(): number | undefined {
    if (this.root === null) return undefined;
    let cur = this.root;
    while (cur.left !== null) cur = cur.left;
    return cur.key;
  }

  /** 最大值。 */
  max(): number | undefined {
    if (this.root === null) return undefined;
    let cur = this.root;
    while (cur.right !== null) cur = cur.right;
    return cur.key;
  }
}
