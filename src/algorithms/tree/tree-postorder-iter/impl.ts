// =============================================================================
// 后序遍历迭代版（Postorder Iterative）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PostorderIterHooks {
  /** 访问一个节点（输出它）。 */
  onVisit?: (value: number) => void;
}

/**
 * 后序遍历（迭代版）：左 → 右 → 根。
 *
 * 用「根→右→左」前序的逆序实现。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 */
export function postorderIter(root: BTNode | null, hooks: PostorderIterHooks = {}): number[] {
  if (!root) return [];
  const out: number[] = [];
  const stack: BTNode[] = [root];
  const rev: number[] = []; // 根→右→左 序列
  while (stack.length > 0) {
    const n = stack.pop()!;
    rev.push(n.value);
    // 先压左再压右 → 右先出，得到「根→右→左」
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  // 反转得到后序
  for (let i = rev.length - 1; i >= 0; i--) {
    out.push(rev[i]!);
    hooks.onVisit?.(rev[i]!);
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
