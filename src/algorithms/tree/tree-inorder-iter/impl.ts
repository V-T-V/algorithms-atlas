// =============================================================================
// 中序遍历迭代版（Inorder Iterative）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface InorderIterHooks {
  /** 访问一个节点。 */
  onVisit?: (value: number) => void;
  /** 把节点压栈。 */
  onPush?: (value: number) => void;
  /** 把节点弹出栈。 */
  onPop?: (value: number) => void;
}

/**
 * 中序遍历（迭代版）：左 → 根 → 右。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 */
export function inorderIter(root: BTNode | null, hooks: InorderIterHooks = {}): number[] {
  const out: number[] = [];
  const stack: BTNode[] = [];
  let cur: BTNode | null = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      hooks.onPush?.(cur.value);
      cur = cur.left;
    }
    cur = stack.pop()!;
    hooks.onPop?.(cur.value);
    out.push(cur.value);
    hooks.onVisit?.(cur.value);
    cur = cur.right;
  }
  return out;
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
