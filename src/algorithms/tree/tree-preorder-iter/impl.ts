// =============================================================================
// 前序遍历迭代版（Preorder Iterative）· 纯算法实现
// 用显式栈模拟递归，便于可视化栈状态。零 DOM 依赖，可独立单测。
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PreorderIterHooks {
  /** 访问一个节点（输出它）。 */
  onVisit?: (value: number) => void;
  /** 把节点压栈。 */
  onPush?: (value: number) => void;
  /** 把节点弹出栈。 */
  onPop?: (value: number) => void;
}

/**
 * 前序遍历（迭代版）：根 → 左 → 右。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 前序访问序列
 */
export function preorderIter(root: BTNode | null, hooks: PreorderIterHooks = {}): number[] {
  if (!root) return [];
  const out: number[] = [];
  const stack: BTNode[] = [root];
  hooks.onPush?.(root.value);
  while (stack.length > 0) {
    const n = stack.pop()!;
    hooks.onPop?.(n.value);
    out.push(n.value);
    hooks.onVisit?.(n.value);
    // 先压右再压左 → 左先出栈
    if (n.right) {
      stack.push(n.right);
      hooks.onPush?.(n.right.value);
    }
    if (n.left) {
      stack.push(n.left);
      hooks.onPush?.(n.left.value);
    }
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
