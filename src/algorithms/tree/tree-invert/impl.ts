// =============================================================================
// 翻转二叉树（Invert Binary Tree）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface InvertHooks {
  /** 交换节点 value 的左右子树。 */
  onSwap?: (value: number) => void;
  /** 完成。 */
  onDone?: () => void;
}

/** 深拷贝树。 */
function clone(node: BTNode | null): BTNode | null {
  if (!node) return null;
  return { value: node.value, left: clone(node.left), right: clone(node.right) };
}

/**
 * 翻转二叉树（克隆后操作，不改原树）。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 翻转后的新树根
 */
export function invertTree(root: BTNode | null, hooks: InvertHooks = {}): BTNode | null {
  const nr = clone(root);
  const invert = (n: BTNode | null): BTNode | null => {
    if (!n) return null;
    hooks.onSwap?.(n.value);
    const tmp = n.left;
    n.left = n.right;
    n.right = tmp;
    invert(n.left);
    invert(n.right);
    return n;
  };
  invert(nr);
  hooks.onDone?.();
  return nr;
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

/** 层序序列化（含 null 占位，便于比较）。 */
export function levelOrder(root: BTNode | null): Array<number | null> {
  if (!root) return [];
  const out: Array<number | null> = [];
  const queue: Array<BTNode | null> = [root];
  while (queue.length > 0) {
    const n = queue.shift()!;
    if (n === null) {
      out.push(null);
      continue;
    }
    out.push(n.value);
    queue.push(n.left);
    queue.push(n.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}
