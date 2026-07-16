// =============================================================================
// 路径总和（Path Sum）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PathSumHooks {
  /** 进入节点 v，当前剩余和 remain。 */
  onVisit?: (v: number, remain: number) => void;
  /** 到达叶子，是否命中。 */
  onLeaf?: (v: number, hit: boolean) => void;
  /** 完成。 */
  onDone?: (hasPath: boolean) => void;
}

/**
 * 路径总和判定：是否存在根到叶路径之和等于 targetSum。
 *
 * @param root 树根
 * @param targetSum 目标和
 * @param hooks 可选的事件钩子
 */
export function hasPathSum(
  root: BTNode | null,
  targetSum: number,
  hooks: PathSumHooks = {},
): boolean {
  const dfs = (node: BTNode | null, remain: number): boolean => {
    if (!node) return false;
    hooks.onVisit?.(node.value, remain);
    const next = remain - node.value;
    const isLeaf = node.left === null && node.right === null;
    if (isLeaf) {
      const hit = next === 0;
      hooks.onLeaf?.(node.value, hit);
      return hit;
    }
    if (dfs(node.left, next)) return true;
    if (dfs(node.right, next)) return true;
    return false;
  };
  const result = dfs(root, targetSum);
  hooks.onDone?.(result);
  return result;
}

/** 从层序数组（含 null 表示缺位）构建二叉树。 */
export function buildTree(values: Array<number | null>): BTNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root: BTNode = { value: values[0]!, left: null, right: null };
  const queue: BTNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length) {
      const lv = values[i]!;
      if (lv !== null) {
        node.left = { value: lv, left: null, right: null };
        queue.push(node.left);
      }
      i++;
    }
    if (i < values.length) {
      const rv = values[i]!;
      if (rv !== null) {
        node.right = { value: rv, left: null, right: null };
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}
