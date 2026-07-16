// =============================================================================
// AVL 平衡二叉搜索树
// =============================================================================

export interface AVLNode {
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

export interface AVLImplHooks {
  onRotate?: (type: 'LL' | 'RR' | 'LR' | 'RL', pivot: number) => void;
  onInsert?: (value: number) => void;
  onSearch?: (value: number, found: boolean) => void;
}

function height(n: AVLNode | null): number {
  return n ? n.height : 0;
}

function balanceFactor(n: AVLNode | null): number {
  if (!n) return 0;
  return height(n.left) - height(n.right);
}

function updateHeight(n: AVLNode): void {
  n.height = 1 + Math.max(height(n.left), height(n.right));
}

function rotateRight(y: AVLNode): AVLNode {
  const x = y.left!;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right!;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

export class AVLTree {
  root: AVLNode | null = null;
  size = 0;

  insert(value: number, hooks: AVLImplHooks = {}): void {
    let rotations = 0;
    const before = this.size;
    this.root = this.insertNode(this.root, value, hooks, () => rotations++);
    if (this.size > before) hooks.onInsert?.(value);
  }

  private insertNode(
    node: AVLNode | null,
    value: number,
    hooks: AVLImplHooks,
    markRot: () => void,
  ): AVLNode {
    if (!node) {
      this.size++;
      return { value, height: 1, left: null, right: null };
    }
    if (value < node.value) node.left = this.insertNode(node.left, value, hooks, markRot);
    else if (value > node.value) node.right = this.insertNode(node.right, value, hooks, markRot);
    else return node; // 重复不插入
    updateHeight(node);
    const bf = balanceFactor(node);
    // LL
    if (bf > 1 && value < node.left!.value) {
      markRot();
      hooks.onRotate?.('LL', node.value);
      return rotateRight(node);
    }
    // RR
    if (bf < -1 && value > node.right!.value) {
      markRot();
      hooks.onRotate?.('RR', node.value);
      return rotateLeft(node);
    }
    // LR
    if (bf > 1 && value > node.left!.value) {
      markRot();
      hooks.onRotate?.('LR', node.left!.value);
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }
    // RL
    if (bf < -1 && value < node.right!.value) {
      markRot();
      hooks.onRotate?.('RL', node.right!.value);
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }
    return node;
  }

  search(value: number, hooks: AVLImplHooks = {}): boolean {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) {
        hooks.onSearch?.(value, true);
        return true;
      }
      cur = value < cur.value ? cur.left : cur.right;
    }
    hooks.onSearch?.(value, false);
    return false;
  }

  inorder(): number[] {
    const out: number[] = [];
    const visit = (n: AVLNode | null) => {
      if (!n) return;
      visit(n.left);
      out.push(n.value);
      visit(n.right);
    };
    visit(this.root);
    return out;
  }
}
