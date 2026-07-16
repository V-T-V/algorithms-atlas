// =============================================================================
// Treap（笛卡尔树搜索树）
// =============================================================================

export interface TreapNode {
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
}

export interface TreapHooks {
  onRotate?: (type: 'LEFT' | 'RIGHT', pivot: number) => void;
  onInsert?: (key: number, priority: number) => void;
}

function rotateRight(y: TreapNode): TreapNode {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  return x;
}

function rotateLeft(x: TreapNode): TreapNode {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  return y;
}

export class Treap {
  root: TreapNode | null = null;
  size = 0;
  private rng: () => number;

  constructor(rng?: () => number) {
    this.rng = rng ?? Math.random;
  }

  insert(key: number, hooks: TreapHooks = {}): void {
    const priority = this.rng();
    const before = this.size;
    this.root = this.insertNode(this.root, key, priority, hooks);
    if (this.size > before) hooks.onInsert?.(key, priority);
  }

  private insertNode(
    node: TreapNode | null,
    key: number,
    priority: number,
    hooks: TreapHooks,
  ): TreapNode {
    if (!node) {
      this.size++;
      return { key, priority, left: null, right: null };
    }
    if (key < node.key) {
      node.left = this.insertNode(node.left, key, priority, hooks);
      // 维护最小堆：若左子优先级更小则右旋
      if (node.left!.priority < node.priority) {
        hooks.onRotate?.('RIGHT', node.key);
        return rotateRight(node);
      }
    } else if (key > node.key) {
      node.right = this.insertNode(node.right, key, priority, hooks);
      if (node.right!.priority < node.priority) {
        hooks.onRotate?.('LEFT', node.key);
        return rotateLeft(node);
      }
    }
    // key === node.key：重复不插入
    return node;
  }

  search(key: number): boolean {
    let cur = this.root;
    while (cur) {
      if (key === cur.key) return true;
      cur = key < cur.key ? cur.left : cur.right;
    }
    return false;
  }

  inorder(): number[] {
    const out: number[] = [];
    const visit = (n: TreapNode | null) => {
      if (!n) return;
      visit(n.left);
      out.push(n.key);
      visit(n.right);
    };
    visit(this.root);
    return out;
  }

  /** 校验堆性质：每个节点 priority ≤ 子节点 */
  checkHeap(node: TreapNode | null = this.root): boolean {
    if (!node) return true;
    if (node.left && node.left.priority < node.priority) return false;
    if (node.right && node.right.priority < node.priority) return false;
    return this.checkHeap(node.left) && this.checkHeap(node.right);
  }
}
