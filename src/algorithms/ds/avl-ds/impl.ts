// =============================================================================
// AVL 平衡二叉树（数据结构封装版）AVLTree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：自平衡 BST。插入后沿回溯路径更新高度并旋转，保证 |bf| ≤ 1。
//   - 旋转类型：LL（右旋）、RR（左旋）、LR（左旋右旋）、RL（右旋左旋）。
//   - 与 tree/avl-tree（函数版）不同：本版本是封装的「数据结构」类，支持
//     insert / search / remove / 范围查询，并暴露详细的旋转钩子。
// =============================================================================

/** AVL 节点。 */
export interface AVLDSNode {
  value: number;
  left: AVLDSNode | null;
  right: AVLDSNode | null;
  height: number;
}

/** 旋转类型。 */
export type RotType = 'LL' | 'RR' | 'LR' | 'RL';

/** AVL 操作过程中的事件钩子。任一可选。 */
export interface AVLDSHooks {
  /** 比较 value 与节点值，dir 为走向。 */
  onCompare?: (value: number, nodeValue: number, dir: 'left' | 'right' | 'equal') => void;
  /** 插入了一个新节点（值）。 */
  onInsert?: (value: number) => void;
  /** 发生旋转：type + pivot 值。 */
  onRotate?: (type: RotType, pivot: number) => void;
  /** 检测到失衡（|bf| > 1）。 */
  onUnbalanced?: (pivot: number, balance: number) => void;
  /** 删除了一个节点（值）。 */
  onRemove?: (value: number) => void;
}

function height(n: AVLDSNode | null): number {
  return n ? n.height : 0;
}

function updateHeight(n: AVLDSNode): void {
  n.height = 1 + Math.max(height(n.left), height(n.right));
}

function balanceFactor(n: AVLDSNode): number {
  return height(n.left) - height(n.right);
}

function rotateRight(y: AVLDSNode): AVLDSNode {
  const x = y.left!;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function rotateLeft(x: AVLDSNode): AVLDSNode {
  const y = x.right!;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

/**
 * AVL 平衡二叉搜索树（数据结构封装）。
 * 插入 / 删除 / 查询均 O(log n)。
 */
export class AVLTree {
  /** 根节点。 */
  root: AVLDSNode | null = null;
  /** 元素个数。 */
  private count = 0;

  get size(): number {
    return this.count;
  }

  /** 插入 value（重复值不插入）。 */
  insert(value: number, hooks: AVLDSHooks = {}): boolean {
    let inserted = false;
    const ins = (node: AVLDSNode | null): AVLDSNode => {
      if (node === null) {
        inserted = true;
        return { value, left: null, right: null, height: 1 };
      }
      if (value < node.value) {
        hooks.onCompare?.(value, node.value, 'left');
        node.left = ins(node.left);
      } else if (value > node.value) {
        hooks.onCompare?.(value, node.value, 'right');
        node.right = ins(node.right);
      } else {
        hooks.onCompare?.(value, node.value, 'equal');
        return node;
      }
      return this.rebalance(node, value, hooks);
    };
    this.root = ins(this.root);
    if (inserted) {
      this.count++;
      hooks.onInsert?.(value);
    }
    return inserted;
  }

  /** 对 node 做高度更新与平衡旋转（用 value 判定旋转类型）。 */
  private rebalance(node: AVLDSNode, value: number, hooks: AVLDSHooks): AVLDSNode {
    updateHeight(node);
    const bf = balanceFactor(node);
    if (Math.abs(bf) <= 1) return node;
    hooks.onUnbalanced?.(node.value, bf);
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

  /** 查找 value 是否存在。 */
  search(value: number, hooks: AVLDSHooks = {}): boolean {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) {
        hooks.onCompare?.(value, cur.value, 'equal');
        return true;
      }
      if (value < cur.value) {
        hooks.onCompare?.(value, cur.value, 'left');
        cur = cur.left;
      } else {
        hooks.onCompare?.(value, cur.value, 'right');
        cur = cur.right;
      }
    }
    return false;
  }

  /** 删除 value（不存在则无操作）。删除内部也可能触发旋转。 */
  remove(value: number, hooks: AVLDSHooks = {}): boolean {
    let removed = false;
    const del = (node: AVLDSNode | null): AVLDSNode | null => {
      if (node === null) return null;
      if (value < node.value) {
        hooks.onCompare?.(value, node.value, 'left');
        node.left = del(node.left);
      } else if (value > node.value) {
        hooks.onCompare?.(value, node.value, 'right');
        node.right = del(node.right);
      } else {
        removed = true;
        hooks.onRemove?.(value);
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;
        // 取右子树最小值替换
        let succ = node.right;
        while (succ.left) succ = succ.left;
        node.value = succ.value;
        node.right = delMin(node.right);
      }
      return this.rebalanceDelete(node);
    };
    this.root = del(this.root);
    if (removed) this.count--;
    return removed;
  }

  /** 删除后重新平衡（用子树高度差判定旋转类型，不依赖单一 value）。 */
  private rebalanceDelete(node: AVLDSNode): AVLDSNode {
    updateHeight(node);
    const bf = balanceFactor(node);
    if (bf > 1 && balanceFactor(node.left!) >= 0) return rotateRight(node); // LL
    if (bf > 1 && balanceFactor(node.left!) < 0) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node); // LR
    }
    if (bf < -1 && balanceFactor(node.right!) <= 0) return rotateLeft(node); // RR
    if (bf < -1 && balanceFactor(node.right!) > 0) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node); // RL
    }
    return node;
  }

  /** 中序遍历 → 升序数组。 */
  toArray(): number[] {
    const out: number[] = [];
    const walk = (n: AVLDSNode | null): void => {
      if (!n) return;
      walk(n.left);
      out.push(n.value);
      walk(n.right);
    };
    walk(this.root);
    return out;
  }

  /** 树高（空树 0）。 */
  height(): number {
    return height(this.root);
  }

  /** 校验是否满足 AVL 性质（平衡 + BST 序）。 */
  isValid(): boolean {
    const check = (n: AVLDSNode | null): number => {
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
    return check(this.root) >= 0;
  }
}

/** 取以 node 为根子树的最小节点并删除它（node 必有左子树时调用前已保证）。 */
function delMin(node: AVLDSNode): AVLDSNode | null {
  if (node.left === null) return node.right;
  node.left = delMin(node.left);
  updateHeight(node);
  return node;
}

/**
 * 便利函数：批量插入值构造 AVL 树，返回实例。
 * 每步通过 hooks 暴露。
 */
export function avlDs(values: readonly number[], hooks: AVLDSHooks = {}): AVLTree {
  const tree = new AVLTree();
  for (const v of values) tree.insert(v, hooks);
  return tree;
}
