// =============================================================================
// 树排序 Tree Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** BST 节点。 */
interface BstNode {
  value: number;
  left: BstNode | null;
  right: BstNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TreeSortHooks {
  /** 把值 v 插入 BST（插入前树中已有 size 个节点）。 */
  onInsert?: (v: number, size: number) => void;
  /** 中序遍历访问到值 v（按升序）。 */
  onVisit?: (v: number) => void;
}

/**
 * 树排序（Tree Sort）。
 *
 * 原理：\n- 把所有元素依次插入一棵**二叉搜索树（BST）**\n- 对 BST 做**中序遍历**，得到的序列即为升序
 *
 * - 平均时间 `O(n log n)`（BST 平衡时）；最坏 `O(n²)`（输入已有序导致退化成链）
 * - 空间 `O(n)`（BST 节点 + 递归栈）
 * - 稳定性：本实现**稳定**（相等元素放右子树，保持插入顺序）
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function treeSort(arr: readonly number[], hooks: TreeSortHooks = {}): number[] {
  let root: BstNode | null = null;
  let size = 0;

  for (const v of arr) {
    hooks.onInsert?.(v, size);
    root = insert(root, v);
    size++;
  }

  const out: number[] = [];
  inorder(root, (v) => {
    out.push(v);
    hooks.onVisit?.(v);
  });
  return out;
}

/** 把 v 插入 BST；相等元素放右子树以保证稳定。 */
function insert(node: BstNode | null, v: number): BstNode {
  if (node === null) return { value: v, left: null, right: null };
  if (v < node.value) node.left = insert(node.left, v);
  else node.right = insert(node.right, v); // v >= node.value → 右子树
  return node;
}

/** 中序遍历 BST，按升序回调。 */
function inorder(node: BstNode | null, visit: (v: number) => void): void {
  if (node === null) return;
  inorder(node.left, visit);
  visit(node.value);
  inorder(node.right, visit);
}
