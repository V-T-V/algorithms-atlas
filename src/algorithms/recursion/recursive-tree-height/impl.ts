// 递归求树高 · 纯算法实现

export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/** 从层序数组（含 null 占位）构建二叉树。 */
export function buildTree(values: Array<number | null>): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root: TreeNode = { value: values[0]!, left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length && values[i] !== null) {
      node.left = { value: values[i]!, left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      node.right = { value: values[i]!, left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

/** 事件钩子。 */
export interface TreeHeightHooks {
  /** 访问某节点（给出值与深度）。 */
  onVisit?: (value: number, depth: number) => void;
  /** 空子树基线。 */
  onBase?: (depth: number) => void;
  /** 某节点返回其子树高度。 */
  onReturn?: (value: number, height: number, depth: number) => void;
}

/**
 * 递归求二叉树高度。
 */
export function treeHeight(
  root: TreeNode | null,
  hooks: TreeHeightHooks = {},
  depth: number = 0,
): number {
  if (root === null) {
    hooks.onBase?.(depth);
    return 0;
  }
  hooks.onVisit?.(root.value, depth);
  const lh = treeHeight(root.left, hooks, depth + 1);
  const rh = treeHeight(root.right, hooks, depth + 1);
  const h = 1 + Math.max(lh, rh);
  hooks.onReturn?.(root.value, h, depth);
  return h;
}
