// =============================================================================
// 二叉树前序遍历（Preorder Traversal）· 纯算法实现（零 DOM 依赖，可独立单测）
// 顺序：根 → 左 → 右。提供递归与迭代（显式栈）两种实现。
// =============================================================================

/** 二叉树节点（纯数据，无父指针）。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PreorderHooks {
  /** 访问一个节点（输出它）。 */
  onVisit?: (value: number) => void;
}

/**
 * 前序遍历（递归版）：根 → 左 → 右。
 *
 * 对每个节点先访问自身，再递归左子树，最后递归右子树。
 *
 * - 天然适合「复制树」「序列化（前序+中序可还原）」
 * - 深度优先，与中序/后序共享 `O(h)` 栈空间（h 为树高）
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 前序访问序列
 */
export function binaryTreePreorder(root: BTNode | null, hooks: PreorderHooks = {}): number[] {
  const out: number[] = [];
  const walk = (n: BTNode | null): void => {
    if (!n) return;
    out.push(n.value);
    hooks.onVisit?.(n.value);
    walk(n.left);
    walk(n.right);
  };
  walk(root);
  return out;
}

/**
 * 前序遍历（迭代版，显式栈）：模拟递归栈，栈顶即下一个要访问的节点。
 * 关键：先压右、再压左（这样左先出栈）。
 */
export function binaryTreePreorderIter(root: BTNode | null, hooks: PreorderHooks = {}): number[] {
  if (!root) return [];
  const out: number[] = [];
  const stack: BTNode[] = [root];
  while (stack.length > 0) {
    const n = stack.pop()!;
    out.push(n.value);
    hooks.onVisit?.(n.value);
    if (n.right) stack.push(n.right); // 先压右
    if (n.left) stack.push(n.left); // 再压左 → 左先出
  }
  return out;
}

/** 从层序数组（含 null 表示缺位）构建二叉树，便于测试与演示。 */
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
