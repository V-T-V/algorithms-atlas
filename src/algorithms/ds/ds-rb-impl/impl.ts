// =============================================================================
// 左倾红黑树（LLRB）
// =============================================================================

export type Color = 'RED' | 'BLACK';

export interface RBNode {
  value: number;
  color: Color;
  left: RBNode | null;
  right: RBNode | null;
}

export interface RBImplHooks {
  onRotate?: (type: 'LEFT' | 'RIGHT', pivot: number) => void;
  onFlip?: (parent: number) => void;
  onInsert?: (value: number) => void;
}

function isRed(n: RBNode | null): boolean {
  return n !== null && n.color === 'RED';
}

function rotateLeft(h: RBNode): RBNode {
  const x = h.right!;
  h.right = x.left;
  x.left = h;
  x.color = h.color;
  h.color = 'RED';
  return x;
}

function rotateRight(h: RBNode): RBNode {
  const x = h.left!;
  h.left = x.right;
  x.right = h;
  x.color = h.color;
  h.color = 'RED';
  return x;
}

function flipColors(h: RBNode): void {
  h.color = h.color === 'RED' ? 'BLACK' : 'RED';
  if (h.left) h.left.color = h.left.color === 'RED' ? 'BLACK' : 'RED';
  if (h.right) h.right.color = h.right.color === 'RED' ? 'BLACK' : 'RED';
}

export class RBTree {
  root: RBNode | null = null;
  size = 0;

  insert(value: number, hooks: RBImplHooks = {}): void {
    const before = this.size;
    this.root = this.insertNode(this.root, value, hooks);
    this.root!.color = 'BLACK';
    if (this.size > before) hooks.onInsert?.(value);
  }

  private insertNode(h: RBNode | null, value: number, hooks: RBImplHooks): RBNode {
    if (!h) {
      this.size++;
      return { value, color: 'RED', left: null, right: null };
    }
    if (value < h.value) h.left = this.insertNode(h.left, value, hooks);
    else if (value > h.value) h.right = this.insertNode(h.right, value, hooks);
    else return h; // 重复

    if (isRed(h.right) && !isRed(h.left)) {
      hooks.onRotate?.('LEFT', h.value);
      h = rotateLeft(h);
    }
    if (isRed(h.left) && isRed(h.left!.left)) {
      hooks.onRotate?.('RIGHT', h.value);
      h = rotateRight(h);
    }
    if (isRed(h.left) && isRed(h.right)) {
      hooks.onFlip?.(h.value);
      flipColors(h);
    }
    return h;
  }

  search(value: number): boolean {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
  }

  inorder(): number[] {
    const out: number[] = [];
    const visit = (n: RBNode | null) => {
      if (!n) return;
      visit(n.left);
      out.push(n.value);
      visit(n.right);
    };
    visit(this.root);
    return out;
  }
}
