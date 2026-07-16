// =============================================================================
// 左倾红黑树（LLRB）
// =============================================================================

export interface RBNode {
  value: number;
  left: RBNode | null;
  right: RBNode | null;
  red: boolean; // 与父的链接是否红
}

export interface RBHooks {
  onInsert?: (v: number) => void;
  onRotate?: (kind: 'L' | 'R', pivot: number) => void;
  onFlip?: (pivot: number) => void;
  onDone?: (root: RBNode | null) => void;
}

function isRed(n: RBNode | null): boolean {
  return n !== null && n.red;
}

function rotateLeft(h: RBNode, hooks: RBHooks): RBNode {
  const x = h.right!;
  hooks.onRotate?.('L', h.value);
  h.right = x.left;
  x.left = h;
  x.red = h.red;
  h.red = true;
  return x;
}

function rotateRight(h: RBNode, hooks: RBHooks): RBNode {
  const x = h.left!;
  hooks.onRotate?.('R', h.value);
  h.left = x.right;
  x.right = h;
  x.red = h.red;
  h.red = true;
  return x;
}

function flipColors(h: RBNode, hooks: RBHooks): void {
  hooks.onFlip?.(h.value);
  h.red = !h.red;
  if (h.left) h.left.red = !h.left.red;
  if (h.right) h.right.red = !h.right.red;
}

export class RBTree {
  root: RBNode | null = null;
  constructor(private hooks: RBHooks = {}) {}

  insert(v: number): void {
    this.hooks.onInsert?.(v);
    this.root = this.insertNode(this.root, v);
    if (this.root) this.root.red = false;
  }
  private insertNode(h: RBNode | null, v: number): RBNode {
    if (!h) return { value: v, left: null, right: null, red: true };
    if (v < h.value) h.left = this.insertNode(h.left, v);
    else if (v > h.value) h.right = this.insertNode(h.right, v);
    // 修复
    if (isRed(h.right) && !isRed(h.left)) h = rotateLeft(h, this.hooks);
    if (isRed(h.left) && isRed(h.left!.left)) h = rotateRight(h, this.hooks);
    if (isRed(h.left) && isRed(h.right)) flipColors(h, this.hooks);
    return h;
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
