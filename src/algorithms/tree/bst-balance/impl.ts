// =============================================================================
// 平衡二叉搜索树（Balance BST / DSW 算法）· 纯算法实现（零 DOM 依赖，可独立单测）
// 把任意 BST 重建为高度平衡的 BST：中序得有序数组，再二分取中点递归建树。
// =============================================================================

/** BST 节点（纯数据，无父指针）。 */
export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BalanceHooks {
  /** 中序遍历收集到一个值。 */
  onCollect?: (value: number) => void;
  /** 用某个值创建一个新（平衡树中的）节点。 */
  onCreate?: (value: number) => void;
}

/**
 * 把一棵 BST 重建为**高度平衡**的 BST（任一节点左右子树高度差 ≤ 1）。
 *
 * 算法（中序 + 二分建树，DSW 的简洁等价形式）：
 *
 * 1. **中序遍历**原 BST，得到严格升序数组 `arr`（`O(n)`）
 * 2. **二分取中点递归建树**：对 `arr[lo..hi]`，取 `mid = (lo+hi)/2` 为子树根，
 *    左半 `arr[lo..mid-1]` 为左子树、右半 `arr[mid+1..hi]` 为右子树
 *
 * 直观理解：中序数组的中位数当根，能使左右子树节点数尽量相等 → 高度 `⌈log₂(n+1)⌉`，
 * 达到理论最小。这是「**最优平衡 BST**」（不同于 AVL/红黑树会在插入时动态平衡）。
 *
 * **与 DSW 的关系**：经典 DSW 算法（Day–Stout–Warren）用「右链 + 左旋」原地完成、
 * 不需数组；本实现用「中序数组 + 二分建树」更直观易懂，结果同样是完美平衡的 BST。
 *
 * - 时间 `O(n)`、空间 `O(n)`（存中序数组）
 * - 适合「**一次性重建**」平衡（批量插入导致退化为链后调用）
 *
 * @param root 原 BST 根
 * @param hooks 可选的事件钩子
 * @returns 平衡后的新 BST 根
 */
export function bstBalance(root: BSTNode | null, hooks: BalanceHooks = {}): BSTNode | null {
  // 1. 中序收集
  const arr: number[] = [];
  const collect = (n: BSTNode | null): void => {
    if (!n) return;
    collect(n.left);
    arr.push(n.value);
    hooks.onCollect?.(n.value);
    collect(n.right);
  };
  collect(root);

  // 2. 二分建树
  const build = (lo: number, hi: number): BSTNode | null => {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const node: BSTNode = { value: arr[mid]!, left: null, right: null };
    hooks.onCreate?.(arr[mid]!);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, arr.length - 1);
}

/** 从（已升序的）数组构建一棵 BST（供测试与演示）。 */
export function bstFromSorted(arr: readonly number[]): BSTNode | null {
  const build = (lo: number, hi: number): BSTNode | null => {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return { value: arr[mid]!, left: build(lo, mid - 1), right: build(mid + 1, hi) };
  };
  return build(0, arr.length - 1);
}

/** 中序遍历（应得升序）。 */
export function inorder(root: BSTNode | null): number[] {
  const out: number[] = [];
  const walk = (n: BSTNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.value);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 计算树高（空树 0）。 */
export function height(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}

/** 校验是否平衡（任意节点左右子树高度差 ≤ 1）。 */
export function isBalanced(root: BSTNode | null): boolean {
  const check = (n: BSTNode | null): number => {
    if (!n) return 0;
    const lh = check(n.left);
    if (lh < 0) return -1;
    const rh = check(n.right);
    if (rh < 0) return -1;
    if (Math.abs(lh - rh) > 1) return -1;
    return 1 + Math.max(lh, rh);
  };
  return check(root) >= 0;
}
