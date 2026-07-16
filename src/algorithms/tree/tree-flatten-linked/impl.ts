// =============================================================================
// 展开为链表（Flatten to Linked List）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FlattenHooks {
  /** 把左链插到当前节点下（节点值 v）。 */
  onSplice?: (v: number) => void;
  /** 完成。 */
  onDone?: () => void;
}

/** 深拷贝树。 */
function clone(node: BTNode | null): BTNode | null {
  if (!node) return null;
  return { value: node.value, left: clone(node.left), right: clone(node.right) };
}

/**
 * 把二叉树展开为「前序单链表」（克隆后操作，不改原树）。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 展开后的链表头（同 root）
 */
export function flattenToLinked(root: BTNode | null, hooks: FlattenHooks = {}): BTNode | null {
  const nr = clone(root);
  const flatten = (node: BTNode | null): BTNode | null => {
    if (!node) return null;
    const leftChain = flatten(node.left);
    const rightChain = flatten(node.right);
    if (leftChain !== null) {
      hooks.onSplice?.(node.value);
      // 把 leftChain 接到 node.right，再把原 rightChain 接到 leftChain 末尾
      node.right = leftChain;
      node.left = null;
      let tail: BTNode = leftChain;
      while (tail.right !== null) tail = tail.right;
      tail.right = rightChain;
    } else {
      node.left = null;
      node.right = rightChain;
    }
    return node;
  };
  flatten(nr);
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

/** 沿 right 链收集值序列（便于断言）。 */
export function rightChainValues(root: BTNode | null): number[] {
  const out: number[] = [];
  let cur = root;
  while (cur !== null) {
    out.push(cur.value);
    if (cur.left !== null) out.push(NaN); // 标记：left 必须为 null
    cur = cur.right;
  }
  return out;
}
