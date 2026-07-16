// =============================================================================
// 二叉搜索树删除（BST Delete）· 纯算法实现（零 DOM 依赖，可独立单测）
// 删除指定值节点，分三种情况：叶子、单子、双子（用中序后继替换）。
// =============================================================================

/** BST 节点（纯数据，无父指针）。 */
export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

/** 删除时遇到的情况分类。 */
export type DeleteCase = 'leaf' | 'single-child' | 'two-children' | 'not-found';

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DeleteHooks {
  /** 在比较 value 与节点值时。 */
  onCompare?: (value: number, nodeValue: number, dir: 'left' | 'right' | 'equal') => void;
  /** 找到待删节点并判定其情况。 */
  onFound?: (value: number, caseType: DeleteCase) => void;
  /** 找到中序后继（用于双子情况替换）。 */
  onSuccessor?: (succValue: number) => void;
}

/** BST 删除结果。 */
export interface BSTDeleteResult {
  root: BSTNode | null;
  deleted: boolean;
}

/**
 * 从 BST 中删除值为 `value` 的节点，返回新根。
 *
 * 三种情况：
 *
 * 1. **叶子节点**：直接摘除（父指针置 null）
 * 2. **只有一个子节点**：用该子节点「顶替」被删节点（绕过它）
 * 3. **有两个子节点**：找到**中序后继**（右子树的最小值），把它的值复制到被删节点，
 *    然后在右子树中递归删除该后继（后继最多有一个右子，转化为情况 1/2）
 *
 * 直观理解：情况 1、2 是「物理移除」；情况 3 用「**值替换**」避免大规模结构改动——
 * 中序后继一定大于被删节点且小于其右子树所有其他值，替换后仍保持 BST 性质。
 *
 * - 用中序后继会让树逐渐**向左倾斜**（右子树被挖走一个）；
 *   也可用中序前驱（左子树最大值）以平衡倾向。
 * - 单次删除 `O(h)`（h 为树高）；退化 BST 上最坏 `O(n)`
 *
 * @param root 原 BST 根
 * @param value 要删除的值
 * @param hooks 可选的事件钩子
 * @returns 新根 + 是否成功删除
 */
export function bstDelete(
  root: BSTNode | null,
  value: number,
  hooks: DeleteHooks = {},
): BSTDeleteResult {
  let deleted = false;
  const newRoot = removeValue(root, value, hooks, () => {
    deleted = true;
  });
  return { root: newRoot, deleted };
}

/** 实际的递归删除（清晰版）。 */
function removeValue(
  node: BSTNode | null,
  value: number,
  hooks: DeleteHooks,
  markDeleted: () => void,
): BSTNode | null {
  if (!node) {
    hooks.onFound?.(value, 'not-found');
    return null;
  }
  if (value < node.value) {
    hooks.onCompare?.(value, node.value, 'left');
    node.left = removeValue(node.left, value, hooks, markDeleted);
    return node;
  }
  if (value > node.value) {
    hooks.onCompare?.(value, node.value, 'right');
    node.right = removeValue(node.right, value, hooks, markDeleted);
    return node;
  }
  // 命中
  markDeleted();
  if (!node.left && !node.right) {
    hooks.onFound?.(value, 'leaf');
    return null;
  }
  if (!node.left) {
    hooks.onFound?.(value, 'single-child');
    return node.right;
  }
  if (!node.right) {
    hooks.onFound?.(value, 'single-child');
    return node.left;
  }
  hooks.onFound?.(value, 'two-children');
  // 中序后继 = 右子树最小值
  let succ = node.right;
  while (succ.left) succ = succ.left;
  hooks.onSuccessor?.(succ.value);
  node.value = succ.value;
  node.right = removeValue(node.right, succ.value, hooks, () => {});
  return node;
}

/** 顺序插入构建 BST。 */
export function bstInsert(values: readonly number[]): BSTNode | null {
  let root: BSTNode | null = null;
  const insert = (node: BSTNode | null, v: number): BSTNode => {
    if (!node) return { value: v, left: null, right: null };
    if (v < node.value) node.left = insert(node.left, v);
    else if (v > node.value) node.right = insert(node.right, v);
    return node;
  };
  for (const v of values) root = insert(root, v);
  return root;
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
