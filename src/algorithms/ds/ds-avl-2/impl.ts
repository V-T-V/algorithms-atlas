// =============================================================================
// AVL 树（迭代插入）
// =============================================================================

export interface AvlNode {
  value: number;
  left: AvlNode | null;
  right: AvlNode | null;
  height: number;
}

export interface AvlHooks {
  onInsert?: (value: number) => void;
  onRotate?: (kind: 'LL' | 'RR' | 'LR' | 'RL', pivot: number) => void;
  onDone?: (root: AvlNode | null) => void;
}

function h(n: AvlNode | null): number {
  return n ? n.height : 0;
}
function updH(n: AvlNode): void {
  n.height = 1 + Math.max(h(n.left), h(n.right));
}
function bf(n: AvlNode): number {
  return h(n.left) - h(n.right);
}
function rotateR(y: AvlNode): AvlNode {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  updH(y);
  updH(x);
  return x;
}
function rotateL(x: AvlNode): AvlNode {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  updH(x);
  updH(y);
  return y;
}

export class AvlTree2 {
  root: AvlNode | null = null;
  constructor(private hooks: AvlHooks = {}) {}

  insert(v: number): void {
    this.hooks.onInsert?.(v);
    this.root = this.insertNode(this.root, v);
  }
  private insertNode(node: AvlNode | null, v: number): AvlNode {
    if (!node) return { value: v, left: null, right: null, height: 1 };
    if (v < node.value) node.left = this.insertNode(node.left, v);
    else if (v > node.value) node.right = this.insertNode(node.right, v);
    else return node;
    updH(node);
    const b = bf(node);
    if (b > 1 && v < node.left!.value) {
      this.hooks.onRotate?.('LL', node.value);
      return rotateR(node);
    }
    if (b < -1 && v > node.right!.value) {
      this.hooks.onRotate?.('RR', node.value);
      return rotateL(node);
    }
    if (b > 1 && v > node.left!.value) {
      this.hooks.onRotate?.('LR', node.value);
      node.left = rotateL(node.left!);
      return rotateR(node);
    }
    if (b < -1 && v < node.right!.value) {
      this.hooks.onRotate?.('RL', node.value);
      node.right = rotateR(node.right!);
      return rotateL(node);
    }
    return node;
  }
  contains(v: number): boolean {
    let cur = this.root;
    while (cur) {
      if (v === cur.value) return true;
      cur = v < cur.value ? cur.left : cur.right;
    }
    return false;
  }
}
