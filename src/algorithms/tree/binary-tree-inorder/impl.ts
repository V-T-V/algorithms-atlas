// =============================================================================
// 二叉树中序遍历（Inorder Traversal）· 纯算法实现（零 DOM 依赖，可独立单测）
// 顺序：左 → 根 → 右。对二叉搜索树会得到升序序列。
// =============================================================================

/** 二叉树节点（纯数据，无父指针）。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface InorderHooks {
  /** 访问一个节点（输出它）。 */
  onVisit?: (value: number) => void;
}

/**
 * 中序遍历（递归版）：左 → 根 → 右。
 *
 * 对每个节点先递归左子树，再访问自身，最后递归右子树。
 *
 * **关键性质**：对**二叉搜索树**，中序遍历得到**严格升序**序列——这是 BST 判定、
 * 范围查询、中序后继等操作的基础。
 *
 * 表达式树的中序遍历得到**中缀表达式**（需加括号保证优先级）。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 中序访问序列
 */
export function binaryTreeInorder(root: BTNode | null, hooks: InorderHooks = {}): number[] {
  const out: number[] = [];
  const walk = (n: BTNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.value);
    hooks.onVisit?.(n.value);
    walk(n.right);
  };
  walk(root);
  return out;
}

/**
 * 中序遍历（迭代版）：沿左链一路压栈到底，弹出访问后转向右子树。
 * 经典「栈 + 当前指针」模式。
 */
export function binaryTreeInorderIter(root: BTNode | null, hooks: InorderHooks = {}): number[] {
  const out: number[] = [];
  const stack: BTNode[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;
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
