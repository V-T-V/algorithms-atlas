// =============================================================================
// 二叉树后序遍历（Postorder Traversal）· 纯算法实现（零 DOM 依赖，可独立单测）
// 顺序：左 → 右 → 根。根最后访问，适合「先处理子树再处理自身」的场景。
// =============================================================================

/** 二叉树节点（纯数据，无父指针）。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PostorderHooks {
  /** 访问一个节点（输出它）。 */
  onVisit?: (value: number) => void;
}

/**
 * 后序遍历（递归版）：左 → 右 → 根。
 *
 * 对每个节点先递归左子树、再递归右子树，最后访问自身（**根在最后**）。
 *
 * **特点**：
 * - 根最后被访问，子树一定先于父节点处理——天然适合「**自底向上**」计算：
 *   - 计算目录大小（先算子目录）
 *   - 释放/删除树（先释放子节点再释放自身，避免悬空指针）
 *   - 表达式树求值（先算子表达式）
 * - 表达式树的后序遍历得到**逆波兰表示法**（后缀表达式），如 `3 4 + 5 *` = `(3+4)*5`
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 后序访问序列
 */
export function binaryTreePostorder(root: BTNode | null, hooks: PostorderHooks = {}): number[] {
  const out: number[] = [];
  const walk = (n: BTNode | null): void => {
    if (!n) return;
    walk(n.left);
    walk(n.right);
    out.push(n.value);
    hooks.onVisit?.(n.value);
  };
  walk(root);
  return out;
}

/**
 * 后序遍历（迭代版）：用「根→右→左」的前序结果的逆序得到「左→右→根」。
 * 即：先按「根→右→左」前序遍历（栈：先压左、再压右），最后把结果反转。
 */
export function binaryTreePostorderIter(root: BTNode | null, hooks: PostorderHooks = {}): number[] {
  if (!root) return [];
  const rev: number[] = [];
  const stack: BTNode[] = [root];
  while (stack.length > 0) {
    const n = stack.pop()!;
    rev.push(n.value);
    if (n.left) stack.push(n.left); // 先压左
    if (n.right) stack.push(n.right); // 再压右 → 右先出
  }
  // rev 是「根→右→左」，反转得「左→右→根」
  rev.reverse();
  for (const v of rev) hooks.onVisit?.(v);
  return rev;
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
