// =============================================================================
// AVL 平衡二叉树 · 纯算法实现
// 自平衡二叉搜索树：插入后通过旋转维持「左右子树高度差 ≤ 1」。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** AVL 节点（纯数据，无父指针）。 */
export interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
}

export interface AVLHooks {
  /** 比较 value 与节点 node.value（dir: 'left' | 'right'）。 */
  onCompare?: (value: number, nodeValue: number, dir: 'left' | 'right') => void;
  /** 插入了一个新节点。 */
  onInsert?: (value: number) => void;
  /** 发生旋转：type 为 'LL'|'RR'|'LR'|'RL'，围绕 pivotValue。 */
  onRotate?: (type: 'LL' | 'RR' | 'LR' | 'RL', pivotValue: number) => void;
  /** 检测到失衡（balance 因子绝对值 > 1）。 */
  onUnbalanced?: (pivotValue: number, balance: number) => void;
}

function height(n: AVLNode | null): number {
  return n ? n.height : 0;
}

function updateHeight(n: AVLNode): void {
  n.height = 1 + Math.max(height(n.left), height(n.right));
}

/** 平衡因子 = 左高 - 右高。 */
function balanceFactor(n: AVLNode): number {
  return height(n.left) - height(n.right);
}

/** 右旋（LL 型失衡）。 */
function rotateRight(y: AVLNode): AVLNode {
  const x = y.left!;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

/** 左旋（RR 型失衡）。 */
function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right!;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

/** 在子树 node 上插入 value，返回平衡后的新子树根。 */
function insertNode(node: AVLNode | null, value: number, hooks: AVLHooks): AVLNode {
  // 1. 标准 BST 插入
  if (node === null) {
    hooks.onInsert?.(value);
    return { value, left: null, right: null, height: 1 };
  }
  if (value < node.value) {
    hooks.onCompare?.(value, node.value, 'left');
    node.left = insertNode(node.left, value, hooks);
  } else if (value > node.value) {
    hooks.onCompare?.(value, node.value, 'right');
    node.right = insertNode(node.right, value, hooks);
  } else {
    // 重复值不插入
    return node;
  }

  // 2. 更新高度
  updateHeight(node);

  // 3. 检查平衡并旋转
  const bf = balanceFactor(node);
  if (Math.abs(bf) > 1) hooks.onUnbalanced?.(node.value, bf);

  // LL
  if (bf > 1 && value < node.left!.value) {
    hooks.onRotate?.('LL', node.value);
    return rotateRight(node);
  }
  // RR
  if (bf < -1 && value > node.right!.value) {
    hooks.onRotate?.('RR', node.value);
    return rotateLeft(node);
  }
  // LR
  if (bf > 1 && value > node.left!.value) {
    hooks.onRotate?.('LR', node.value);
    node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }
  // RL
  if (bf < -1 && value < node.right!.value) {
    hooks.onRotate?.('RL', node.value);
    node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }

  return node;
}

/** 顺序插入 values，返回最终 AVL 树根。 */
export function avlInsert(values: readonly number[], hooks: AVLHooks = {}): AVLNode | null {
  let root: AVLNode | null = null;
  for (const v of values) {
    root = insertNode(root, v, hooks);
  }
  return root;
}

/** 中序遍历（应得到升序序列）。 */
export function inorder(root: AVLNode | null): number[] {
  const out: number[] = [];
  const walk = (n: AVLNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.value);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 校验一棵树是否满足 AVL 性质（平衡 + BST 序）。 */
export function isAVL(root: AVLNode | null): boolean {
  const check = (n: AVLNode | null): number => {
    if (!n) return 0;
    const lh = check(n.left);
    if (lh < 0) return -1;
    const rh = check(n.right);
    if (rh < 0) return -1;
    if (Math.abs(lh - rh) > 1) return -1;
    if (n.left && n.left.value >= n.value) return -1;
    if (n.right && n.right.value <= n.value) return -1;
    return 1 + Math.max(lh, rh);
  };
  return check(root) >= 0;
}
